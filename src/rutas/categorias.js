const express = require('express');
const router = express.Router();
const categoriasController = require('../controladores/categoriasController');
const middlewareAutenticacion = require('../middlewares/middlewareAutenticacion');
const { crearCategoria, actualizarCategoria, eliminarCategoria } = require('../controladores/categoriasController');

// Rutas públicas (solo lectura)
router.get('/', categoriasController.obtenerCategorias);
router.get('/:id', categoriasController.obtenerCategoriaPorId);

// Rutas protegidas (solo admins)
router.post('/', middlewareAutenticacion(['admin']),crearCategoria);
router.put('/:id', middlewareAutenticacion(['admin']),actualizarCategoria);
router.delete('/:id', middlewareAutenticacion(['admin']),eliminarCategoria);

module.exports = router; 