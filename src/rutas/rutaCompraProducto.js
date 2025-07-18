const express = require('express');
const router = express.Router();
const autenticacionMiddleware = require('../middlewares/middlewareAutenticacion');
const {
  obtenerCompraProductos,
  obtenerCompraProducto,
  crearCompraProducto,
  actualizarCompraProducto,
  eliminarCompraProducto
} = require('../controladores/controladorCompraProducto');

router.get('/', obtenerCompraProductos);

router.get('/:id', obtenerCompraProducto);

// Crear, actualizar y eliminar - solo admin (o roles autorizados)
router.post('/', autenticacionMiddleware(['admin']), crearCompraProducto);
router.put('/:id', autenticacionMiddleware(['admin']), actualizarCompraProducto);
router.delete('/:id', autenticacionMiddleware(['admin']), eliminarCompraProducto);

module.exports = router;
