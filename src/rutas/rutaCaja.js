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