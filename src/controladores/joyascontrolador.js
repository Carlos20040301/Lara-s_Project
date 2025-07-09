const mongoose  = require('mongoose');
const joya = require('../modelos/joya');
const Categoria = require('../modelos/categoria');
// Controlador para manejar las operaciones relacionadas con las joyas
//crear una nueva joya
exports.crearJoya = async (req, res) => {
  try {
    const { _id, nombre, categoria, precio, descripcion, stock } = req.body;

    // Validar categoría
    const categoriaEncontrada = await Categoria.findOne({ nombre: categoria });
    if (!categoriaEncontrada)
      return res.status(400).json({ msj: 'Categoría no encontrada' });

    // Crear
    const nueva = new joya({
      _id, nombre,
      categoria: categoriaEncontrada._id,
      precio, descripcion, stock,
      imagen: req.nombreImagen || 'default.jpg'
    });

    await nueva.save();
    res.status(201).json({ msj: 'Joya creada correctamente', joya: nueva });
  } catch (error) {
    if (error.code === 11000)          // id duplicado
      return res.status(400).json({ msj: 'ID ya existe' });
    console.error('Error al crear joya:', error);
    res.status(500).json({ msj: 'Error interno al crear joya' });
  }
};

//Actualizar
exports.actualizarImagenJoya = async (req, res) => {
  if (!req.nombreImagen)
    return res.status(400).json({ msj: 'No se envió imagen' });

  try {
    const joyaActualizada = await joya.findByIdAndUpdate(
      req.params.id,
      { imagen: req.nombreImagen },
      { new: true }
    );
    if (!joyaActualizada)
      return res.status(404).json({ msj: 'Joya no encontrada' });

    res.json({ msj: 'Imagen actualizada', joya: joyaActualizada });
  } catch (e) {
    res.status(500).json({ msj: 'Error al actualizar imagen' });
  }
};

//Listar
exports.listarJoyas = async (_req, res) => {
  try {
    const joyas = await joya.find()
                            .populate('categoria', 'nombre descripcion');
    res.json(joyas);
  } catch (error) {
    console.error('Error al listar joyas:', error);
    res.status(500).json({ msj: 'Error al listar las joyas' });
  }
};

//Obtener joya por ID
exports.obtenerJoyaPorId = async (req, res) => {
  try {
    const encontrada = await joya.findById(req.params.id)
                                 .populate('categoria', 'nombre descripcion');
    if (!encontrada)
      return res.status(404).json({ msj: 'Joya no encontrada' });

    res.json(encontrada);
  } catch (error) {
    console.error('Error al obtener la joya:', error);
    res.status(500).json({ msj: 'Error al obtener la joya' });
  }
};

//Actualizar joya por ID
exports.actualizarJoya = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = { ...req.body };

    // Si llega categoría por nombre, conviértela a ObjectId
    if (datos.categoria && !mongoose.Types.ObjectId.isValid(datos.categoria)) {
      const cat = await Categoria.findOne({ nombre: datos.categoria.trim() });
      if (!cat) return res.status(400).json({ msj: 'Categoría no encontrada' });
      datos.categoria = cat._id;
    }

    const joyaActualizada = await joya.findByIdAndUpdate(id, datos, {
      new: true,
      runValidators: true
    }).populate('categoria', 'nombre descripcion');

    if (!joyaActualizada)
      return res.status(404).json({ msj: 'Joya no encontrada' });

    res.json({ msj: 'Joya actualizada', joya: joyaActualizada });
  } catch (error) {
    console.error('Error al actualizar joya:', error);
    res.status(500).json({ msj: 'Error interno al actualizar la joya' });
  }
};

//Eliminar joya por ID
exports.eliminarJoya = async (req, res) => {
  try {
    const joyaActual = await joya.findById(req.params.id);
    if (!joyaActual)
      return res.status(404).json({ msj: 'Joya no encontrada' });

    if (joyaActual.stock > 0)
      return res.status(400).json({ msj: 'No se puede eliminar: stock disponible' });

    await joyaActual.deleteOne();
    res.json({ msj: 'Joya eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la joya:', error);
    res.status(500).json({ msj: 'Error al eliminar la joya' });
  }
};
