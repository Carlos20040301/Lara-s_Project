const express = require('express');
const router = express.Router();
const controlador = require('../controladores/categoriasControlador')
const categoria = require('../modelos/categoria');
module.exports = router;

// Ruta para crear una nueva categoría
router.post('/', controlador.crearCategoria);
// Ruta para listar todas las categorías
router.get('/', controlador.listarCategorias);
// Ruta para obtener una categoría por ID
router.get('/:id', controlador.obtenerCategoriaPorId);
// Ruta para actualizar una categoría por ID
router.put('/:id', controlador.actualizarCategoria);
// Ruta para eliminar una categoría por ID
router.delete('/:id', controlador.eliminarCategoria);

module.exports = router;