const express = require('express');
const router = express.Router();
const passport = require('passport');
const pedidosController = require('../controladores/pedidosController');
const {
  validarCrearPedido,
  validarActualizarPedido,
  validarObtenerPedido,
  validarEliminarPedido
} = require('../intermediarios/validador');

// Middleware de autenticación JWT para todas las rutas
const autenticacionJWT = passport.authenticate('jwt', { session: false });

// Rutas protegidas con JWT y validaciones

// POST /api/pedidos - Crear un nuevo pedido
router.post(
  '/',
  autenticacionJWT,
  validarCrearPedido,
  pedidosController.crearPedido
);

// GET /api/pedidos - Obtener todos los pedidos
router.get(
  '/',
  autenticacionJWT,
  pedidosController.listarPedidos
);

// GET /api/pedidos/:id - Obtener un pedido por ID
router.get(
  '/:id',
  autenticacionJWT,
  validarObtenerPedido,
  pedidosController.obtenerPedidoPorId
);

// PUT /api/pedidos/:id - Actualizar un pedido
router.put(
  '/:id',
  autenticacionJWT,
  validarActualizarPedido,
  pedidosController.actualizarPedido
);

// DELETE /api/pedidos/:id - Eliminar un pedido
router.delete(
  '/:id',
  autenticacionJWT,
  validarEliminarPedido,
  pedidosController.eliminarPedido
);

// GET /api/pedidos/estado/:estado - Obtener pedidos por estado
router.get(
  '/estado/:estado',
  autenticacionJWT,
  pedidosController.obtenerPedidosPorEstado
);

// GET /api/pedidos/estadisticas - Obtener estadísticas de pedidos
router.get(
  '/estadisticas',
  autenticacionJWT,
  pedidosController.obtenerEstadisticas
);

module.exports = router; 