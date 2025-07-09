const mongoose = require('mongoose');


const inventarioSchema = new mongoose.Schema({
   joya: {
    type: String, 
    ref: 'Joya', // Referencia a la colección de joyas           
    required: true,          
    trim: true
  },
  tipo: {                    
    type: String,
    enum: ['entrada', 'salida', 'ajuste', 'venta', 'compra'],
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  nota: String,              
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
    timestamps: true // Agrega createdAt y updatedAt
});

module.exports = mongoose.model('Inventario', inventarioSchema);