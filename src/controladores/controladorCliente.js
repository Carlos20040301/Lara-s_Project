const { validationResult } = require('express-validator');
const Cliente = require('../modelos/Cliente');
const { where } = require('sequelize');
const Usuario = require('../modelos/Usuario');
const Venta = require('../modelos/Venta');
const sequelize = require('../configuraciones/base_datos');
const sincronizarEmpleadosYClientes = require('../scripts/sincronizarEmpleadosYClientes');

exports.listarClientes = async (req, res) => {
    const buscarClientes = await Cliente.findAll();
    res.json(buscarClientes);
}

exports.guardarCliente = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    else {
        // Mapear los campos del frontend al modelo (camelCase)
        const nuevoCliente = await Cliente.create({
            primerNombre: req.body.primerNombre,
            segundoNombre: req.body.segundoNombre,
            primerApellido: req.body.primerApellido,
            segundoApellido: req.body.segundoApellido,
            rtn: req.body.rtn,
            genero: req.body.genero,
            telefono: req.body.telefono,
            email: req.body.email,
            direccion: req.body.direccion,
            usuario_id: req.body.usuario_id,
            estado: req.body.estado || 'activo'
        });
        res.status(201).json(nuevoCliente);
    }
};

exports.editarCliente = async (req, res) => {
    const errores = validationResult(req);
    if (errores.errors.length > 0) {
        res.status(400).json(errores);
    }
    else{
        const { id } = req.query;
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        try {
            // Imprimir el body recibido para depuración
            console.log('Body recibido para update:', req.body);
            // Actualizar solo la tabla clientes
            await Cliente.update({ ...req.body }, { where: { id } });
            // Ejecutar sincronización para actualizar datos compartidos con usuario
            await sincronizarEmpleadosYClientes();
            res.status(200).json({ mensaje: 'Cliente actualizado y usuario sincronizado' });
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            res.status(500).json({ mensaje: 'Error al actualizar cliente', error: error.message, stack: error.stack });
        }
    }
}

exports.eliminarCliente = async (req, res) => {
    try {
        const { id } = req.query;
        const buscarCliente = await Cliente.findOne({ where: { id } });
        if (!buscarCliente) {
            return res.status(400).json({ msj: 'Cliente no encontrado' });
        }
        // Buscar ventas asociadas por email
        const ventasAsociadas = await Venta.count({ where: { cliente_email: buscarCliente.email } });
        if (ventasAsociadas > 0) {
            // Soft delete: solo marcar como inactivo
            await buscarCliente.update({ estado: 'inactivo' });
            return res.status(200).json({ mensaje: 'Cliente tiene ventas asociadas, se marcó como inactivo.' });
        }
        // Guardar usuario_id antes de eliminar el cliente
        const usuarioId = buscarCliente.usuario_id;
        // Eliminar cliente
        await Cliente.destroy({ where: { id } });
        // Eliminar usuario relacionado si existe
        if (usuarioId) {
            try {
                await Usuario.destroy({ where: { id: usuarioId } });
            } catch (err) {
                console.error('Error al eliminar usuario relacionado:', err.message);
            }
        }
        res.status(200).json({ mensaje: 'Cliente y usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
    }
}

exports.crearClienteYUsuario = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    // 1. Crear cliente
    const nuevoCliente = await Cliente.create({
      primerNombre: req.body.primerNombre,
      segundoNombre: req.body.segundoNombre,
      primerApellido: req.body.primerApellido,
      segundoApellido: req.body.segundoApellido,
      rtn: req.body.rtn,
      genero: req.body.genero,
      telefono: req.body.telefono,
      email: req.body.email,
      direccion: req.body.direccion,
      estado: req.body.estado || 'activo'
    }, { transaction: t });

    // 2. Crear usuario usando los datos del cliente
    const nuevoUsuario = await Usuario.create({
      primerNombre: nuevoCliente.primerNombre,
      segundoNombre: nuevoCliente.segundoNombre,
      primerApellido: nuevoCliente.primerApellido,
      segundoApellido: nuevoCliente.segundoApellido,
      genero: nuevoCliente.genero,
      correo: nuevoCliente.email,
      contrasena: '123456', // mínimo 6 caracteres
      rol: 'cliente'
    }, { transaction: t });

    // 3. Actualizar cliente con el usuario_id
    await nuevoCliente.update({ usuario_id: nuevoUsuario.id }, { transaction: t });

    await t.commit();
    res.status(201).json({ cliente: nuevoCliente, usuario: nuevoUsuario });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ mensaje: 'Error al crear cliente y usuario', error: error.message });
  }
};