const express = require('express');
const router = express.Router();
const categoriasController = require('../controladores/categoriasController');
const middlewareAutenticacion = require('../middlewares/middlewareAutenticacion');

// Rutas públicas (solo lectura)
router.get('/', categoriasController.obtenerCategorias);
router.get('/:id', categoriasController.obtenerCategoriaPorId);

// Rutas protegidas (solo admins)
router.post('/', middlewareAutenticacion.verificarToken, middlewareAutenticacion.verificarAdmin, categoriasController.crearCategoria);
router.put('/:id', middlewareAutenticacion.verificarToken, middlewareAutenticacion.verificarAdmin, categoriasController.actualizarCategoria);
router.delete('/:id', middlewareAutenticacion.verificarToken, middlewareAutenticacion.verificarAdmin, categoriasController.eliminarCategoria);

module.exports = router; 