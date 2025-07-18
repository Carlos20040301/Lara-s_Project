const express = require('express');
const router = express.Router();
const autenticacionMiddleware = require('../middlewares/middlewareAutenticacion');
const {
  obtenerCompras,
  obtenerCompra,
  crearCompra,
  actualizarCompra,
  eliminarCompra
} = require('../controladores/controladorCompra');

router.get('/', obtenerCompras);

router.get('/:id', obtenerCompra);

// Crear, actualizar y eliminar - solo admin
router.post('/', autenticacionMiddleware(['admin']), crearCompra);
router.put('/:id', autenticacionMiddleware(['admin']), actualizarCompra);
router.delete('/:id', autenticacionMiddleware(['admin']), eliminarCompra);

module.exports = router;