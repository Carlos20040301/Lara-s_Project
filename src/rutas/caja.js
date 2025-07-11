const express = require('express');
const router = express.Router();
const cajaController = require('../controladores/cajaController');
const middlewareAutenticacion = require('../middlewares/middlewareAutenticacion');

// Todas las rutas protegidas (solo empleados y admins)
router.use(middlewareAutenticacion.verificarToken);

// Rutas de lectura
router.get('/', cajaController.obtenerMovimientos);
router.get('/resumen', cajaController.obtenerResumenCaja);
router.get('/:id', cajaController.obtenerMovimientoPorId);

// Rutas de escritura (solo admins)
router.post('/', 
  middlewareAutenticacion.verificarAdmin, 
  cajaController.crearMovimiento
);

router.put('/:id', 
  middlewareAutenticacion.verificarAdmin, 
  cajaController.actualizarMovimiento
);

router.delete('/:id', 
  middlewareAutenticacion.verificarAdmin, 
  cajaController.eliminarMovimiento
);

module.exports = router; 