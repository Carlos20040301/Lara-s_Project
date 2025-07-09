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
        minlength: 3,
        maxlength: 100,
        trim: true
    },
    categoria: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Categoria',
    required: true
},

     precio: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: function(v) {
                return v >= 0; // Asegura que el precio no sea negativo
            },
            message: props => `${props.value} no es un precio válido!`
        }
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

