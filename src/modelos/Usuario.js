<<<<<<< HEAD
const { DataTypes } = require('sequelize');
const { sequelize } = require('../configuracion/db');

// Modelo de Usuario para administradores
const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Valida email único antes de registrar
      validate: {
        isEmail: true,
      },
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 255], // Contraseña mínimo 6 caracteres
      },
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'admin',
      validate: {
        isIn: [['admin']], // Solo rol admin permitido
      },
    },
  },
  {
    tableName: 'usuarios',
    timestamps: false,
  }
);

=======
const { DataTypes } = require('sequelize');
const { sequelize } = require('../configuracion/db');

// Modelo de Usuario para administradores
const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Valida email único antes de registrar
      validate: {
        isEmail: true,
      },
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 255], // Contraseña mínimo 6 caracteres
      },
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'admin',
      validate: {
        isIn: [['admin']], // Solo rol admin permitido
      },
    },
  },
  {
    tableName: 'usuarios',
    timestamps: false,
  }
);

>>>>>>> ca053c240583f5d6c8272b463ebcb0a57060675b
module.exports = Usuario;