const express = require('express');
const router = express.Router();
const usuariosController = require('../controladores/usuariosController');

// Aquí puedes agregar autenticación JWT cuando esté lista
// const autenticacion = require('../intermediarios/autenticacion');
// router.use(autenticacion);

router.post('/registro', usuariosController.registrar);
router.get('/', usuariosController.listar);
router.get('/:id', usuariosController.obtenerPorId);
router.put('/:id', usuariosController.actualizar);
router.delete('/:id', usuariosController.eliminar);

module.exports = router;