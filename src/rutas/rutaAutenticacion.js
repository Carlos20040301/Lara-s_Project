/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para el registro e inicio de sesión de usuarios
 */

/**
 * @swagger
 * /autenticacion/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - correo
 *               - contrasena
 *               - rol
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre completo del usuario
 *               correo:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               contrasena:
 *                 type: string
 *                 description: Contraseña del usuario (mínimo 6 caracteres)
 *               rol:
 *                 type: string
 *                 enum: [admin, empleado, cliente]
 *                 description: Rol del usuario
 *           example:
 *             nombre: "Juan Pérez"
 *             correo: "juan@example.com"
 *             contrasena: "123456"
 *             rol: "admin"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT generado
 *                 usuario:
 *                   type: object
 *                   description: Datos del usuario registrado
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               usuario:
 *                 id: 1
 *                 nombre: "Juan Pérez"
 *                 correo: "juan@example.com"
 *                 rol: "admin"
 *       400:
 *         description: Error de validación en los datos enviados
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /autenticacion/iniciar-sesion:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contrasena
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               contrasena:
 *                 type: string
 *                 description: Contraseña del usuario
 *           example:
 *             correo: "juan@example.com"
 *             contrasena: "123456"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT generado
 *                 usuario:
 *                   type: object
 *                   description: Datos del usuario autenticado
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               usuario:
 *                 id: 1
 *                 nombre: "Juan Pérez"
 *                 correo: "juan@example.com"
 *                 rol: "admin"
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registrar, iniciarSesion } = require('../controladores/controladorAutenticacion');

router.post('/registro',
  body('primerNombre').notEmpty().withMessage('El primer nombre es requerido'),
  body('segundoNombre').optional().isString().withMessage('El segundo nombre debe ser una cadena'),
  body('primerApellido').optional().isString().withMessage('El primer apellido debe ser una cadena'),
  body('segundoApellido').optional().isString().withMessage('El segundo apellido debe ser una cadena'),
  body('genero').optional().isIn(['M', 'F', 'O']).withMessage('El género debe ser M, F u O'),
  body('correo').isEmail().withMessage('Correo inválido'),
  body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol').isIn(['admin', 'empleado', 'cliente']).withMessage('Rol inválido. Solo puede ser admin, empleado o cliente'),
  registrar
);

router.post('/iniciar-sesion', 
      body('correo').isEmail().withMessage('Correo inválido'),
      body('contrasena').notEmpty().withMessage('La contraseña es requerida'),
    iniciarSesion);

module.exports = router;