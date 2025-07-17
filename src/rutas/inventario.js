const express = require('express');
const router = express.Router();
const autenticacionMiddleware = require('../middlewares/middlewareAutenticacion');
const {
  obtenerInventarios,
  obtenerInventario,
  crearInventario,
  actualizarInventario,
  eliminarInventario
} = require('../controladores/controladorInventario');

router.get('/', obtenerInventarios);

router.get('/:id', obtenerInventario);

// Crear, actualizar y eliminar un nuevo movimiento de inventario - solo admin
router.post('/', autenticacionMiddleware(['admin']), crearInventario);
router.put('/:id', autenticacionMiddleware(['admin']), actualizarInventario);
router.delete('/:id', autenticacionMiddleware(['admin']), eliminarInventario);

module.exports = router;
