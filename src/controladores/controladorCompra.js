const { validationResult } = require('express-validator');
const Compra = require('../modelos/Compra');
const CompraProducto = require('../modelos/CompraProducto');
const Proveedor = require('../modelos/Producto');
const Empleado = require('../modelos/Empleado');
const Producto = require('../modelos/Producto');
const Inventario = require('../modelos/Inventario');
const sequelize = require('../configuraciones/base_datos');

const obtenerCompras = [
  async (req, res) => {
    try {
      const compras = await Compra.findAll({
        include: [
          {
            association: 'productos', // compra_productos
            attributes: ['producto_id', 'cantidad', 'precio_unitario']
          }
        ],
        order: [['fecha_compra', 'DESC']]
      });
      // Mapeo al formato solicitado
      const comprasFormateadas = compras.map(compra => ({
        id: compra.id,
        proveedor_id: compra.proveedor_id,
        empleado_id: compra.empleado_id,
        numero_factura: compra.numero_factura,
        fecha_compra: compra.fecha_compra,
        total: parseFloat(compra.total),
        notas: compra.notas,
        productos: compra.productos.map(p => ({
          producto_id: p.producto_id,
          cantidad: p.cantidad,
          precio_unitario: parseFloat(p.precio_unitario)
        }))
      }));
      res.json(comprasFormateadas);
    } catch (error) {
      console.error('Error al obtener compras:', error);
      res.status(500).json({ mensaje: 'Error al obtener las compras', error: error.message });
    }
  }
];

const obtenerCompra = [
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { id } = req.query;
    try {
      const compra = await Compra.findByPk(id, {
        include: [
          {
            association: 'productos',
            attributes: ['producto_id', 'cantidad', 'precio_unitario']
          }
        ]
      });
      if (!compra) {
        return res.status(404).json({ mensaje: 'Compra no encontrada' });
      }
      const compraFormateada = {
        id: compra.id,
        proveedor_id: compra.proveedor_id,
        empleado_id: compra.empleado_id,
        numero_factura: compra.numero_factura,
        fecha_compra: compra.fecha_compra,
        total: parseFloat(compra.total),
        notas: compra.notas,
        productos: compra.productos.map(p => ({
          producto_id: p.producto_id,
          cantidad: p.cantidad,
          precio_unitario: parseFloat(p.precio_unitario)
        }))
      };
      res.json(compraFormateada);
    } catch (error) {
      console.error('Error al obtener compra por ID:', error);
      res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
  }
];

const crearCompra = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  const t = await sequelize.transaction();
  try {
    const { proveedor_id, empleado_id, numero_factura, fecha_compra, total, notas, productos } = req.body;
    const proveedor = await Proveedor.findByPk(proveedor_id);
    const empleado = await Empleado.findByPk(empleado_id);
    if (!proveedor) return res.status(400).json({ mensaje: 'Proveedor no válido' });
    if (!empleado) return res.status(400).json({ mensaje: 'Empleado no válido' });
    const compra = await Compra.create({
      proveedor_id,
      empleado_id,
      numero_factura,
      fecha_compra,
      total,
      notas
    }, { transaction: t });
    for (const item of productos) {
      const { producto_id, cantidad, precio_unitario } = item;
      const producto = await Producto.findByPk(producto_id, { transaction: t });
      if (!producto) {
        await t.rollback();
        return res.status(404).json({ mensaje: `Producto con ID ${producto_id} no encontrado.` });
      }
      const subtotal = cantidad * precio_unitario;
      // Crear CompraProducto
      await CompraProducto.create({
        compra_id: compra.id,
        producto_id,
        cantidad,
        precio_unitario,
        subtotal
      }, { transaction: t });
      // Calcular nuevo stock y precio ponderado
      const nuevoStock = producto.stock + cantidad;
      const nuevoPrecio = ((producto.stock * parseFloat(producto.precio)) + (cantidad * precio_unitario)) / nuevoStock;
      // Actualizar producto
      await producto.update({
        stock: nuevoStock,
        precio: nuevoPrecio
      }, { transaction: t });
      // Registrar movimiento en inventario
      await Inventario.create({
        tipo: 'entrada',
        origen: 'compra',
        cantidad,
        motivo: `Compra #${compra.id}`,
        referencia: numero_factura || `CompraID:${compra.id}`,
        stock_actual: nuevoStock,
        producto_id,
        empleado_id
      }, { transaction: t });
    }
    await t.commit();
    res.status(201).json({ mensaje: 'Compra registrada con éxito', compra });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la compra', error: error.message });
  }
};

