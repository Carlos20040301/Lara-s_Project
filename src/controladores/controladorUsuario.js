const { validationResult } = require('express-validator');
const { enviarBienvenidaEmpleado } = require('../configuraciones/email');
const argon2 = require('argon2');
const Usuario = require('../modelos/Usuario');
const Empleado = require('../modelos/Empleado');

const obtenerUsuarios = [
  async (req, res) => {
    try {
      // Traer todos los usuarios
      const usuarios = await Usuario.findAll({
        attributes: { exclude: ['contrasena'] },
        raw: true
      });

      // Traer todos los empleados y clientes para asociar sus ids
      const Empleado = require('../modelos/Empleado');
      const Cliente = require('../modelos/Cliente');
      const empleados = await Empleado.findAll({ attributes: ['id', 'id_usuario'], raw: true });
      const clientes = await Cliente.findAll({ attributes: ['id', 'usuario_id'], raw: true });

      // Crear un mapa rápido de usuario_id -> id_empleado/id_cliente
      const mapEmpleado = {};
      empleados.forEach(e => { mapEmpleado[e.id_usuario] = e.id; });
      const mapCliente = {};
      clientes.forEach(c => { mapCliente[c.usuario_id] = c.id; });

      // Agregar los ids correspondientes a cada usuario
      const usuariosConIds = usuarios.map(u => ({
        ...u,
        id_empleado: mapEmpleado[u.id] || null,
        id_cliente: mapCliente[u.id] || null
      }));

      res.json(usuariosConIds);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
  },
];

const obtenerUsuario = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    try {
      const usuario = await Usuario.findByPk(req.query.id, {
        attributes: { exclude: ['contrasena'] },
      });
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
     // res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

const actualizarUsuario = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    const { primerNombre, segundoNombre, primerApellido, segundoApellido, genero, correo, contrasena, rol } = req.body;
    try {
      const usuario = await Usuario.findByPk(req.query.id);
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      if (correo && correo !== usuario.correo) {
        const usuarioExistente = await Usuario.findOne({ where: { correo } });
        if (usuarioExistente) {
          return res.status(400).json({ mensaje: 'Correo ya registrado' });
        }
      }
      const actualizaciones = {};
      if (primerNombre) actualizaciones.primerNombre = primerNombre;
      if (segundoNombre) actualizaciones.segundoNombre = segundoNombre;
      if (primerApellido) actualizaciones.primerApellido = primerApellido;
      if (segundoApellido) actualizaciones.segundoApellido = segundoApellido;
      if (genero) actualizaciones.genero = genero;
      if (correo) actualizaciones.correo = correo;
      if (contrasena) actualizaciones.contrasena = await argon2.hash(contrasena);
      if (rol) actualizaciones.rol = rol;
      await usuario.update(actualizaciones);

      // --- ACTUALIZAR O CREAR REGISTRO EN EMPLEADOS SI EL ROL ES EMPLEADO ---
      if (rol === 'empleado') {
        const cargosPermitidos = ['cajero', 'vendedor', 'gerente', 'otro'];
        let cargoEmpleado = req.body.cargo;
        if (!cargosPermitidos.includes(cargoEmpleado)) {
          cargoEmpleado = 'cajero';
        }
        const telefonoEmpleado = req.body.telefono || '00000000';
        let empleado = await Empleado.findOne({ where: { id_usuario: usuario.id } });
        if (empleado) {
          // Actualizar datos de empleado
          await empleado.update({ cargo: cargoEmpleado, telefono: telefonoEmpleado });
        } else {
          // Crear registro de empleado si no existe
          await Empleado.create({ id_usuario: usuario.id, cargo: cargoEmpleado, telefono: telefonoEmpleado });
        }
      }

      res.json({ mensaje: 'Usuario actualizado', usuario: {
        id: usuario.id,
        primerNombre: usuario.primerNombre,
        segundoNombre: usuario.segundoNombre,
        primerApellido: usuario.primerApellido,
        segundoApellido: usuario.segundoApellido,
        genero: usuario.genero,
        correo: usuario.correo,
        rol: usuario.rol
      }});
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

const eliminarUsuario = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    try {
      const usuario = await Usuario.findByPk(req.query.id);
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      const empleado = await Empleado.findOne({ where: { id_usuario: usuario.id } });
      if (empleado) {
        return res.status(400).json({ mensaje: 'No se puede eliminar un usuario con un empleado asociado' });
      }
      await usuario.destroy();
      res.json({ mensaje: 'Usuario eliminado' });
    } catch (error) {
      let msg = 'Error en el servidor';
      if (error && error.message) {
        msg += ': ' + error.message;
      }
      res.status(500).json({ mensaje: msg });
    }
  },
];

const crearUsuario = async (req, res) => {
  try {
    const { primerNombre, segundoNombre, primerApellido, segundoApellido, genero, correo, contrasena, rol } = req.body;
    // Validar que el correo no exista
    const usuarioExistente = await Usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'Correo ya registrado' });
    }
    // Hash de la contraseña
    const hash = await argon2.hash(contrasena);
    const nuevoUsuario = await Usuario.create({ primerNombre, segundoNombre, primerApellido, segundoApellido, genero, correo, contrasena: hash, rol });

    // Si el usuario es empleado, crear también el registro en empleados
    let empleadoCreado = null;
    if (rol === 'empleado' || rol === 'vendedor' || rol === 'cajero' || rol === 'gerente') {
      const Empleado = require('../modelos/Empleado');
      // Validar cargo permitido
      const cargosPermitidos = ['cajero', 'vendedor', 'gerente', 'otro'];
      let cargoEmpleado = req.body.cargo;
      if (!cargosPermitidos.includes(cargoEmpleado)) {
        cargoEmpleado = 'cajero';
      }
      const telefonoEmpleado = req.body.telefono || '00000000';
      try {
        empleadoCreado = await Empleado.create({
          id_usuario: nuevoUsuario.id,
          cargo: cargoEmpleado,
          telefono: telefonoEmpleado
        });
      } catch (err) {
        console.error('Error al crear registro de empleado:', err);
      }
      // Enviar correo de bienvenida
      try {
        await enviarBienvenidaEmpleado({
          nombre: primerNombre,
          correo,
          cargo: cargoEmpleado
        });
      } catch (err) {
        console.error('Error al enviar correo de bienvenida:', err);
      }
    }

    res.status(201).json({
      id: nuevoUsuario.id,
      primerNombre: nuevoUsuario.primerNombre,
      segundoNombre: nuevoUsuario.segundoNombre,
      primerApellido: nuevoUsuario.primerApellido,
      segundoApellido: nuevoUsuario.segundoApellido,
      genero: nuevoUsuario.genero,
      correo: nuevoUsuario.correo,
      rol: nuevoUsuario.rol,
      empleado: empleadoCreado
    });
  } catch (error) {
    console.error('Error al crear usuario:', error); // Log detallado
    res.status(500).json({ mensaje: 'Error al crear usuario', error });
  }
};

module.exports = { obtenerUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario, crearUsuario };