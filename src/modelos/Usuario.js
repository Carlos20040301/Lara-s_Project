const { DataTypes } = require('sequelize');
const sequelize = require('../configuraciones/base_datos');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, Infinity],
    },
  },
  rol: {
    type: DataTypes.ENUM('admin', 'empleado', 'cliente'),
    allowNull: false,
  },
  creadoEn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  actualizadoEn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'creadoEn',
  updatedAt: 'actualizadoEn',
});

module.exports = Usuario;