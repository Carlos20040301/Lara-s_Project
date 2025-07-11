const express = require('express');
const router = express.Router();
const pedidosController = require('../controladores/pedidosController');
const middlewareAutenticacion = require('../middlewares/middlewareAutenticacion');

// Rutas protegidas (empleados y admins)
router.get('/', middlewareAutenticacion.verificarToken, pedidosController.obtenerPedidos);
router.get('/:id', middlewareAutenticacion.verificarToken, pedidosController.obtenerPedidoPorId);

// Crear pedido (público para clientes, pero con validación)
router.post('/', pedidosController.crearPedido);

// Rutas solo para empleados/admins
router.patch('/:id/estado', 
  middlewareAutenticacion.verificarToken, 
  pedidosController.actualizarEstadoPedido
);

router.delete('/:id', 
  middlewareAutenticacion.verificarToken, 
  middlewareAutenticacion.verificarAdmin, 
  pedidosController.eliminarPedido
);

module.exports = router; 