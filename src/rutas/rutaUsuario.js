const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const autenticacionMiddleware = require('../middlewares/middlewareAutenticacion');
const {obtenerUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario } = require('../controladores/controladorUsuario');

// Rutas protegidas por middleware
router.get('/listar', autenticacionMiddleware(['admin']), obtenerUsuarios);

router.get('/buscarUsuario',
      query('id').isInt().withMessage('ID inválido'),
    autenticacionMiddleware(['admin']), obtenerUsuario);

router.put('/actualizar', 
      query('id').isInt().withMessage('ID inválido'),
      body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
      body('correo').optional().isEmail().withMessage('Correo inválido'),
      body('contrasena').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
      body('rol').isIn(['admin', 'empleado', 'cliente']).withMessage('Cargo inválido. Solo puede ingresar: admin, empleado o cliente'),
    autenticacionMiddleware(['admin']), actualizarUsuario);

router.delete('/eliminar', 
      query('id').isInt().withMessage('ID inválido'),
    autenticacionMiddleware(['admin']), eliminarUsuario);

module.exports = router;