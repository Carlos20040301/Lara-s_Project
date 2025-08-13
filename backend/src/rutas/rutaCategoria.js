/**
 * @swagger
 * tags:
 *   name: Categoría
 *   description: Endpoints para la gestión de categorías de productos
 */

/**
 * @swagger
 * /categoria/listar:
 *   get:
 *     summary: Listar todas las categorías
 *     tags: [Categoría]
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   activo:
 *                     type: boolean
 *             example:
 *               - id: 1
 *                 nombre: "Anillos"
 *                 descripcion: "Categoría de anillos de oro y plata"
 *                 activo: true
 *               - id: 2
 *                 nombre: "Pulseras"
 *                 descripcion: "Pulseras de acero inoxidable"
 *                 activo: true
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /categoria/buscarCategoria:
 *   get:
 *     summary: Buscar una categoría por ID
 *     tags: [Categoría]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /categoria/guardar:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categoría]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la categoría
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la categoría
 *               activo:
 *                 type: boolean
 *                 description: Si la categoría está activa
 *           example:
 *             nombre: "Anillos"
 *             descripcion: "Categoría de anillos de oro y plata"
 *             activo: true
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 descripcion:
 *                   type: string
 *                 activo:
 *                   type: boolean
 *             example:
 *               id: 3
 *               nombre: "Anillos"
 *               descripcion: "Categoría de anillos de oro y plata"
 *               activo: true
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /categoria/actualizar:
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categoría]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la categoría
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la categoría
 *               activo:
 *                 type: boolean
 *                 description: Si la categoría está activa
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /categoria/eliminar:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categoría]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
 *       400:
 *         description: No se puede eliminar (tiene productos relacionados)
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error en el servidor
 */
const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const middlewareAutenticacion = require('../middlewares/middlewareAutenticacion');
const { obtenerCategorias, obtenerCategoriaPorId ,crearCategoria, actualizarCategoria, eliminarCategoria } = require('../controladores/controladorCategoria');
const validarCampos = require('../middlewares/validationMiddleware');

// Rutas públicas (solo lectura)
router.get('/listar', obtenerCategorias);

router.get('/buscarCategoria', 
        query('id').isInt().withMessage('ID inválido'),
        validarCampos,
        obtenerCategoriaPorId);

// Rutas protegidas (solo admins)
router.post('/guardar', 
        body('nombre').notEmpty().withMessage('El nombre de la categoría es obligatorio.')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre de la categoría debe tener entre 2 y 100 caracteres.'),
        body('descripcion').optional().isString().withMessage('La descripción debe ser una cadena de texto.'),
        body('activo').optional().isBoolean().withMessage('El campo activo debe ser un valor booleano (true/false).').toBoolean(),
        validarCampos,
    middlewareAutenticacion(['admin']),crearCategoria);

router.put('/actualizar', 
        query('id').isInt().withMessage('ID inválido'),
        body('nombre').notEmpty().withMessage('El nombre de la categoría es obligatorio.')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre de la categoría debe tener entre 2 y 100 caracteres.'),
        body('descripcion').optional().isString().withMessage('La descripción debe ser una cadena de texto.'),
        body('activo').optional().isBoolean().withMessage('El campo activo debe ser un valor booleano (true/false).').toBoolean(),
        validarCampos,
    middlewareAutenticacion(['admin']),actualizarCategoria);

router.delete('/eliminar', 
        query('id').isInt().withMessage('ID inválido'),
        validarCampos,
    middlewareAutenticacion(['admin']),eliminarCategoria);

module.exports = router; 