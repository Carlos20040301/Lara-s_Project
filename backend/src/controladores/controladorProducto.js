
const Producto = require('../modelos/Producto');
const Categoria = require('../modelos/categoria');
const { Op } = require('sequelize');
const fs = require('fs').promises;
const path = require('path');

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
  try {
    const { categoria_id, busqueda, stock_minimo, precio, precioMax, precioMin } = req.query;
    const where = {};
    // Filtros
    if (categoria_id) {
      where.categoria_id = categoria_id;
    }
    if (busqueda) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${busqueda}%` } },
        { codigo: { [Op.like]: `%${busqueda}%` } },
        { descripcion: { [Op.like]: `%${busqueda}%` } }
      ];
    }
    if (stock_minimo) {
      where.stock = { [Op.gte]: parseInt(stock_minimo) };
    }
    if (precio) {
      where.precio = precio;
    } else {
      if (precioMin || precioMax) {
        where.precio = {};
        if (precioMin) where.precio[Op.gte] = parseFloat(precioMin);
        if (precioMax) where.precio[Op.lte] = parseFloat(precioMax);
      }
    }
    const productos = await Producto.findAll({
      where,
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre']
      }],
      order: [['nombre', 'ASC']]
    });
    res.json({
      success: true,
      data: productos
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.query;
    const producto = await Producto.findByPk(id, {
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre', 'descripcion']
      }]
    });
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    res.json({
      success: true,
      data: producto
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo producto
const crearProducto = async (req, res) => {
  try {
    const { codigo, nombre, descripcion, precio, stock, categoria_id } = req.body;
    let imagen = null;
    // Validar que el código no esté duplicado
    const productoExistente = await Producto.findOne({
      where: { 
        codigo: codigo,
        activo: true
      }
    });
    if (productoExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un producto con ese código'
      });
    }
    // Verificar que la categoría existe
    const categoria = await Categoria.findByPk(categoria_id);
    if (!categoria || !categoria.activo) {
      return res.status(400).json({
        success: false,
        message: 'Categoría no válida'
      });
    }
    // Procesar imagen si se subió
    if (req.file) {
      const categoriaNombre = categoria.nombre.toLowerCase().replace(/\s+/g, '-');
      imagen = `uploads/productos/${categoriaNombre}/${req.file.filename}`;
    }
    const nuevoProducto = await Producto.create({
      codigo,
      nombre,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      categoria_id,
      imagen
    });
    // Obtener el producto con la categoría
    const productoCompleto = await Producto.findByPk(nuevoProducto.id, {
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre']
      }]
    });
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: productoCompleto
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar producto
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.query;
    const { codigo, nombre, descripcion, precio, stock, categoria_id } = req.body;
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    // Validar que el código no esté duplicado (excluyendo el producto actual)
    if (codigo && codigo !== producto.codigo) {
      const productoExistente = await Producto.findOne({
        where: { 
          codigo: codigo,
          activo: true,
          id: { [Op.ne]: id }
        }
      });
      if (productoExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un producto con ese código'
        });
      }
    }
    // Verificar que la categoría existe (si se está cambiando)
    if (categoria_id && categoria_id !== producto.categoria_id) {
      const categoria = await Categoria.findByPk(categoria_id);
      if (!categoria || !categoria.activo) {
        return res.status(400).json({
          success: false,
          message: 'Categoría no válida'
        });
      }
    }
    // Procesar nueva imagen si se subió
    let imagen = producto.imagen;
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (producto.imagen) {
        try {
          const pathImagenAnterior = path.join(__dirname, '../../', producto.imagen);
          await fs.unlink(pathImagenAnterior);
        } catch (error) {
          console.log('No se pudo eliminar la imagen anterior:', error.message);
        }
      }
      // Guardar nueva ruta de imagen
      const categoria = await Categoria.findByPk(producto.categoria_id); // para recuperar el nombre
      const categoriaNombre = categoria.nombre.toLowerCase().replace(/\s+/g, '-');
      imagen = `uploads/productos/${categoriaNombre}/${req.file.filename}`;
    }
    await producto.update({
      codigo: codigo || producto.codigo,
      nombre: nombre || producto.nombre,
      descripcion: descripcion !== undefined ? descripcion : producto.descripcion,
      precio: precio ? parseFloat(precio) : producto.precio,
      stock: stock !== undefined ? parseInt(stock) : producto.stock,
      categoria_id: categoria_id || producto.categoria_id,
      imagen
    });
    // Si el stock es mayor a 0, reactivar el producto
    if (producto.stock > 0 && !producto.activo) {
      await producto.update({ activo: true });
    }
    // Obtener el producto actualizado con la categoría
    const productoActualizado = await Producto.findByPk(id, {
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre']
      }]
    });
    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: productoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar producto (out of stock)
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.query;
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    // Verificar que no esté en ventas activas
    const Facturacion  = require('../modelos/Facturacion');
    const ventasAsociadas = await Facturacion.count({
      where: { producto_id: id },
      include: [{
        model: require('../modelos/Venta'),
        as: 'venta',
        where: { estado: { [Op.notIn]: ['cancelado'] } }
      }]
    });
    if (ventasAsociadas > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar el producto. Está asociado a ${ventasAsociadas} venta(s) activa(s)`
      });
    }
    await producto.update({ stock: 0, activo: false });
    res.json({
      success: true,
      message: 'Producto marcado como fuera de stock y desactivado'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar stock de producto
const actualizarStock = async (req, res) => {
console.log('BODY:', req.body);
console.log('QUERY:', req.query);
console.log('USUARIO:', req.usuario);
  try {
    const { id } = req.query;
    const { stock } = req.body;
    console.log('Query ID:', id);
    console.log('Body stock:', stock);
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    await producto.update({ stock: parseInt(stock) });
    // Reactivar si stock > 0
    if (producto.stock > 0 && !producto.activo) {
      await producto.update({ activo: true });
    }
    res.json({
      success: true,
      message: 'Stock actualizado exitosamente',
      data: { id: producto.id, stock: producto.stock }
    });
  } catch (error) {
    console.error('Error al actualizar stock:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  actualizarStock
}; 