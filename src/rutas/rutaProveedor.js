const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const autenticacionMiddleware = require('../middlewares/middlewareAutenticacion');
const {
  obtenerProveedores,
  obtenerProveedor,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
} = require('../controladores/controladorProveedor');

/**
 * @swagger
 * tags:
 *   name: Proveedor
 *   description: Endpoints para la gestión de proveedores
 */

/**
 * @swagger
 * /proveedor:
 *   get:
 *     summary: Listar todos los proveedores
 *     tags: [Proveedor]
 *     responses:
 *       200:
 *         description: Lista de proveedores
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
 *                   contacto:
 *                     type: string
 *                   direccion:
 *                     type: string
 *             example:
 *               - id: 1
 *                 nombre: "Proveedor S.A."
 *                 contacto: "Carlos López"
 *                 direccion: "Av. Central 123"
 *               - id: 2
 *                 nombre: "Joyas y Más"
 *                 contacto: "Ana Torres"
 *                 direccion: "Calle 45 Sur"
 *       401:
 *         description: No autorizado
 *   post:
 *     summary: Registrar un nuevo proveedor
 *     tags: [Proveedor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del proveedor
 *               contacto:
 *                 type: string
 *                 description: Información de contacto
 *               direccion:
 *                 type: string
 *                 description: Dirección del proveedor
 *           example:
 *             nombre: "Proveedor S.A."
 *             contacto: "Carlos López"
 *             direccion: "Av. Central 123"
 *     responses:
 *       201:
 *         description: Proveedor registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 contacto:
 *                   type: string
 *                 direccion:
 *                   type: string
 *             example:
 *               id: 3
 *               nombre: "Proveedor S.A."
 *               contacto: "Carlos López"
 *               direccion: "Av. Central 123"
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /proveedor/{id}:
 *   get:
 *     summary: Obtener detalles de un proveedor por ID
 *     tags: [Proveedor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proveedor
 *     responses:
 *       200:
 *         description: Detalles del proveedor
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proveedor no encontrado
 *   put:
 *     summary: Actualizar un proveedor
 *     tags: [Proveedor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proveedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               contacto:
 *                 type: string
 *               direccion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proveedor actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proveedor no encontrado
 *   delete:
 *     summary: Eliminar un proveedor
 *     tags: [Proveedor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proveedor
 *     responses:
 *       200:
 *         description: Proveedor eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proveedor no encontrado
 */

router.get('/listar', obtenerProveedores);

router.get('/buscarProveedor',
    query('id').isInt().withMessage('ID inválido'),
  obtenerProveedor);

// Crear, actualizar y eliminar - solo admin
router.post('/guardar', 
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('correo').optional().isEmail().withMessage('Correo inválido'),
  autenticacionMiddleware(['admin']), crearProveedor);

router.put('/actualizar', 
    query('id').isInt().withMessage('ID inválido'),
    body('correo').optional().isEmail().withMessage('Correo inválido'),
  autenticacionMiddleware(['admin']), actualizarProveedor);

router.delete('/eliminar',
    query('id').isInt().withMessage('ID inválido'),
  autenticacionMiddleware(['admin']), eliminarProveedor);

module.exports = router;
