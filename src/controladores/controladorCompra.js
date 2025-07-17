const { body, param, validationResult } = require('express-validator');
const Compra = require('../modelos/Compra');
const Proveedor = require('../modelos/Producto');
const Empleado = require('../modelos/Empleado');

const obtenerCompras = [
  async (req, res) => {
    try {
      const compras = await Compra.findAll({
        include: [
          { model: Proveedor, as: 'proveedor', attributes: ['nombre', 'telefono', 'direccion'] },
          { model: Empleado, as: 'empleado', attributes: ['cargo', 'telefono'] }
        ]
      });
      res.json(compras);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener las compras', error });
    }
  },
];

const obtenerCompra = [
  param('id').isInt().withMessage('ID inválido'),
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const compra = await Compra.findByPk(req.params.id, {
        include: [
          { model: Proveedor, as: 'proveedor', attributes: ['nombre', 'telefono', 'direccion'] },
          { model: Empleado, as: 'empleado', attributes: ['cargo', 'telefono'] }
        ]
      });

      if (!compra) {
        return res.status(404).json({ mensaje: 'Compra no encontrada' });
      }

      res.json(compra);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener la compra', error });
    }
  },
];

const crearCompra = [
  body('proveedor_id').isInt().withMessage('ID de proveedor inválido'),
  body('empleado_id').isInt().withMessage('ID de empleado inválido'),
  body('numero_factura').optional().isString(),
  body('fecha_compra').optional().isISO8601().withMessage('Fecha inválida'),
  body('total').isDecimal({ min: 0 }).withMessage('Total debe ser un número positivo'),
  body('notas').optional().isString(),
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { proveedor_id, empleado_id, numero_factura, fecha_compra, total, notas } = req.body;

    try {
      const proveedor = await Proveedor.findByPk(proveedor_id);
      const empleado = await Empleado.findByPk(empleado_id);

      if (!proveedor) {
        return res.status(400).json({ mensaje: 'Proveedor no válido' });
      }
      if (!empleado) {
        return res.status(400).json({ mensaje: 'Empleado no válido' });
      }

      const compra = await Compra.create({
        proveedor_id,
        empleado_id,
        numero_factura,
        fecha_compra,
        total,
        notas
      });

      res.status(201).json(compra);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear la compra', error });
    }
  },
];

const actualizarCompra = [
  param('id').isInt().withMessage('ID inválido'),
  body('numero_factura').optional().isString(),
  body('fecha_compra').optional().isISO8601().withMessage('Fecha inválida'),
  body('total').optional().isDecimal({ min: 0 }).withMessage('Total inválido'),
  body('notas').optional().isString(),
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const compra = await Compra.findByPk(req.params.id);
      if (!compra) {
        return res.status(404).json({ mensaje: 'Compra no encontrada' });
      }

      const { numero_factura, fecha_compra, total, notas } = req.body;

      await compra.update({ numero_factura, fecha_compra, total, notas });

      res.json({ mensaje: 'Compra actualizada', compra });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar la compra', error });
    }
  },
];

const eliminarCompra = [
  param('id').isInt().withMessage('ID inválido'),
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const compra = await Compra.findByPk(req.params.id);
      if (!compra) {
        return res.status(404).json({ mensaje: 'Compra no encontrada' });
      }

      await compra.destroy();
      res.json({ mensaje: 'Compra eliminada' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar la compra', error });
    }
  },
];

module.exports = {
  obtenerCompras,
  obtenerCompra,
  crearCompra,
  actualizarCompra,
  eliminarCompra
};
