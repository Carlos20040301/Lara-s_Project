const express = require('express');
const router = express.Router();
const controladorProducto = require('../controladores/controladorProducto');
const middlewareAutenticacion = require('../middlewares/middlewareAutenticacion');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Rutas públicas (solo lectura)
router.get('/', controladorProducto.obtenerProductos);
router.get('/:id', controladorProducto.obtenerProductoPorId);

// Rutas protegidas (solo admins)
router.post('/', 
  //middlewareAutenticacion.verificarToken, 
  //middlewareAutenticacion.verificarAdmin,
  middlewareAutenticacion(['admin']), 
  uploadMiddleware.single('imagen'), 
  controladorProducto.crearProducto
);

router.put('/:id', 
  //middlewareAutenticacion.verificarToken, 
  //middlewareAutenticacion.verificarAdmin,
  middlewareAutenticacion(['admin']), 
  uploadMiddleware.single('imagen'), 
  controladorProducto.actualizarProducto
);

router.delete('/:id', 
  //middlewareAutenticacion.verificarToken, 
  //middlewareAutenticacion.verificarAdmin,
  middlewareAutenticacion(['admin']),
  controladorProducto.eliminarProducto
);

// Ruta para actualizar stock (empleados autorizados)
router.patch('/:id/stock', 
 // middlewareAutenticacion.verificarToken, 
  middlewareAutenticacion(['empleado','admin']),
  controladorProducto.actualizarStock
);

module.exports = router; 