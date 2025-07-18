const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const controladorCategoria = require('../controladores/controladorCategoria');
const middlewareAutenticacion = require('../middlewares/middlewareAutenticacion');
const { crearCategoria, actualizarCategoria, eliminarCategoria } = require('../controladores/controladorCategoria');

// Rutas públicas (solo lectura)
router.get('/listar', controladorCategoria.obtenerCategorias);

router.get('/buscarCategoria', 
        query('id').isInt().withMessage('ID inválido'),
    controladorCategoria.obtenerCategoriaPorId);

// Rutas protegidas (solo admins)
router.post('/guardar', 
        body('nombre').notEmpty().withMessage('El nombre de la categoría es obligatorio.')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre de la categoría debe tener entre 2 y 100 caracteres.'),
        body('descripcion').optional().isString().withMessage('La descripción debe ser una cadena de texto.'),
        body('activo').optional().isBoolean().withMessage('El campo activo debe ser un valor booleano (true/false).').toBoolean(),
    middlewareAutenticacion(['admin']),crearCategoria);

router.put('/actualizar', 
        query('id').isInt().withMessage('ID inválido'),
        body('nombre').notEmpty().withMessage('El nombre de la categoría es obligatorio.')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre de la categoría debe tener entre 2 y 100 caracteres.'),
        body('descripcion').optional().isString().withMessage('La descripción debe ser una cadena de texto.'),
        body('activo').optional().isBoolean().withMessage('El campo activo debe ser un valor booleano (true/false).').toBoolean(),
    middlewareAutenticacion(['admin']),actualizarCategoria);

router.delete('/eliminar', 
        query('id').isInt().withMessage('ID inválido'),
    middlewareAutenticacion(['admin']),eliminarCategoria);

module.exports = router; 