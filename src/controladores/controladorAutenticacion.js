const { body, validationResult } = require('express-validator');
const argon2 = require('argon2');
const Usuario = require('../modelos/Usuario');
const { generarToken } = require('../configuraciones/jwt');

const registrar = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('correo').isEmail().withMessage('Correo inválido'),
  body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol').isIn(['admin', 'empleado', 'cliente']).withMessage('Rol inválido'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    const { nombre, correo, contrasena, rol } = req.body;

    try {
      const usuarioExistente = await Usuario.findOne({ where: { correo } });
      if (usuarioExistente) {
        return res.status(400).json({ mensaje: 'Correo ya registrado' });
      }

      const contrasenaHasheada = await argon2.hash(contrasena);
      const usuario = await Usuario.create({
        nombre,
        correo,
        contrasena: contrasenaHasheada,
        rol,
      });
      res.status(201).json({ mensaje: 'Usuario registrado exitosamente',usuario: { id: usuario.id, nombre, correo, rol }
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

const iniciarSesion = [
  body('correo').isEmail().withMessage('Correo inválido'),
  body('contrasena').notEmpty().withMessage('La contraseña es requerida'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    const { correo, contrasena } = req.body;

    try {
      const usuario = await Usuario.findOne({ where: { correo } });
      if (!usuario) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }

      const esContrasenaValida = await argon2.verify(usuario.contrasena, contrasena);
      if (!esContrasenaValida) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }

      const token = generarToken({ id: usuario.id, rol: usuario.rol });
      res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, correo, rol: usuario.rol } });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];



module.exports = { registrar, iniciarSesion };