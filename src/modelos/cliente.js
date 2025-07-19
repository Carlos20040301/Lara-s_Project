const { DataTypes } = require('sequelize');
const sequelize = require('../configuraciones/base_datos');

const Cliente = sequelize.define(
    'Cliente',
    {
        primerNombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        segundoNombre: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        primerApellido: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        segundoApellido: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        estado: {
            type: DataTypes.ENUM('activo', 'inactivo'),
            allowNull: true,
        },
        rtn: {
            type: DataTypes.STRING(14),
            allowNull: true,
            unique: true,
        },
        genero: {
            type: DataTypes.ENUM('M', 'F', 'O'),
            allowNull: true,
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        telefono: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        direccion: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        tableName: 'clientes',
        timestamps: true,
    }
)

// Relación: Cliente pertenece a Usuario
const Usuario = require('./Usuario');
Cliente.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = Cliente;
