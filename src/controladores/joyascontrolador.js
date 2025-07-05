const joya = require('../modelos/joya');

// Controlador para manejar las operaciones relacionadas con las joyas
//crear una nueva joya
exports.crearJoya = async (req, res) => {
    try {
        const nuevaJoya = new joya(req.body);
        await nuevaJoya.save();
        res.status(201).json({msj: 'Joya creada exitosamente', joya: nuevaJoya});
    } catch (error) {
        console.error('Error al crear la joya:', error);
        res.status(400).json({ msj: 'Error al crear la joya' });
    }
};

//listar todas las joyas
exports.listarJoyas = async (req, res) => {
    try {
        const joyas = await joya.find();
        res.status(200).json(joyas);
    } catch (error) {
        console.error('Error al listar las joyas:', error);
        res.status(500).json({ msj: 'Error al listar las joyas' });
    }
};

// Obtener una joya por su ID
exports.obtenerJoyaPorId = async (req, res) => {
    try {
        const joyaEncontrada = await joya.findOne({ _id: req.params.id });
        if (!joyaEncontrada) {
            return res.status(404).json({ msj: 'Joya no encontrada' });
        }
        res.status(200).json(joyaEncontrada);
    } catch (error) {
        console.error('Error al obtener la joya:', error);
        res.status(500).json({ msj: 'Error al obtener la joya' });
    }
};

// Actualizar una joya por su ID
exports.actualizarJoya = async (req, res) => {
    try {
        const joyaActualizada = await joya.findByIdAndUpdate({ _id: req.params.id },
            req.body,
            { new: true });
        if (!joyaActualizada) { 
            return res.status(404).json({ msj: 'Joya no encontrada' });
        } 
         res.status(200).json({ msj: 'Joya actualizada exitosamente', joya: joyaActualizada });
    }
        catch (error) {
        console.error('Error al actualizar la joya:', error);
        res.status(400).json({ msj: 'Error al actualizar la joya' });
        }    
};

// Eliminar una joya por su ID
exports.eliminarJoya = async (req, res) => { 
    try {
        const joyaEliminada = await joya.findOneAndDelete({ _id: req.params.id });
        if (!joyaEliminada) {
            return res.status(404).json({ msj: 'Joya no encontrada' });
        }
        res.status(200).json({ msj: 'Joya eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la joya:', error);
        res.status(500).json({ msj: 'Error al eliminar la joya' });
    }
}
