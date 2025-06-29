const Usuario = require('../modelos/Usuario');
const Pedido = require('../modelos/Pedido');
const argon2 = require('argon2');

// Registrar nuevo usuario admin
exports.registrar = async (req, res) => {
  try {
    const { email, password, nombre } = req.body;
    if (!email || !password || !nombre) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }
    // Verifica email único antes de registrar
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ mensaje: 'Email ya registrado' });
    }
    if (password.length < 6) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    }
    const hash = await argon2.hash(password);
    await Usuario.create({ email, contraseña: hash, nombre, rol: 'admin' });
    res.status(201).json({ mensaje: 'Usuario registrado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Listar todos los usuarios (sin contraseñas)
exports.listar = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'email', 'nombre', 'rol'],
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Consultar usuario por ID
exports.obtenerPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: ['id', 'email', 'nombre', 'rol'],
    });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Actualizar usuario
exports.actualizar = async (req, res) => {
  try {
    const { email, nombre, password } = req.body;
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    if (email) {
      // Verifica email único
      const existe = await Usuario.findOne({ where: { email } });
      if (existe && existe.id !== usuario.id) {
        return res.status(400).json({ mensaje: 'Email ya registrado' });
      }
      usuario.email = email;
    }
    if (nombre) usuario.nombre = nombre;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
      }
      usuario.contraseña = await argon2.hash(password);
    }
    await usuario.save();
    res.json({ mensaje: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Eliminar usuario (verifica que no tenga pedidos asociados)
exports.eliminar = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    // Verifica si tiene pedidos asociados
    const pedidos = await Pedido.findAll({ where: { admin_id: usuario.id } });
    if (pedidos.length > 0) {
      return res.status(400).json({ mensaje: 'No se puede eliminar: usuario tiene pedidos' });
    }
    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};