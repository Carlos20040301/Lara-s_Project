const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const autenticacionMiddleware = require('../middlewares/middlewareAutenticacion');
const { obtenerEmpleados, obtenerEmpleado, crearEmpleado, actualizarEmpleado, eliminarEmpleado } = require('../controladores/controladorEmpleado');

/**
 * @swagger
 * tags:
 *   name: Empleado
 *   description: Peticiones para la gestión de empleados
 */
/**
 * @swagger
 * /empleado/listar:
 *   get:
 *     summary: Listar todos los empleados
 *     tags: [Empleado]
 *     responses:
 *       200:
 *         description: Lista de empleados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   id_usuario:
 *                     type: integer
 *                   cargo:
 *                     type: string
 *                     enum: [gerente, vendedor, cajero, otro]
 *                   telefono:
 *                     type: string
 *                   creadoEn:
 *                     type: string
 *                     format: date-time
 *                   actualizadoEn:
 *                     type: string
 *                     format: date-time
 *                   Usuario:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                       correo:
 *                         type: string
 *       500:
 *         description: Error en el servidor
 */
router.get('/listar', autenticacionMiddleware(['admin']), obtenerEmpleados);

/**
 * @swagger
 * /empleado/buscarEmpleado:
 *   get:
 *     summary: Buscar un empleado por ID
 *     tags: [Empleado]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Empleado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empleado'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.get('/buscarEmpleado',
        query('id').isInt().withMessage("ID inválido"),
    autenticacionMiddleware(['admin']), obtenerEmpleado);

/**
 * @swagger
 * /empleado/guardar:
 *   post:
 *     summary: Crear un nuevo empleado
 *     tags: [Empleado]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_usuario
 *               - cargo
 *               - telefono
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 description: ID del usuario asociado
 *               cargo:
 *                 type: string
 *                 enum: [gerente, vendedor, cajero, otro]
 *                 description: Cargo del empleado
 *               telefono:
 *                 type: string
 *                 description: Teléfono del empleado
 *     responses:
 *       201:
 *         description: Empleado creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empleado'
 *       400:
 *         description: Error de validación o usuario no válido
 *       500:
 *         description: Error en el servidor
 */
router.post('/guardar',
        body('id_usuario').isInt().withMessage('ID de usuario inválido'),
        body('cargo').isIn(['gerente', 'vendedor', 'cajero', 'otro']).withMessage('Cargo inválido. Solo puede ingresar: gerente, vendedor, cajero u otro'),
        body('telefono').notEmpty().withMessage('El teléfono es requerido'),
    autenticacionMiddleware(['admin']), crearEmpleado);

/**
 * @swagger
 * /empleado/actualizar:
 *   put:
 *     summary: Actualizar un empleado por ID
 *     tags: [Empleado]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cargo:
 *                 type: string
 *                 enum: [gerente, vendedor, cajero, otro]
 *                 description: Cargo del empleado
 *               telefono:
 *                 type: string
 *                 description: Teléfono del empleado
 *     responses:
 *       200:
 *         description: Empleado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 empleado:
 *                   $ref: '#/components/schemas/Empleado'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.put('/actualizar', 
      query('id').isInt().withMessage('ID inválido'),
      body('cargo').isIn(['gerente', 'vendedor', 'cajero', 'otro']).withMessage('Cargo inválido. Solo puede ingresar: gerente, vendedor, cajero u otro'),
      body('telefono').optional().notEmpty().withMessage('El teléfono no puede estar vacío'),
    autenticacionMiddleware(['admin']), actualizarEmpleado);

/**
 * @swagger
 * /empleado/eliminar:
 *   delete:
 *     summary: Eliminar un empleado por ID
 *     tags: [Empleado]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Empleado eliminado
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
 *         description: Empleado no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.delete('/eliminar',
      query('id').isInt().withMessage('ID inválido'),
    autenticacionMiddleware(['admin']), eliminarEmpleado);

/**
 * @swagger
 * components:
 *   schemas:
 *     Empleado:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         id_usuario:
 *           type: integer
 *         cargo:
 *           type: string
 *           enum: [gerente, vendedor, cajero, otro]
 *         telefono:
 *           type: string
 *         creadoEn:
 *           type: string
 *           format: date-time
 *         actualizadoEn:
 *           type: string
 *           format: date-time
 *         Usuario:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             correo:
 *               type: string
 */
module.exports = router;