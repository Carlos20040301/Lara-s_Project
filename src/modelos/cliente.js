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
            type: DataTypes.ENUM('M', 'F'),
            allowNull: true,
        }
    },
    {
        tableName: 'clientes',
        timestamps: true,
    }
)

module.exports = Cliente;