const actualizarCompra = [
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { id } = req.query;
    const { proveedor_id, empleado_id, numero_factura, fecha_compra, total, notas, productos } = req.body;
    const transaccion = await sequelize.transaction();
    try {
      const compra = await Compra.findByPk(id, {
        include: { association: 'productos' },
        transaction: transaccion
      });
      if (!compra) {
        await transaccion.rollback();
        return res.status(404).json({ mensaje: 'Compra no encontrada' });
      }
      // Revertir stock e inventario previo
      for (const detalle of compra.productos) {
        const producto = await Producto.findByPk(detalle.producto_id, { transaction: transaccion });
        producto.stock -= detalle.cantidad;
        await producto.save({ transaction: transaccion });
        await Inventario.create({
          tipo: 'salida',
          origen: 'ajuste',
          cantidad: detalle.cantidad,
          motivo: 'Actualización de compra - eliminación anterior',
          referencia: `CompraID: ${id}`,
          stock_actual: producto.stock,
          producto_id: producto.id,
          empleado_id: compra.empleado_id
        }, { transaction: transaccion });
      }
      // Eliminar detalles anteriores
      await CompraProducto.destroy({
        where: { compra_id: id },
        transaction: transaccion
      });
      // Actualizar la compra
      await compra.update({
        proveedor_id,
        empleado_id,
        numero_factura,
        fecha_compra,
        total,
        notas
      }, { transaction: transaccion });
      // Agregar nuevos productos y actualizar stock + inventario
      for (const prod of productos) {
        const producto = await Producto.findByPk(prod.producto_id, { transaction: transaccion });
        const subtotal = parseFloat(prod.cantidad) * parseFloat(prod.precio_unitario);
        await CompraProducto.create({
          compra_id: compra.id,
          producto_id: prod.producto_id,
          cantidad: prod.cantidad,
          precio_unitario: prod.precio_unitario,
          subtotal
        }, { transaction: transaccion });
        // Actualizar stock y precio ponderado
        const stockAnterior = producto.stock;
        producto.stock += prod.cantidad;
        // Precio ponderado (simple)
        producto.precio = (
          (parseFloat(producto.precio) * stockAnterior + prod.precio_unitario * prod.cantidad) /
          (producto.stock || 1)
        ).toFixed(2);
        await producto.save({ transaction: transaccion });
        // Inventario
        await Inventario.create({
          tipo: 'entrada',
          origen: 'compra',
          cantidad: prod.cantidad,
          motivo: 'Actualización de compra - nuevo producto',
          referencia: `CompraID: ${id}`,
          stock_actual: producto.stock,
          producto_id: producto.id,
          empleado_id
        }, { transaction: transaccion });
      }
      await transaccion.commit();
      res.json({ mensaje: 'Compra actualizada exitosamente' });
    } catch (error) {
      await transaccion.rollback();
      console.error('Error al actualizar compra:', error);
      res.status(500).json({ mensaje: 'Error al actualizar la compra', error: error.message });
    }
  }
];

const eliminarCompra = [
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { id } = req.query;
    const transaccion = await sequelize.transaction();
    try {
      const compra = await Compra.findByPk(id, {
        include: { association: 'productos' },
        transaction: transaccion
      });
      if (!compra) {
        await transaccion.rollback();
        return res.status(404).json({ mensaje: 'Compra no encontrada' });
      }
      // Revertir el stock e insertar movimientos de inventario
      for (const detalle of compra.productos) {
        const producto = await Producto.findByPk(detalle.producto_id, { transaction: transaccion });
        producto.stock -= detalle.cantidad;
        await producto.save({ transaction: transaccion });
        await Inventario.create({
          tipo: 'salida',
          origen: 'ajuste',
          cantidad: detalle.cantidad,
          motivo: 'Eliminación de compra',
          referencia: `CompraID: ${id}`,
          stock_actual: producto.stock,
          producto_id: producto.id,
          empleado_id: compra.empleado_id
        }, { transaction: transaccion });
      }
      // Eliminar los detalles de productos y la compra
      await CompraProducto.destroy({
        where: { compra_id: id },
        transaction: transaccion
      });
      await compra.destroy({ transaction: transaccion });
      await transaccion.commit();
      res.json({ mensaje: 'Compra eliminada correctamente' });
    } catch (error) {
      await transaccion.rollback();
      console.error('Error al eliminar compra:', error);
      res.status(500).json({ mensaje: 'Error al eliminar la compra', error: error.message });
    }
  }
];

module.exports = {
  obtenerCompras,
  obtenerCompra,
  crearCompra,
  actualizarCompra,
  eliminarCompra
};
