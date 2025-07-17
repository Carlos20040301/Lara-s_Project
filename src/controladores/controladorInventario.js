const { body, param, validationResult } = require('express-validator');
const Inventario = require('../modelos/Inventario');
const Producto = require('../modelos/Producto');
const Empleado = require('../modelos/Empleado');

// Obtener todos los registros de inventario
const obtenerInventarios = [
  async (req, res) => {
    try {
      const inventarios = await Inventario.findAll({
        include: [
          { model: Producto, as: 'producto', attributes: ['nombre', 'precio'] },
          { model: Empleado, as: 'empleado', attributes: ['id', 'cargo'] }
        ]
      });
      res.json(inventarios);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

// Obtener un registro de inventario por ID
const obtenerInventario = [
  param('id').isInt().withMessage('ID inválido'),
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const inventario = await Inventario.findByPk(req.params.id, {
        include: [
          { model: Producto, as: 'producto', attributes: ['nombre', 'precio'] },
          { model: Empleado, as: 'empleado', attributes: ['id', 'cargo'] }
        ]
      });

      if (!inventario) {
        return res.status(404).json({ mensaje: 'Registro de inventario no encontrado' });
      }

      res.json(inventario);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

// Crear un nuevo movimiento de inventario
const crearInventario = [
  body('tipo').isIn(['entrada', 'salida', 'ajuste']).withMessage('Tipo inválido'),
  body('cantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser al menos 1'),
  body('motivo').notEmpty().withMessage('Motivo requerido'),
  body('producto_id').isInt().withMessage('ID de producto inválido'),
  body('empleado_id').optional().isInt().withMessage('ID de empleado inválido'),

  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const { tipo, cantidad, motivo, producto_id, empleado_id } = req.body;

      // Verifica existencia del producto
      const producto = await Producto.findByPk(producto_id);
      if (!producto) {
        return res.status(400).json({ mensaje: 'Producto no encontrado' });
      }

      // Si hay empleado_id, verifica que exista
      if (empleado_id) {
        const empleado = await Empleado.findByPk(empleado_id);
        if (!empleado) {
          return res.status(400).json({ mensaje: 'Empleado no encontrado' });
        }
      }

      const nuevo = await Inventario.create({ tipo, cantidad, motivo, producto_id, empleado_id });
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

// Actualizar un movimiento de inventario
const actualizarInventario = [
  param('id').isInt().withMessage('ID inválido'),
  body('tipo').optional().isIn(['entrada', 'salida', 'ajuste']),
  body('cantidad').optional().isInt({ min: 1 }),
  body('motivo').optional().notEmpty(),
  body('producto_id').optional().isInt(),
  body('empleado_id').optional().isInt(),

  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const inventario = await Inventario.findByPk(req.params.id);
      if (!inventario) {
        return res.status(404).json({ mensaje: 'Registro no encontrado' });
      }

      const { tipo, cantidad, motivo, producto_id, empleado_id } = req.body;

      // Validar relaciones si se actualizan
      if (producto_id) {
        const producto = await Producto.findByPk(producto_id);
        if (!producto) return res.status(400).json({ mensaje: 'Producto no válido' });
      }

      if (empleado_id) {
        const empleado = await Empleado.findByPk(empleado_id);
        if (!empleado) return res.status(400).json({ mensaje: 'Empleado no válido' });
      }

      await inventario.update({ tipo, cantidad, motivo, producto_id, empleado_id });
      res.json({ mensaje: 'Registro actualizado', inventario });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

// Eliminar un registro de inventario
const eliminarInventario = [
  param('id').isInt().withMessage('ID inválido'),
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const inventario = await Inventario.findByPk(req.params.id);
      if (!inventario) {
        return res.status(404).json({ mensaje: 'Registro no encontrado' });
      }

      await inventario.destroy();
      res.json({ mensaje: 'Registro eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

module.exports = {
  obtenerInventarios,
  obtenerInventario,
  crearInventario,
  actualizarInventario,
  eliminarInventario,
};
