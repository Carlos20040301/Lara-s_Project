const express = require('express');
const router = express.Router();
const productosController = require('../controladores/productosController');
const middlewareAutenticacion = require('../middlewares/middlewareAutenticacion');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Rutas públicas (solo lectura)
router.get('/', productosController.obtenerProductos);
router.get('/:id', productosController.obtenerProductoPorId);

// Rutas protegidas (solo admins)
router.post('/', 
  middlewareAutenticacion.verificarToken, 
  middlewareAutenticacion.verificarAdmin, 
  uploadMiddleware.single('imagen'), 
  productosController.crearProducto
);

router.put('/:id', 
  middlewareAutenticacion.verificarToken, 
  middlewareAutenticacion.verificarAdmin, 
  uploadMiddleware.single('imagen'), 
  productosController.actualizarProducto
);

router.delete('/:id', 
  middlewareAutenticacion.verificarToken, 
  middlewareAutenticacion.verificarAdmin, 
  productosController.eliminarProducto
);

// Ruta para actualizar stock (empleados autorizados)
router.patch('/:id/stock', 
  middlewareAutenticacion.verificarToken, 
  productosController.actualizarStock
);

module.exports = router; 