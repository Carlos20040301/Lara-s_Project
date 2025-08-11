const mongoose = require('../configuraciones/mongo');

const usuarioSchema = new mongoose.Schema({
  primerNombre: { type: String, required: true },
  segundoNombre: { type: String },
  primerApellido: { type: String },
  segundoApellido: { type: String },
  genero: { type: String, enum: ['M', 'F', 'O'] },
  correo: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'empleado', 'cliente'], required: true },
}, {
  timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' }
});

module.exports = mongoose.model('Usuario', usuarioSchema);