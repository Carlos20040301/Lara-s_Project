const express = require('express');
const router = express.Router();
const autenticacionMiddleware = require('../middlewares/middlewareAutenticacion');
const {
  obtenerProveedores,
  obtenerProveedor,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
} = require('../controladores/controladorProveedor');

router.get('/', obtenerProveedores);

router.get('/:id', obtenerProveedor);

// Crear, actualizar y eliminar - solo admin
router.post('/', autenticacionMiddleware(['admin']), crearProveedor);
router.put('/:id', autenticacionMiddleware(['admin']), actualizarProveedor);
router.delete('/:id', autenticacionMiddleware(['admin']), eliminarProveedor);

module.exports = router;
