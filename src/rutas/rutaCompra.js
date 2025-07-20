/**
 * @swagger
 * tags:
 *   name: Compra
 *   description: Endpoints para la gestión de compras a proveedores
 */

/**
 * @swagger
 * /compra:
 *   get:
 *     summary: Listar todas las compras
 *     tags: [Compra]
 *     responses:
 *       200:
 *         description: Lista de compras
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   proveedor_id:
 *                     type: integer
 *                   fecha:
 *                     type: string
 *                     format: date
 *                   total:
 *                     type: number
 *                   productos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         producto_id:
 *                           type: integer
 *                         cantidad:
 *                           type: integer
 *                         precio:
 *                           type: number
 *             example:
 *               - id: 1
 *                 proveedor_id: 2
 *                 fecha: "2024-06-01"
 *                 total: 2500.00
 *                 productos:
 *                   - producto_id: 5
 *                     cantidad: 10
 *                     precio: 250.00
 *       401:
 *         description: No autorizado
 *   post:
 *     summary: Registrar una nueva compra
 *     tags: [Compra]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proveedor_id:
 *                 type: integer
 *                 description: ID del proveedor
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la compra
 *               total:
 *                 type: number
 *                 description: Total de la compra
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *                     precio:
 *                       type: number
 *           example:
 *             proveedor_id: 2
 *             fecha: "2024-06-01"
 *             total: 2500.00
 *             productos:
 *               - producto_id: 5
 *                 cantidad: 10
 *                 precio: 250.00
 *     responses:
 *       201:
 *         description: Compra registrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 proveedor_id:
 *                   type: integer
 *                 fecha:
 *                   type: string
 *                   format: date
 *                 total:
 *                   type: number
 *                 productos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       producto_id:
 *                         type: integer
 *                       cantidad:
 *                         type: integer
 *                       precio:
 *                         type: number
 *             example:
 *               id: 2
 *               proveedor_id: 2
 *               fecha: "2024-06-01"
 *               total: 2500.00
 *               productos:
 *                 - producto_id: 5
 *                   cantidad: 10
 *                   precio: 250.00
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /compra/{id}:
 *   get:
 *     summary: Obtener detalles de una compra por ID
 *     tags: [Compra]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compra
 *     responses:
 *       200:
 *         description: Detalles de la compra
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Compra no encontrada
 *   put:
 *     summary: Actualizar una compra
 *     tags: [Compra]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proveedor_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *               total:
 *                 type: number
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *                     precio:
 *                       type: number
 *     responses:
 *       200:
 *         description: Compra actualizada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Compra no encontrada
 *   delete:
 *     summary: Eliminar una compra
 *     tags: [Compra]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compra
 *     responses:
 *       200:
 *         description: Compra eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Compra no encontrada
 */
const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const autenticacionMiddleware = require('../middlewares/middlewareAutenticacion');
const {
  obtenerCompras,
  obtenerCompra,
  crearCompra,
  actualizarCompra,
  eliminarCompra
} = require('../controladores/controladorCompra');

router.get('/listar', obtenerCompras);

router.get('/buscarCompra',
      query('id').isInt().withMessage('El ID debe ser un número entero'),
  obtenerCompra);

// Crear, actualizar y eliminar - solo admin
router.post('/guardar',
  body('proveedor_id').isInt({ gt: 0 }).withMessage('El proveedor_id debe ser un número entero positivo'),
  body('empleado_id').isInt({ gt: 0 }).withMessage('El empleado_id debe ser un número entero positivo'),
  body('numero_factura').optional().isString().isLength({ max: 100 }).withMessage('La factura debe tener máximo 100 caracteres'),
  body('fecha_compra').optional().isISO8601().withMessage('La fecha de compra debe ser una fecha válida'),
  body('total').isDecimal({ decimal_digits: '0,2' }).withMessage('Total debe ser un número decimal con máximo 2 decimales'),
  body('productos').isArray({ min: 1 }).withMessage('Debe proporcionar al menos un producto'),
  body('productos.*.producto_id').isInt({ gt: 0 }).withMessage('producto_id debe ser un número entero positivo'),
  body('productos.*.cantidad').isInt({ gt: 0 }).withMessage('La cantidad debe ser un número entero positivo'),
  body('productos.*.precio_unitario').isDecimal({ decimal_digits: '0,2' }).withMessage('El precio unitario debe ser decimal con 2 decimales'),
  autenticacionMiddleware(['admin']), crearCompra);

router.put('/editar',
    query('id').isInt().withMessage('ID inválido'),
    body('proveedor_id').isInt().withMessage('Proveedor inválido'),
    body('empleado_id').isInt().withMessage('Empleado inválido'),
    body('productos').isArray({ min: 1 }).withMessage('Se requiere al menos un producto'),
  autenticacionMiddleware(['admin']), actualizarCompra);

router.delete('/eliminar',
      query('id').isInt().withMessage('ID inválido'),
  autenticacionMiddleware(['admin']), eliminarCompra);

module.exports = router;