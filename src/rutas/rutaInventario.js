/**
 * @swagger
 * tags:
 *   name: Inventario
 *   description: Endpoints para la gestión de inventario de productos
 */

/**
 * @swagger
 * /inventario:
 *   get:
 *     summary: Listar todos los movimientos de inventario
 *     tags: [Inventario]
 *     responses:
 *       200:
 *         description: Lista de movimientos de inventario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   producto_id:
 *                     type: integer
 *                   tipo:
 *                     type: string
 *                   cantidad:
 *                     type: integer
 *                   motivo:
 *                     type: string
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *             example:
 *               - id: 1
 *                 producto_id: 5
 *                 tipo: "entrada"
 *                 cantidad: 20
 *                 motivo: "Compra proveedor"
 *                 fecha: "2024-06-01T10:00:00Z"
 *               - id: 2
 *                 producto_id: 5
 *                 tipo: "salida"
 *                 cantidad: 5
 *                 motivo: "Venta mostrador"
 *                 fecha: "2024-06-01T12:00:00Z"
 *       401:
 *         description: No autorizado
 *   post:
 *     summary: Registrar un nuevo movimiento de inventario
 *     tags: [Inventario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               producto_id:
 *                 type: integer
 *                 description: ID del producto
 *               tipo:
 *                 type: string
 *                 enum: [entrada, salida]
 *                 description: Tipo de movimiento
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad del movimiento
 *               motivo:
 *                 type: string
 *                 description: Motivo del movimiento
 *           example:
 *             producto_id: 5
 *             tipo: "entrada"
 *             cantidad: 20
 *             motivo: "Compra proveedor"
 *     responses:
 *       201:
 *         description: Movimiento de inventario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 producto_id:
 *                   type: integer
 *                 tipo:
 *                   type: string
 *                 cantidad:
 *                   type: integer
 *                 motivo:
 *                   type: string
 *                 fecha:
 *                   type: string
 *                   format: date-time
 *             example:
 *               id: 3
 *               producto_id: 5
 *               tipo: "entrada"
 *               cantidad: 20
 *               motivo: "Compra proveedor"
 *               fecha: "2024-06-01T10:00:00Z"
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /inventario/{id}:
 *   get:
 *     summary: Obtener detalles de un movimiento de inventario por ID
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del movimiento de inventario
 *     responses:
 *       200:
 *         description: Detalles del movimiento de inventario
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Movimiento de inventario no encontrado
 *   put:
 *     summary: Actualizar un movimiento de inventario
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del movimiento de inventario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: integer
 *               motivo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movimiento de inventario actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Movimiento de inventario no encontrado
 *   delete:
 *     summary: Eliminar un movimiento de inventario
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del movimiento de inventario
 *     responses:
 *       200:
 *         description: Movimiento de inventario eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Movimiento de inventario no encontrado
 */
const express = require('express');
const router = express.Router();
const autenticacionMiddleware = require('../middlewares/middlewareAutenticacion');
const {
  obtenerInventarios,
  obtenerInventario,
  crearInventario,
  actualizarInventario,
  eliminarInventario
} = require('../controladores/controladorInventario');

router.get('/', obtenerInventarios);

router.get('/:id', obtenerInventario);

// Crear, actualizar y eliminar un nuevo movimiento de inventario - solo admin
router.post('/', autenticacionMiddleware(['admin']), crearInventario);
router.put('/:id', autenticacionMiddleware(['admin']), actualizarInventario);
router.delete('/:id', autenticacionMiddleware(['admin']), eliminarInventario);

module.exports = router;
