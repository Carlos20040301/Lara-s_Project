/**
 * @swagger
 * tags:
 *   name: Pedido
 *   description: Endpoints para la gestión de pedidos de clientes
 */

/**
 * @swagger
 * /pedido:
 *   get:
 *     summary: Listar todos los pedidos
 *     tags: [Pedido]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   cliente_id:
 *                     type: integer
 *                   productos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         producto_id:
 *                           type: integer
 *                         cantidad:
 *                           type: integer
 *                   direccion_entrega:
 *                     type: string
 *                   metodo_pago:
 *                     type: string
 *                   notas:
 *                     type: string
 *                   estado:
 *                     type: string
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *             example:
 *               - id: 1
 *                 cliente_id: 3
 *                 productos:
 *                   - producto_id: 5
 *                     cantidad: 2
 *                 direccion_entrega: "Calle 123, Ciudad"
 *                 metodo_pago: "tarjeta"
 *                 notas: "Entregar en la tarde"
 *                 estado: "pendiente"
 *                 fecha: "2024-06-01T10:00:00Z"
 *       401:
 *         description: No autorizado
 *   post:
 *     summary: Crear un nuevo pedido
 *     tags: [Pedido]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cliente_id
 *               - productos
 *             properties:
 *               cliente_id:
 *                 type: integer
 *                 description: ID del cliente
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *               direccion_entrega:
 *                 type: string
 *                 description: Dirección de entrega
 *               metodo_pago:
 *                 type: string
 *                 description: Método de pago
 *               notas:
 *                 type: string
 *                 description: Notas adicionales
 *           example:
 *             cliente_id: 3
 *             productos:
 *               - producto_id: 5
 *                 cantidad: 2
 *             direccion_entrega: "Calle 123, Ciudad"
 *             metodo_pago: "tarjeta"
 *             notas: "Entregar en la tarde"
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 cliente_id:
 *                   type: integer
 *                 productos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       producto_id:
 *                         type: integer
 *                       cantidad:
 *                         type: integer
 *                 direccion_entrega:
 *                   type: string
 *                 metodo_pago:
 *                   type: string
 *                 notas:
 *                   type: string
 *                 estado:
 *                   type: string
 *                 fecha:
 *                   type: string
 *                   format: date-time
 *             example:
 *               id: 2
 *               cliente_id: 3
 *               productos:
 *                 - producto_id: 5
 *                   cantidad: 2
 *               direccion_entrega: "Calle 123, Ciudad"
 *               metodo_pago: "tarjeta"
 *               notas: "Entregar en la tarde"
 *               estado: "pendiente"
 *               fecha: "2024-06-01T10:00:00Z"
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /pedido/{id}:
 *   get:
 *     summary: Obtener detalles de un pedido por ID
 *     tags: [Pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Detalles del pedido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Pedido no encontrado
 *   patch:
 *     summary: Actualizar estado de un pedido
 *     tags: [Pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 description: Nuevo estado del pedido
 *     responses:
 *       200:
 *         description: Estado del pedido actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Pedido no encontrado
 *   delete:
 *     summary: Eliminar un pedido
 *     tags: [Pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Pedido eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Pedido no encontrado
 */
const express = require('express');
const router = express.Router();
const controladorPedido = require('../controladores/controladorPedido');
const middlewareAutenticacion = require('../middlewares/middlewareAutenticacion');

// Rutas protegidas (empleados y admins)
//router.get('/', middlewareAutenticacion.verificarToken, controladorPedido.obtenerPedidos);
//router.get('/:id', middlewareAutenticacion.verificarToken, controladorPedido.obtenerPedidoPorId);
router.get('/', middlewareAutenticacion(['empleado', 'admin']), controladorPedido.obtenerPedidos);
router.get('/:id', middlewareAutenticacion(['empleado', 'admin']), controladorPedido.obtenerPedidoPorId);

// Crear pedido (público para clientes, pero con validación)
//router.post('/', controladorPedido.crearPedido);
router.post('/', middlewareAutenticacion(['cliente', 'empleado', 'admin']), 
controladorPedido.crearPedido);

// Rutas solo para empleados/admins
router.patch('/:id/estado', middlewareAutenticacion(['empleado', 'admin']), 
controladorPedido.actualizarEstadoPedido);


router.delete('/:id', middlewareAutenticacion(['admin']), 
controladorPedido.eliminarPedido);

module.exports = router;