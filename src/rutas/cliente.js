const express = require('express');
const { body, query } = require('express-validator');
const controladorCliente = require('../controladores/controladorCliente');
const Cliente = require('../modelos/cliente');
const { where } = require('sequelize');
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Cliente
 *  description: Peticiones para la gestion de clientes
 */
/**
 * @swagger
 * /clientes/listar:
 *  get:
 *   summary: Listar todos los clientes
 *   tags: [Cliente]
 *   responses:
 *    200:
 *     description: Listar los clientes
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          primerNombre:
 *           type: string
 *           description: Primer nombre del cliente
 *          segundoNombre:
 *           type: string
 *           description: Segundo nombre del cliente
 *          primerApellido:
 *           type: string
 *           description: Primer apellido del cliente
 *          segundoApellido:
 *           type: string
 *           description: Segundo apellido del cliente
 *          estado:
 *           type: enum
 *           enum: [activo, inactivo]
 *           description: Estado del cliente
 *          rtn:
 *           type: string
 *           description: RTN del cliente
 *          genero: 
 *           type: enum
 *           enum: [M, F]
 *           description: Genero con el que se identifica el cliente
 *    400:
 *     description: Error al listar los clientes
 */
router.get('/listar', controladorCliente.listarClientes);

/**
 * @swagger
 * /clientes/guardar:
 *  post:
 *   summary: Guardar todos los clientes
 *   tags: [Cliente]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        primerNombre:
 *         type: string
 *         description: Primer nombre del cliente
 *        segundoNombre:
 *         type: string
 *         description: Segundo nombre del cliente
 *        primerApellido:
 *         type: string
 *         description: Primer apellido del cliente
 *        segundoApellido:
 *         type: string
 *         description: Segundo apellido del cliente
 *        estado:
 *         type: enum
 *         enum: [activo, inactivo]
 *         description: Estado del cliente
 *        rtn:
 *         type: string
 *         description: RTN del cliente
 *        genero: 
 *         type: enum
 *         enum: [M, F]
 *         description: Genero con el que se identifica el cliente
 *   responses:
 *    201:
 *     description: Crear/guarda los clientes
 *    400:
 *     description: Error al guardar los clientes
 */
router.post('/guardar',

    // Campos Obligatorios
    body('primerNombre').isLength({ max: 50, min: 5 }).withMessage(
        'El primer nombre debe tener entre 5 y 50 caracteres'
    ),
    body('primerApellido').isLength({ max: 50, min: 5 }).withMessage(
        'El primer apellido debe tener entre 5 y 50 caracteres'
    ),

    // Campos Opcionales
    body('segundoNombre').optional().isLength({ max: 50, min: 5 }).withMessage(
        'El segundo nombre debe tener entre 5 y 50 caracteres'
    ),
    body('segundoApellido').optional().isLength({ max: 50, min: 5 }).withMessage(
        'El segundo apellido debe tener entre 5 y 50 caracteres'
    ),
    body('rtn').optional().isLength({ max: 14, min: 14 }).withMessage(
        'El RTN debe tener exactamente 14 caracteres'
    ).custom(async (value) => {
        const buscarRTN = await Cliente.findOne({
            where: { rtn: value }
        });
        if (buscarRTN) {
            throw new Error('El RTN ya está registrado');
        }
    }),
    body('estado').optional().isIn(['activo', 'inactivo']).withMessage(
        'El estado debe ser "activo" o "inactivo"'
    ),
    body('genero').optional().isIn(['M', 'F']).withMessage(
        'El género debe ser "M" o "F"'
    ),
    controladorCliente.guardarCliente
)

/**
 * @swagger
 * /clientes/editar:
 *   put:
 *     summary: Actualiza un cliente por su ID
 *     tags: [Cliente]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          primerNombre:
 *           type: string
 *           description: Primer nombre del cliente
 *          segundoNombre:
 *           type: string
 *           description: Segundo nombre del cliente
 *          primerApellido:
 *           type: string
 *           description: Primer apellido del cliente
 *          segundoApellido:
 *           type: string
 *           description: Segundo apellido del cliente
 *          estado:
 *           type: string
 *           enum: [activo, inactivo]
 *           description: Estado del cliente
 *          rtn:
 *           type: string
 *           description: RTN del cliente
 *          genero: 
 *           type: string
 *           enum: [M, F]
 *           description: Genero con el que se identifica el cliente
 *     responses:
 *       201:
 *         description: Cliente Actualizado
 *       400:
 *         description: Error al actualizar el cliente
 */
