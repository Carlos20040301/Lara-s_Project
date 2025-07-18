const express = require('express');
const router = express.Router();
const autenticacionMiddleware = require('../middlewares/middlewareAutenticacion');
const {
  obtenerCompraProductos,
  obtenerCompraProducto,
  crearCompraProducto,
  actualizarCompraProducto,
  eliminarCompraProducto
} = require('../controladores/controladorCompraProducto');

/**
 * @swagger
 * tags:
 *   name: CompraProducto
 *   description: Endpoints para la gestión de productos en compras
 */

/**
 * @swagger
 * /compraProducto:
 *   get:
 *     summary: Listar todos los productos de compras
 *     tags: [CompraProducto]
 *     responses:
 *       200:
 *         description: Lista de productos de compras
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   compra_id:
 *                     type: integer
 *                   producto_id:
 *                     type: integer
 *                   cantidad:
 *                     type: integer
 *                   precio:
 *                     type: number
 *             example:
 *               - id: 1
 *                 compra_id: 2
 *                 producto_id: 5
 *                 cantidad: 10
 *                 precio: 250.00
 *       401:
 *         description: No autorizado
 *   post:
 *     summary: Registrar un producto en una compra
 *     tags: [CompraProducto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               compra_id:
 *                 type: integer
 *                 description: ID de la compra
 *               producto_id:
 *                 type: integer
 *                 description: ID del producto
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad comprada
 *               precio:
 *                 type: number
 *                 description: Precio unitario
 *           example:
 *             compra_id: 2
 *             producto_id: 5
 *             cantidad: 10
 *             precio: 250.00
 *     responses:
 *       201:
 *         description: Producto registrado en la compra exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 compra_id:
 *                   type: integer
 *                 producto_id:
 *                   type: integer
 *                 cantidad:
 *                   type: integer
 *                 precio:
 *                   type: number
 *             example:
 *               id: 3
 *               compra_id: 2
 *               producto_id: 5
 *               cantidad: 10
 *               precio: 250.00
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /compraProducto/{id}:
 *   get:
 *     summary: Obtener detalles de un producto de compra por ID
 *     tags: [CompraProducto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto de compra
 *     responses:
 *       200:
 *         description: Detalles del producto de compra
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto de compra no encontrado
 *   put:
 *     summary: Actualizar un producto de compra
 *     tags: [CompraProducto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto de compra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: integer
 *               precio:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto de compra actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto de compra no encontrado
 *   delete:
 *     summary: Eliminar un producto de compra
 *     tags: [CompraProducto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto de compra
 *     responses:
 *       200:
 *         description: Producto de compra eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto de compra no encontrado
 */

router.get('/', obtenerCompraProductos);

router.get('/:id', obtenerCompraProducto);

// Crear, actualizar y eliminar - solo admin (o roles autorizados)
router.post('/', autenticacionMiddleware(['admin']), crearCompraProducto);
router.put('/:id', autenticacionMiddleware(['admin']), actualizarCompraProducto);
router.delete('/:id', autenticacionMiddleware(['admin']), eliminarCompraProducto);

module.exports = router;
