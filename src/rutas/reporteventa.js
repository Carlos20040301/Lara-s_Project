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