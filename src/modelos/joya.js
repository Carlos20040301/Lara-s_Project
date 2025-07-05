const { Timestamp } = require('bson');
const { timeStamp } = require('console');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const joyasSchema = new mongoose.Schema({
    _id: {
        type: String, // Cambiado a String para usar un ID corto
        required: true, // Asegura que el ID sea obligatorio
        minlength: 2, // Longitud mínima del ID
        maxlength: 8, // Longitud máxima del ID
        unique: true,
        trim: true // Asegura que el ID sea único y sin espacios
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    categoria: {
        type: String,
        required: true,
        enum: ['Anillo', 'Collar', 'Pulsera', 'Arete'], // Categorías permitidas
        trim: true
    },
     precio: {
        type: Number,
        required: true,
        min: 0
    },
    descripcion: {
        type: String,
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    imagen: {
        type: String,
        required: true, 
        trim: true
    }
},
    {
        timestamps: true // Agrega createdAt y updatedAt
    });

    module.exports = mongoose.model('Joya', joyasSchema);

