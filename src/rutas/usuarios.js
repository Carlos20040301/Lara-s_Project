const express = require('express');
const router = express.Router();
const autenticacionMiddleware = require('../middlewares/middlewareAutenticacion');
const {obtenerUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario } = require('../controladores/controladorUsuarios');


// Rutas protegidas por middleware
router.get('/', autenticacionMiddleware(['admin']), obtenerUsuarios);
router.get('/:id', autenticacionMiddleware(['admin']), obtenerUsuario);

router.put('/:id', autenticacionMiddleware(['admin']), actualizarUsuario);
router.delete('/:id', autenticacionMiddleware(['admin']), eliminarUsuario);

module.exports = router;