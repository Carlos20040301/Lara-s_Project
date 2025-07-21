const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const controladorPedido = require('../controladores/controladorPedido');
const middlewareAutenticacion = require('../middlewares/middlewareAutenticacion');
const validarCampos = require('../middlewares/validationMiddleware');

// Rutas protegidas (empleados y admins)
//router.get('/', middlewareAutenticacion.verificarToken, controladorPedido.obtenerPedidos);
//router.get('/:id', middlewareAutenticacion.verificarToken, controladorPedido.obtenerPedidoPorId);

/**
 * @swagger
 * tags:
 *   name: Pedido
 *   description: Endpoints para la gestión de pedidos de clientes
 */
/**
 * @swagger
 * /pedido/listar:
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
 */
router.get('/listar', middlewareAutenticacion(['empleado', 'admin']), controladorPedido.obtenerPedidos);

/**
 * @swagger
 * /pedido/buscarPedido:
 *   get:
 *     summary: Obtener detalles de un pedido por ID
 *     tags: [Pedido]
 *     parameters:
 *       - in: query
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
 */
router.get('/buscarPedido', 
    query('id').isInt().withMessage('El ID de la venta debe ser un número entero positivo y es requerido.'),
    validarCampos,
    middlewareAutenticacion(['empleado', 'admin']), controladorPedido.obtenerPedidoPorId);

// Crear pedido (público para clientes, pero con validación)
//router.post('/', controladorPedido.crearPedido);

/**
 * @swagger
 * /pedido/guardar: 
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
 *               - cliente_nombre
 *               - productos
 *             properties:
 *               cliente_nombre:
 *                 type: string
 *                 description: Nombre del cliente
 *               cliente_email:
 *                 type: string
 *                 description: Correo electrónico del cliente
 *               cliente_telefono:
 *                 type: string
 *                 description: Teléfono del cliente
 *               direccion_entrega:
 *                 type: string
 *                 description: Dirección de entrega
 *               metodo_pago:
 *                 type: string
 *                 description: Método de pago
 *               notas:
 *                 type: string
 *                 description: Notas adicionales
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *           example:
 *               cliente_nombre: "Juan Pérez"
 *               cliente_email: "juanperez@example.com"
 *               cliente_telefono: "1234567890"
 *               direccion_entrega: "Calle 123, Ciudad"
 *               metodo_pago: "tarjeta"
 *               notas: "Entregar en la tarde"
 *               productos:
 *                 - producto_id: 1
 *                   cantidad: 2
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
 *               cliente_nombre: "Juan Pérez"
 *               cliente_email: "juanperez@example.com"
 *               cliente_telefono: "1234567890"
 *               direccion_entrega: "Calle 123, Ciudad"
 *               metodo_pago: "tarjeta"
 *               notas: "Entregar en la tarde"
 *               productos:
 *                 - producto_id: 1
 *                   cantidad: 2
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post('/guardar',
    body('cliente_nombre')
        .trim().notEmpty().withMessage('El nombre del cliente es requerido.'),
    body('cliente_email')
        .trim().notEmpty().withMessage('El correo es requerido.')
        .isEmail().withMessage('El correo no es válido.'),
    body('cliente_telefono')
        .notEmpty().withMessage('El teléfono es requerido.')
        .matches(/^\d{10}$/).withMessage('El teléfono debe tener 10 dígitos.'),
    body('direccion_entrega')
        .trim().notEmpty().withMessage('La dirección de entrega es requerida.'),
    body('metodo_pago')
        .notEmpty().withMessage('El método de pago es requerido.')
        .isIn(['tarjeta', 'efectivo', 'transferencia']).withMessage('Método de pago inválido.'),
    body('notas')
        .optional({ checkFalsy: true })
        .isString().withMessage('Las notas deben ser texto.'),
    body('productos')
        .isArray({ min: 1 }).withMessage('Se requiere al menos un producto.'),
    body('productos.*.producto_id')
        .isInt({ min: 1 }).withMessage('Cada producto debe tener un ID válido.'),
    body('productos.*.cantidad')
        .isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1.'),
    body('productos.*.descuento')
        .optional()
        .isFloat({ min: 0 }).withMessage('El descuento debe ser un número positivo.'),
        validarCampos,
    middlewareAutenticacion(['cliente', 'empleado', 'admin']), 
controladorPedido.crearPedido);

// Rutas solo para empleados/admins

/**
 * @swagger
 * /pedido/actualizarEstado: 
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
 */
router.patch('/actualizarEstado', 
    query('id').isInt().withMessage('El ID de la venta debe ser un número entero positivo y es requerido.'),
    body('estado').isIn(['pendiente', 'confirmado', 'en_proceso', 'enviado', 'entregado', 'cancelado'])
    .withMessage('Estado inválido. Solo puede ingresar: pendiente, confirmado, en_proceso, enviado, entregado o cancelado.'),
    validarCampos,
    middlewareAutenticacion(['empleado', 'admin']), 
controladorPedido.actualizarEstadoPedido);

/**
 * @swagger
 * /pedido/eliminar: 
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
router.delete('/eliminar',
    query('id').isInt().withMessage('El ID de la venta debe ser un número entero positivo y es requerido.'),
    validarCampos,
    middlewareAutenticacion(['admin']), 
controladorPedido.eliminarPedido);

router.get('/reporteVentas',
  query('desde').isISO8601().withMessage('La fecha "desde" es requerida y debe tener formato ISO (YYYY-MM-DD)'),
  query('hasta').isISO8601().withMessage('La fecha "hasta" es requerida y debe tener formato ISO (YYYY-MM-DD)'),
  validarCampos,
  middlewareAutenticacion(['empleado', 'admin']),
  controladorPedido.ReporteVentas);

module.exports = router;