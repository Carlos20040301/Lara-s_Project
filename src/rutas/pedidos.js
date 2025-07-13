const express = require('express');
const router = express.Router();
const pedidosController = require('../controladores/pedidosController');
const middlewareAutenticacion = require('../middlewares/middlewareAutenticacion');

// Rutas protegidas (empleados y admins)
//router.get('/', middlewareAutenticacion.verificarToken, pedidosController.obtenerPedidos);
//router.get('/:id', middlewareAutenticacion.verificarToken, pedidosController.obtenerPedidoPorId);
router.get('/', middlewareAutenticacion(['empleado', 'admin']), pedidosController.obtenerPedidos);
router.get('/:id', middlewareAutenticacion(['empleado', 'admin']), pedidosController.obtenerPedidoPorId);

// Crear pedido (público para clientes, pero con validación)
//router.post('/', pedidosController.crearPedido);
router.post('/', middlewareAutenticacion(['cliente', 'empleado', 'admin']), 
pedidosController.crearPedido);

// Rutas solo para empleados/admins
router.patch('/:id/estado', middlewareAutenticacion(['empleado', 'admin']), 
pedidosController.actualizarEstadoPedido);


router.delete('/:id', middlewareAutenticacion(['admin']), 
pedidosController.eliminarPedido);

module.exports = router;