const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const autenticacionMiddleware = require('../middlewares/middlewareAutenticacion');
const {obtenerUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario, crearUsuario } = require('../controladores/controladorUsuario');

/**
 * @swagger
 * tags:
 *   name: Usuario
 *   description: Peticiones para la gestión de usuarios
 */
/**
 * @swagger
 * /usuario/listar:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Usuario]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Error en el servidor
 */
router.get('/listar', autenticacionMiddleware(['admin']), obtenerUsuarios);

/**
 * @swagger
 * /usuario/buscarUsuario:
 *   get:
 *     summary: Buscar un usuario por ID
 *     tags: [Usuario]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.get('/buscarUsuario',
      query('id').isInt().withMessage('ID inválido'),
    autenticacionMiddleware(['admin']), obtenerUsuario);

/**
 * @swagger
 * /usuario/actualizar:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     tags: [Usuario]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               primerNombre:
 *                 type: string
 *                 description: Nombre del usuario
 *               primerApellido:
 *                 type: string
 *                 description: Nombre del usuario
 *               correo:
 *                 type: string
 *                 description: Correo electrónico
 *               contrasena:
 *                 type: string
 *                 description: Contraseña (mínimo 6 caracteres)
 *               rol:
 *                 type: string
 *                 enum: [admin, empleado, cliente]
 *                 description: Rol del usuario
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.put('/actualizar', 
      query('id').isInt().withMessage('ID inválido'),
      body('primerNombre').optional().isLength({ min: 2, max: 50 }).withMessage('El primer nombre debe tener entre 2 y 50 caracteres'),
      body('segundoNombre').optional().isLength({ min: 2, max: 50 }).withMessage('El segundo nombre debe tener entre 2 y 50 caracteres'),
      body('primerApellido').optional().isLength({ min: 2, max: 50 }).withMessage('El primer apellido debe tener entre 2 y 50 caracteres'),
      body('segundoApellido').optional().isLength({ min: 2, max: 50 }).withMessage('El segundo apellido debe tener entre 2 y 50 caracteres'),
      body('genero').optional().isIn(['M', 'F', 'O']).withMessage('El género debe ser "M", "F" o "O"'),
      body('correo').optional().isEmail().withMessage('Correo inválido'),
      body('contrasena').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
      body('rol').isIn(['admin', 'empleado', 'cliente']).withMessage('Cargo inválido. Solo puede ingresar: admin, empleado o cliente'),
    autenticacionMiddleware(['admin']), actualizarUsuario);

/**
 * @swagger
 * /usuario/eliminar:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     tags: [Usuario]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.delete('/eliminar', 
      query('id').isInt().withMessage('ID inválido'),
    autenticacionMiddleware(['admin']), eliminarUsuario);

router.post('/', crearUsuario);

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *         correo:
 *           type: string
 *         rol:
 *           type: string
 *           enum: [admin, empleado, cliente]
 *         creadoEn:
 *           type: string
 *           format: date-time
 *         actualizadoEn:
 *           type: string
 *           format: date-time
 */
module.exports = router;