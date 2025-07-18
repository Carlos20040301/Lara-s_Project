const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registrar, iniciarSesion } = require('../controladores/controladorAutenticacion');

router.post('/registro', 
      body('nombre').notEmpty().withMessage('El nombre es requerido'),
      body('correo').isEmail().withMessage('Correo inválido'),
      body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
      body('rol').isIn(['admin', 'empleado', 'cliente']).withMessage('Rol inválido. Solo puede ser admin, empleado o cliente'),
    registrar);

router.post('/iniciar-sesion', 
      body('correo').isEmail().withMessage('Correo inválido'),
      body('contrasena').notEmpty().withMessage('La contraseña es requerida'),
    iniciarSesion);

module.exports = router;