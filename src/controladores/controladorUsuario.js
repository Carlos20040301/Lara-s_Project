const { validationResult } = require('express-validator');
const { enviarBienvenidaEmpleado } = require('../configuraciones/email');
const argon2 = require('argon2');
const Usuario = require('../modelos/Usuario');
const Empleado = require('../modelos/Empleado');

const obtenerUsuarios = [
  async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        attributes: { exclude: ['contrasena'] },
      });
      res.json(usuarios);
    } catch (error) {
      //res.status(500).json({ mensaje: 'Error en el servidor', error });
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
      res.status(500).json({ mensaje: 'Error en el servidor', error });
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

    // Enviar correo de bienvenida si el rol es empleado
    try {
      if (rol === 'empleado' || rol === 'vendedor' || rol === 'cajero' || rol === 'gerente') {
        await enviarBienvenidaEmpleado({
          nombre: primerNombre,
          correo,
          cargo: rol
        });
      }
    } catch (err) {
      console.error('Error al enviar correo de bienvenida:', err);
      // No interrumpe la creación del usuario
    }

    res.status(201).json({
      id: nuevoUsuario.id,
      primerNombre: nuevoUsuario.primerNombre,
      segundoNombre: nuevoUsuario.segundoNombre,
      primerApellido: nuevoUsuario.primerApellido,
      segundoApellido: nuevoUsuario.segundoApellido,
      genero: nuevoUsuario.genero,
      correo: nuevoUsuario.correo,
      rol: nuevoUsuario.rol
    });
  } catch (error) {
    console.error('Error al crear usuario:', error); // Log detallado
    res.status(500).json({ mensaje: 'Error al crear usuario', error });
  }
};

module.exports = { obtenerUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario, crearUsuario };