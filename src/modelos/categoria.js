const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true, // Campo obligatorio
    unique: true, // Asegura que el nombre de la categoría sea único
    trim: true // Elimina espacios en blanco al inicio y al final
  },
  descripcion: {
    type: String, // Descripción opcional de la categoría
    trim: true 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Categoria', categoriaSchema);