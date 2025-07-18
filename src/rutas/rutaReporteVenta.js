/**
 * @swagger
 * tags:
 *   name: ReporteVenta
 *   description: Endpoints para la gestión de reportes de ventas
 */

/**
 * @swagger
 * /reporteVenta:
 *   get:
 *     summary: Listar todos los reportes de ventas
 *     tags: [ReporteVenta]
 *     responses:
 *       200:
 *         description: Lista de reportes de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   venta_id:
 *                     type: integer
 *                   descripcion:
 *                     type: string
 *             example:
 *               - id: 1
 *                 venta_id: 10
 *                 descripcion: "Venta de anillo de oro"
 *               - id: 2
 *                 venta_id: 11
 *                 descripcion: "Venta de pulsera de plata"
 *       401:
 *         description: No autorizado
 *   post:
 *     summary: Crear un nuevo reporte de venta
 *     tags: [ReporteVenta]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               venta_id:
 *                 type: integer
 *                 description: ID de la venta
 *               descripcion:
 *                 type: string
 *                 description: Descripción del reporte
 *           example:
 *             venta_id: 10
 *             descripcion: "Venta de anillo de oro"
 *     responses:
 *       201:
 *         description: Reporte de venta creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 venta_id:
 *                   type: integer
 *                 descripcion:
 *                   type: string
 *             example:
 *               id: 3
 *               venta_id: 10
 *               descripcion: "Venta de anillo de oro"
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /reporteVenta/{id}:
 *   get:
 *     summary: Obtener detalles de un reporte de venta por ID
 *     tags: [ReporteVenta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del reporte de venta
 *     responses:
 *       200:
 *         description: Detalles del reporte de venta
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reporte de venta no encontrado
 *   put:
 *     summary: Actualizar un reporte de venta
 *     tags: [ReporteVenta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del reporte de venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reporte de venta actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reporte de venta no encontrado
 *   delete:
 *     summary: Eliminar un reporte de venta
 *     tags: [ReporteVenta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del reporte de venta
 *     responses:
 *       200:
 *         description: Reporte de venta eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reporte de venta no encontrado
 */
const express = require('express');
const router = express.Router();
const autenticacionMiddleware = require('../middlewares/middlewareAutenticacion');
const {
  obtenerReportesVentas,
  obtenerReporteVenta,
  crearReporteVenta,
  actualizarReporteVenta,
  eliminarReporteVenta
} = require('../controladores/controladorReporteVenta');

router.get('/', autenticacionMiddleware(['admin']), obtenerReportesVentas);
router.get('/:id', autenticacionMiddleware(['admin']), obtenerReporteVenta);
router.post('/', autenticacionMiddleware(['admin']), crearReporteVenta);
router.put('/:id', autenticacionMiddleware(['admin']), actualizarReporteVenta);
router.delete('/:id', autenticacionMiddleware(['admin']), eliminarReporteVenta);

module.exports = router;