router.put('/editar',

    // Validación de ID
    query('id').isInt().withMessage('El ID debe ser un número entero')
    .custom(async (value) => {
        const buscarId = await Cliente.findOne({
            where: { id: value }
        });
        if (!buscarId) {
            throw new Error('Cliente no encontrado o no existe');
        }
    }),

    // Campos Obligatorios
    body('primerNombre').isLength({ max: 50, min: 5 }).withMessage(
        'El primer nombre debe tener entre 5 y 50 caracteres'
    ),
    body('primerApellido').isLength({ max: 50, min: 5 }).withMessage(
        'El primer apellido debe tener entre 5 y 50 caracteres'
    ),

    // Campos Opcionales
    body('segundoNombre').optional().isLength({ max: 50, min: 5 }).withMessage(
        'El segundo nombre debe tener entre 5 y 50 caracteres'
    ),
    body('segundoApellido').optional().isLength({ max: 50, min: 5 }).withMessage(
        'El segundo apellido debe tener entre 5 y 50 caracteres'
    ),
    body('rtn').optional().isLength({ max: 14, min: 14 }).withMessage(
        'El RTN debe tener exactamente 14 caracteres'
    ).custom(async (value) => {
        const buscarRTN = await Cliente.findOne({
            where: { rtn: value }
        });
        if (buscarRTN) {
            throw new Error('El RTN ya está registrado');
        }
    }),
    body('estado').optional().isIn(['activo', 'inactivo']).withMessage(
        'El estado debe ser "activo" o "inactivo"'
    ),
    body('genero').optional().isIn(['M', 'F']).withMessage(
        'El género debe ser "M" o "F"'
    ),
    controladorCliente.editarCliente
)

/**
 * @swagger
 * /clientes/eliminar:
 *   delete:
 *     summary: Eliminar cliente
 *     tags: [Cliente]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado
 *       400:
 *         description: Error al eliminar el cliente
 */
router.delete('/eliminar',

    // Validación de ID
    query('id').isInt().withMessage('El ID debe ser un número entero')
    .custom(async (value) => {
        const buscarId = await Cliente.findOne({
            where: { id: value }
        });
        if (!buscarId) {
            throw new Error('Cliente no encontrado o no existe');
        }
    }),

    // Campos Obligatorios
    body('primerNombre').isLength({ max: 50, min: 5 }).withMessage(
        'El primer nombre debe tener entre 5 y 50 caracteres'
    ),
    body('primerApellido').isLength({ max: 50, min: 5 }).withMessage(
        'El primer apellido debe tener entre 5 y 50 caracteres'
    ),

    // Campos Opcionales
    body('segundoNombre').optional().isLength({ max: 50, min: 5 }).withMessage(
        'El segundo nombre debe tener entre 5 y 50 caracteres'
    ),
    body('segundoApellido').optional().isLength({ max: 50, min: 5 }).withMessage(
        'El segundo apellido debe tener entre 5 y 50 caracteres'
    ),
    body('rtn').optional().isLength({ max: 14, min: 14 }).withMessage(
        'El RTN debe tener exactamente 14 caracteres'
    ).custom(async (value) => {
        const buscarRTN = await Cliente.findOne({
            where: { rtn: value }
        });
        if (buscarRTN) {
            throw new Error('El RTN ya está registrado');
        }
    }),
    body('estado').optional().isIn(['activo', 'inactivo']).withMessage(
        'El estado debe ser "activo" o "inactivo"'
    ),
    body('genero').optional().isIn(['M', 'F']).withMessage(
        'El género debe ser "M" o "F"'
    ),
    controladorCliente.eliminarCliente
)

module.exports = router;