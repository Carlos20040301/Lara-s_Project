/**
 * @swagger
 * tags:
 *   name: Caja
 *   description: Endpoints para la gestión de movimientos de caja
 */

/**
 * @swagger
 * /caja:
 *   get:
 *     summary: Obtener todos los movimientos de caja
 *     tags: [Caja]
 *     responses:
 *       200:
 *         description: Lista de movimientos de caja
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   tipo:
 *                     type: string
 *                   concepto:
 *                     type: string
 *                   monto:
 *                     type: number
 *                   metodo_pago:
 *                     type: string
 *                   fecha_movimiento:
 *                     type: string
 *                     format: date-time
 *             example:
 *               - id: 1
 *                 tipo: "ingreso"
 *                 concepto: "Venta mostrador"
 *                 monto: 1500.00
 *                 metodo_pago: "efectivo"
 *                 fecha_movimiento: "2024-06-01T10:00:00Z"
 *               - id: 2
 *                 tipo: "egreso"
 *                 concepto: "Pago proveedor"
 *                 monto: 500.00
 *                 metodo_pago: "transferencia"
 *                 fecha_movimiento: "2024-06-01T12:00:00Z"
 *       401:
 *         description: No autorizado
 *   post:
 *     summary: Crear un nuevo movimiento de caja
 *     tags: [Caja]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *               - concepto
 *               - monto
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [ingreso, egreso]
 *                 description: Tipo de movimiento
 *               concepto:
 *                 type: string
 *                 description: Concepto del movimiento
 *               monto:
 *                 type: number
 *                 description: Monto del movimiento
 *               metodo_pago:
 *                 type: string
 *                 enum: [efectivo, tarjeta, transferencia, paypal]
 *                 description: Método de pago
 *               referencia:
 *                 type: string
 *                 description: Referencia del movimiento
 *               venta_id:
 *                 type: integer
 *                 description: ID de la venta asociada (opcional)
 *               notas:
 *                 type: string
 *                 description: Notas adicionales
 *           example:
 *             tipo: "ingreso"
 *             concepto: "Venta mostrador"
 *             monto: 1500.00
 *             metodo_pago: "efectivo"
 *             referencia: ""
 *             venta_id: 10
 *             notas: "Pago en efectivo"
 *     responses:
 *       201:
 *         description: Movimiento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 tipo:
 *                   type: string
 *                 concepto:
 *                   type: string
 *                 monto:
 *                   type: number
 *                 metodo_pago:
 *                   type: string
 *                 fecha_movimiento:
 *                   type: string
 *                   format: date-time
 *             example:
 *               id: 3
 *               tipo: "ingreso"
 *               concepto: "Venta mostrador"
 *               monto: 1500.00
 *               metodo_pago: "efectivo"
 *               fecha_movimiento: "2024-06-01T10:00:00Z"
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /caja/resumen:
 *   get:
 *     summary: Obtener resumen de caja
 *     tags: [Caja]
 *     responses:
 *       200:
 *         description: Resumen de caja
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalIngresos:
 *                   type: number
 *                 totalEgresos:
 *                   type: number
 *                 balance:
 *                   type: number
 *             example:
 *               totalIngresos: 5000.00
 *               totalEgresos: 2000.00
 *               balance: 3000.00
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /caja/{id}:
 *   get:
 *     summary: Obtener movimiento de caja por ID
 *     tags: [Caja]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del movimiento
 *     responses:
 *       200:
 *         description: Detalles del movimiento de caja
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Movimiento no encontrado
 *   put:
 *     summary: Actualizar movimiento de caja
 *     tags: [Caja]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del movimiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               concepto:
 *                 type: string
 *                 description: Concepto del movimiento
 *               monto:
 *                 type: number
 *                 description: Monto del movimiento
 *               metodo_pago:
 *                 type: string
 *                 enum: [efectivo, tarjeta, transferencia, paypal]
 *                 description: Método de pago
 *               referencia:
 *                 type: string
 *                 description: Referencia del movimiento
 *               notas:
 *                 type: string
 *                 description: Notas adicionales
 *     responses:
 *       200:
 *         description: Movimiento actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Movimiento no encontrado
 *   delete:
 *     summary: Eliminar movimiento de caja
 *     tags: [Caja]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del movimiento
 *     responses:
 *       200:
 *         description: Movimiento eliminado exitosamente
 *       400:
 *         description: No se puede eliminar (relacionado con venta)
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Movimiento no encontrado
 */
const express = require('express');
const router = express.Router();
const controladorCaja = require('../controladores/controladorCaja');
const middlewareAutenticacion = require('../middlewares/middlewareAutenticacion');

// Todas las rutas protegidas (solo empleados y admins)
router.use(middlewareAutenticacion(['admin']));

// Rutas de lectura
router.get('/', controladorCaja.obtenerMovimientos);
router.get('/resumen', controladorCaja.obtenerResumenCaja);
router.get('/:id', controladorCaja.obtenerMovimientoPorId);

// Rutas de escritura (solo admins)
router.post('/',
  middlewareAutenticacion(['admin']),
  controladorCaja.crearMovimiento
);

router.put('/:id',
  middlewareAutenticacion(['admin']),
  controladorCaja.actualizarMovimiento
);

router.delete('/:id',
  middlewareAutenticacion(['admin']),
  controladorCaja.eliminarMovimiento
);

module.exports = router; 