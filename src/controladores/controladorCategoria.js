const Categoria = require('../modelos/Categoria');
const Producto = require('../modelos/Producto');
const { Op } = require('sequelize');

// Obtener todas las categorías
const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      where: { activo: true },
      order: [['nombre', 'ASC']]
    });
    res.json({
      success: true,
      data: categorias
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener una categoría por ID
const obtenerCategoriaPorId = async (req, res) => {
  try {
    const { id } = req.query;
    const categoria = await Categoria.findByPk(id, {
      include: [{
        model: Producto,
        as: 'productos',
        where: { activo: true },
        required: false
      }]
    });
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    res.json({
      success: true,
      data: categoria
    });
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nueva categoría
const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    // Validar que el nombre no esté duplicado
    const categoriaExistente = await Categoria.findOne({
      where: { 
        nombre: nombre,
        activo: true
      }
    });
    if (categoriaExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }
    const nuevaCategoria = await Categoria.create({
      nombre,
      descripcion
    });
    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: nuevaCategoria
    });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar categoría
const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.query;
    const { nombre, descripcion } = req.body;
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    // Validar que el nombre no esté duplicado (excluyendo la categoría actual)
    if (nombre && nombre !== categoria.nombre) {
      const categoriaExistente = await Categoria.findOne({
        where: { 
          nombre: nombre,
          activo: true,
          id: { [Op.ne]: id }
        }
      });
      if (categoriaExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una categoría con ese nombre'
        });
      }
    }
    await categoria.update({
      nombre: nombre || categoria.nombre,
      descripcion: descripcion !== undefined ? descripcion : categoria.descripcion
    });
    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: categoria
    });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar categoría (soft delete)
const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.query;

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    // Verificar que no haya productos asociados
    const productosAsociados = await Producto.count({
      where: { 
        categoria_id: id,
        activo: true
      }
    });
    if (productosAsociados > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la categoría. Tiene ${productosAsociados} producto(s) asociado(s)`
      });
    }
    await categoria.update({ activo: false });
    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
}; 