const { validationResult } = require('express-validator');
const argon2 = require('argon2');
const Usuario = require('../modelos/Usuario');
const { generarToken } = require('../configuraciones/jwt');

const registrar = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    const {
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      genero,
      correo,
      contrasena,
      rol,
    } = req.body;
    try {
      const usuarioExistente = await Usuario.findOne({ where: { correo } });
      if (usuarioExistente) {
        return res.status(400).json({ mensaje: 'Correo ya registrado' });
      }
      const contrasenaHasheada = await argon2.hash(contrasena);
      const usuario = await Usuario.create({
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido,
        genero,
        correo,
        contrasena: contrasenaHasheada,
        rol,
      });
      res.status(201).json({
        mensaje: 'Usuario registrado exitosamente',
        usuario: {
          id: usuario.id,
          nombreCompleto: `${usuario.primerNombre} ${usuario.segundoNombre || ''} ${usuario.primerApellido || ''} ${usuario.segundoApellido || ''}`.trim(),
          correo: usuario.correo,
          rol: usuario.rol,
        },
      });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

const iniciarSesion = [
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
      const nombreCompleto = [usuario.primerNombre, usuario.segundoNombre, usuario.primerApellido, usuario.segundoApellido]
        .filter(Boolean)
        .join(' ');
      res.json({
        token,
        usuario: {
          id: usuario.id,
          nombre: nombreCompleto,
          correo,
          rol: usuario.rol,
          primerNombre: usuario.primerNombre,
          segundoNombre: usuario.segundoNombre,
          primerApellido: usuario.primerApellido,
          segundoApellido: usuario.segundoApellido
        }
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

module.exports = { registrar, iniciarSesion };