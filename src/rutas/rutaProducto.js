const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const controladorProducto = require('../controladores/controladorProducto');
const middlewareAutenticacion = require('../middlewares/middlewareAutenticacion');
const uploadMiddlewareProductos = require('../middlewares/uploadMiddlewareProductos');
const validarCampos = require('../middlewares/validationMiddleware');

// Rutas públicas (solo lectura)
router.get('/listar', controladorProducto.obtenerProductos);

router.get('/buscarProducto',
    query('id').isInt().withMessage('El ID del producto debe ser un número entero positivo y es requerido.'),
    validarCampos,
  controladorProducto.obtenerProductoPorId);

// Rutas protegidas (solo admins)
router.post('/guardar', 
    body('codigo')
        .trim().notEmpty().withMessage('El código es requerido.')
        .isLength({ min: 1, max: 50 }).withMessage('El código debe tener entre 1 y 50 caracteres.'),
    body('nombre')
        .trim().notEmpty().withMessage('El nombre es requerido.')
        .isLength({ min: 1, max: 100 }).withMessage('El nombre debe tener entre 1 y 100 caracteres.'),
    body('descripcion')
        .trim().optional({ checkFalsy: true }).isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres.'),
    body('precio')
        .notEmpty().withMessage('El precio es requerido.')
        .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo.')
        .customSanitizer(value => parseFloat(value).toFixed(2)), // Asegura 2 decimales
    body('stock')
        .notEmpty().withMessage('El stock es requerido.')
        .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo.'),
    body('categoria_id')
        .notEmpty().withMessage('El ID de categoría es requerido.')
        .isInt({ min: 1 }).withMessage('El ID de categoría debe ser un número entero positivo.'),
        validarCampos,
  //middlewareAutenticacion.verificarToken, 
  //middlewareAutenticacion.verificarAdmin,
  middlewareAutenticacion(['admin']), 
  uploadMiddlewareProductos.single('imagen'), 
  controladorProducto.crearProducto
);

router.put('/actualizar', 
    query('id')
        .isInt({ min: 1 }).withMessage('El ID del producto debe ser un número entero positivo y es requerido.'),
    body('codigo')
        .trim().optional({ checkFalsy: true }).isLength({ min: 1, max: 50 }).withMessage('El código debe tener entre 1 y 50 caracteres.'),
    body('nombre')
        .trim().optional({ checkFalsy: true }).isLength({ min: 1, max: 100 }).withMessage('El nombre debe tener entre 1 y 100 caracteres.'),
    body('descripcion')
        .trim().optional({ checkFalsy: true }).isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres.'),
    body('precio')
        .optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo.')
        .customSanitizer(value => parseFloat(value).toFixed(2)), // Asegura 2 decimales
    body('stock')
        .optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo.'),
    body('categoria_id')
        .optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('El ID de categoría debe ser un número entero positivo.'),
        validarCampos,
  //middlewareAutenticacion.verificarToken, 
  //middlewareAutenticacion.verificarAdmin,
  middlewareAutenticacion(['admin']), 
  uploadMiddlewareProductos.single('imagen'), 
  controladorProducto.actualizarProducto
);

router.delete('/eliminar',
  query('id').isInt({ min: 1 }).withMessage('El ID del producto debe ser un número entero positivo y es requerido.'),
  validarCampos,
  //middlewareAutenticacion.verificarToken, 
  //middlewareAutenticacion.verificarAdmin,
  middlewareAutenticacion(['admin']),
  controladorProducto.eliminarProducto
);

// Ruta para actualizar stock (empleados autorizados)
router.patch('/stock',
  query('id')
    .isInt({ min: 1 }).withMessage('El ID del producto debe ser un número entero positivo'),
  body('stock')
    .notEmpty().withMessage('El stock es requerido')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
    validarCampos,
    middlewareAutenticacion(['empleado', 'admin']),
    controladorProducto.actualizarStock
);

module.exports = router; 