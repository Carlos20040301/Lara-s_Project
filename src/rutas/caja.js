const express = require('express');
const router = express.Router();
const cajaController = require('../controladores/cajaController');
const middlewareAutenticacion = require('../middlewares/middlewareAutenticacion');

// Todas las rutas protegidas (solo empleados y admins)
router.use(middlewareAutenticacion(['admin']));

// Rutas de lectura
router.get('/', cajaController.obtenerMovimientos);
router.get('/resumen', cajaController.obtenerResumenCaja);
router.get('/:id', cajaController.obtenerMovimientoPorId);

// Rutas de escritura (solo admins)
router.post('/',
  middlewareAutenticacion(['admin']),
  cajaController.crearMovimiento
);

router.put('/:id',
  middlewareAutenticacion(['admin']),
  cajaController.actualizarMovimiento
);

router.delete('/:id',
  middlewareAutenticacion(['admin']),
  cajaController.eliminarMovimiento
);

module.exports = router; 