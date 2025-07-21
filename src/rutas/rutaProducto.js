const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const controladorProducto = require('../controladores/controladorProducto');
const middlewareAutenticacion = require('../middlewares/middlewareAutenticacion');
const uploadMiddlewareProductos = require('../middlewares/uploadMiddlewareProductos');
const validarCampos = require('../middlewares/validationMiddleware');

// Rutas públicas (solo lectura)

/**
 * @swagger
 * tags:
 *  name: Producto
 *  description: Peticiones para la gestion de productos
 */
/**
 * @swagger
 * /producto/listar:
 *  get:
 *   summary: Listar todos los productos
 *   tags: [Producto]
 *   responses:
 *    200:
 *     description: Listar los productos
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          id:
 *           type: integer
 *           description: Id del producto
 *          codigo:
 *           type: string
 *           description: Codigo del producto
 *          nombre:
 *           type: string
 *           description: Nombre del producto
 *          descripcion:
 *           type: string
 *           description: Descripcion del producto
 *          precio:
 *           type: decimal
 *           description: precio del producto
 *          stock:
 *           type: integer
 *           description: Existencia del producto
 *          imagen:
 *           type: string
 *           description: RTN del cliente
 *          categoria_id: 
 *           type: integer
 *           description: Id de la categoria del producto
 *          activo:
 *           type: boolean
 *           description: Estado del producto
 *    400:
 *     description: Error al listar los clientes
 */
router.get('/listar', controladorProducto.obtenerProductos);

/**
 * @swagger
 * /producto/buscarProducto:
 *   get:
 *     summary: Obtener detalles de un producto por ID
 *     tags: [Producto]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proveedor
 *     responses:
 *       200:
 *         description: Detalles del proveedor
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proveedor no encontrado
 */
router.get('/buscarProducto',
    query('id').isInt().withMessage('El ID del producto debe ser un número entero positivo y es requerido.'),
    validarCampos,
  controladorProducto.obtenerProductoPorId);

// Rutas protegidas (solo admins)

/**
 * @swagger
 * /producto/guardar:
 *   post:
 *     summary: Registrar un nuevo producto
 *     tags: [Producto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *                 description: Codigo del producto
 *               nombre:
 *                 type: string
 *                 description: Nombre del producto
 *               descripcion:
 *                 type: string
 *                 description: Descripcion del producto
 *               precio:
 *                   type: decimal
 *                   description: precio del producto
 *               stock:
 *                   type: integer
 *                   description: Existencia del producto
 *               categoria_id:
 *                   type: integer
 *                   description: Id de la categoria del producto
 *               activo:
 *                   type: boolean
 *                   description: Estado del producto
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imagen:
 *                type: string
 *                format: binary
 *                description: Imagen del producto
 *     responses:
 *       201:
 *         description: Proveedor registrado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
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

/**
 * @swagger
 * /producto/actualizar:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Producto]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *                 description: Codigo del producto
 *               nombre:
 *                 type: string
 *                 description: Nombre del producto
 *               descripcion:
 *                 type: string
 *                 description: Descripcion del producto
 *               precio:
 *                   type: decimal
 *                   description: precio del producto
 *               stock:
 *                   type: integer
 *                   description: Existencia del producto
 *               categoria_id:
 *                   type: integer
 *                   description: Id de la categoria del producto
 *               activo:
 *                   type: boolean
 *                   description: Estado del producto
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               categoria_id:
 *                   type: integer
 *                   description: Id de la categoria del producto
 *               imagen:
 *                type: string
 *                format: binary
 *                description: Imagen del producto
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Compra no encontrada
 */
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

/**
 * @swagger
 * /producto/eliminar:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Producto]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Compra no encontrada
 */
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