const express = require('express');
const router = express.Router();
const controladorPedido = require('../controladores/controladorPedido');
const middlewareAutenticacion = require('../middlewares/middlewareAutenticacion');

// Rutas protegidas (empleados y admins)
//router.get('/', middlewareAutenticacion.verificarToken, controladorPedido.obtenerPedidos);
//router.get('/:id', middlewareAutenticacion.verificarToken, controladorPedido.obtenerPedidoPorId);
router.get('/', middlewareAutenticacion(['empleado', 'admin']), controladorPedido.obtenerPedidos);
router.get('/:id', middlewareAutenticacion(['empleado', 'admin']), controladorPedido.obtenerPedidoPorId);

// Crear pedido (público para clientes, pero con validación)
//router.post('/', controladorPedido.crearPedido);
router.post('/', middlewareAutenticacion(['cliente', 'empleado', 'admin']), 
controladorPedido.crearPedido);

// Rutas solo para empleados/admins
router.patch('/:id/estado', middlewareAutenticacion(['empleado', 'admin']), 
controladorPedido.actualizarEstadoPedido);


router.delete('/:id', middlewareAutenticacion(['admin']), 
controladorPedido.eliminarPedido);

module.exports = router;