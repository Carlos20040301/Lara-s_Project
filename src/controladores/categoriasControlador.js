const categoria = require('../modelos/categoria');

// Controlador para manejar las operaciones relacionadas con las categorías

exports.crearCategoria = async (req, res) => {
    try {
        const nuevaCategoria = new categoria(req.body);
        await nuevaCategoria.save();
        res.status(201).json({ msj: 'Categoría creada exitosamente', categoria: nuevaCategoria });
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        res.status(400).json({ msj: 'Error al crear la categoría' });
    }
}

// Listar todas las categorías
exports.listarCategorias = async (req, res) => {
    try {
        const categorias = await categoria.find();
        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error al listar las categorías:', error);
        res.status(500).json({ msj: 'Error al listar las categorías' });
    }
}

// Obtener una categoría por su ID
exports.obtenerCategoriaPorId = async (req, res) => {   
    try {
        const categoriaEncontrada = await categoria.findOne({ _id: req.params.id });
        if (!categoriaEncontrada) {
            return res.status(404).json({ msj: 'Categoría no encontrada' });
        }
        res.status(200).json(categoriaEncontrada);
    } catch (error) {
        console.error('Error al obtener la categoría:', error);
        res.status(500).json({ msj: 'Error al obtener la categoría' });
    }
}   
// Actualizar una categoría por su ID
exports.actualizarCategoria = async (req, res) => {
    try {
        const categoriaActualizada = await categoria.findByIdAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!categoriaActualizada) {
            return res.status(404).json({ msj: 'Categoría no encontrada' });
        }
        res.status(200).json({ msj: 'Categoría actualizada exitosamente', categoria: categoriaActualizada });
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        res.status(400).json({ msj: 'Error al actualizar la categoría' });
    }
}
// Eliminar una categoría por su ID
exports.eliminarCategoria = async (req, res) => {
    try {
        const categoriaEliminada = await categoria.findByIdAndDelete(req.params.id);
        if (!categoriaEliminada) {
            return res.status(404).json({ msj: 'Categoría no encontrada' });
        }
        res.status(200).json({ msj: 'Categoría eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        res.status(500).json({ msj: 'Error al eliminar la categoría' });
    }
}
