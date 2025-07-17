const { body, param, validationResult } = require('express-validator');
const ReporteVentas = require('../modelos/ReporteVenta');

// GET - Obtener todos los reportes
const obtenerReportesVentas = [
  async (req, res) => {
    try {
      const reportes = await ReporteVentas.findAll();
      res.json(reportes);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener reportes', error });
    }
  },
];

// GET - Obtener un solo reporte por ID
const obtenerReporteVenta = [
  param('id').isInt().withMessage('ID inválido'),
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const reporte = await ReporteVentas.findByPk(req.params.id);
      if (!reporte) {
        return res.status(404).json({ mensaje: 'Reporte no encontrado' });
      }
      res.json(reporte);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

// POST - Crear nuevo reporte
const crearReporteVenta = [
  body('fecha').notEmpty().withMessage('La fecha es obligatoria').isDate().withMessage('Formato de fecha inválido'),
  body('total_ventas').isDecimal().withMessage('Total de ventas debe ser un número decimal'),
  body('total_productos').isInt().withMessage('Total de productos debe ser un número entero'),
  body('metodo_pago').isIn(['efectivo', 'tarjeta', 'transferencia', 'paypal']).withMessage('Método de pago inválido'),
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { fecha, total_ventas, total_productos, metodo_pago } = req.body;

    try {
      const nuevoReporte = await ReporteVentas.create({
        fecha,
        total_ventas,
        total_productos,
        metodo_pago
      });
      res.status(201).json(nuevoReporte);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear el reporte', error });
    }
  },
];

// PUT - Actualizar reporte existente
const actualizarReporteVenta = [
  param('id').isInt().withMessage('ID inválido'),
  body('metodo_pago').optional().isIn(['efectivo', 'tarjeta', 'transferencia', 'paypal']).withMessage('Método de pago inválido'),
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const reporte = await ReporteVentas.findByPk(req.params.id);
      if (!reporte) {
        return res.status(404).json({ mensaje: 'Reporte no encontrado' });
      }

      await reporte.update(req.body);
      res.json({ mensaje: 'Reporte actualizado', reporte });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar el reporte', error });
    }
  },
];

// DELETE - Eliminar reporte
const eliminarReporteVenta = [
  param('id').isInt().withMessage('ID inválido'),
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const reporte = await ReporteVentas.findByPk(req.params.id);
      if (!reporte) {
        return res.status(404).json({ mensaje: 'Reporte no encontrado' });
      }

      await reporte.destroy();
      res.json({ mensaje: 'Reporte eliminado' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar el reporte', error });
    }
  },
];

module.exports = {
  obtenerReportesVentas,
  obtenerReporteVenta,
  crearReporteVenta,
  actualizarReporteVenta,
  eliminarReporteVenta
};