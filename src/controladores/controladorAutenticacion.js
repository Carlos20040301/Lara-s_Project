// Modelos Sequelize para sincronización
const UsuarioSQL = require('../modelos/Usuario');
const Empleado = require('../modelos/Empleado');
const { validationResult } = require('express-validator');
const argon2 = require('argon2');
const Usuario = require('../modelos/UsuarioMongo');
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
      const usuarioExistente = await Usuario.findOne({ correo });
      if (usuarioExistente) {
        return res.status(400).json({ mensaje: 'Correo ya registrado' });
      }
      const contrasenaHasheada = await argon2.hash(contrasena);
      // Crear usuario en MongoDB
      const usuarioMongo = await new Usuario({
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido,
        genero,
        correo,
        contrasena: contrasenaHasheada,
        rol,
      }).save();

      // Crear usuario en MySQL
      let usuarioSQL;
      try {
        usuarioSQL = await UsuarioSQL.create({
          primerNombre,
          segundoNombre,
          primerApellido,
          segundoApellido,
          genero,
          correo,
          contrasena: contrasenaHasheada,
          rol,
        });
      } catch (err) {
        // Si falla en MySQL, eliminar el usuario de MongoDB para mantener consistencia
        await Usuario.deleteOne({ correo });
        throw err;
      }

      // Enviar correo de bienvenida si el rol es interno
      try {
        if (["empleado", "vendedor", "cajero", "gerente"].includes(rol)) {
          // Importar aquí para evitar ciclos
          const { enviarBienvenidaEmpleado } = require("../configuraciones/email");
          await enviarBienvenidaEmpleado({
            nombre: primerNombre,
            correo,
            cargo: rol
          });
        }
      } catch (err) {
        console.error("Error al enviar correo de bienvenida:", err);
        // No interrumpe el registro
      }

      res.status(201).json({
        mensaje: 'Usuario registrado exitosamente',
        usuario: {
          idMongo: usuarioMongo._id,
          idSQL: usuarioSQL.id,
          nombreCompleto: `${usuarioMongo.primerNombre} ${usuarioMongo.segundoNombre || ''} ${usuarioMongo.primerApellido || ''} ${usuarioMongo.segundoApellido || ''}`.trim(),
          correo: usuarioMongo.correo,
          rol: usuarioMongo.rol,
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
      const usuario = await Usuario.findOne({ correo });
      if (!usuario) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }
      const esContrasenaValida = await argon2.verify(usuario.contrasena, contrasena);
      if (!esContrasenaValida) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }
      // Buscar usuario en MySQL y obtener id de empleado
      let empleadoId = null;
      let usuarioSQL = await UsuarioSQL.findOne({ where: { correo } });
      if (usuarioSQL && usuarioSQL.rol === 'empleado') {
        const empleado = await Empleado.findOne({ where: { id_usuario: usuarioSQL.id } });
        if (empleado) empleadoId = empleado.id;
      }
      // Incluir el id de empleado de MySQL en el token si existe
      const tokenPayload = { id: usuario._id, rol: usuario.rol };
      if (empleadoId) tokenPayload.empleado_id_mysql = empleadoId;
      const token = generarToken(tokenPayload);
      const nombreCompleto = [usuario.primerNombre, usuario.segundoNombre, usuario.primerApellido, usuario.segundoApellido]
        .filter(Boolean)
        .join(' ');
      res.json({
        token,
        usuario: {
          id: usuario._id,
          nombre: nombreCompleto,
          correo,
          rol: usuario.rol,
          primerNombre: usuario.primerNombre,
          segundoNombre: usuario.segundoNombre,
          primerApellido: usuario.primerApellido,
          segundoApellido: usuario.segundoApellido,
          empleado_id_mysql: empleadoId
        }
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

module.exports = { registrar, iniciarSesion };