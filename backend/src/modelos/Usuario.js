const { DataTypes } = require("sequelize");
const sequelize = require("../configuraciones/base_datos");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    primerNombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    segundoNombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    primerApellido: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    segundoApellido: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    genero: {
      type: DataTypes.ENUM('M', 'F', 'O'),
      allowNull: true,
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
      type: DataTypes.ENUM("admin", "empleado", "cliente"),
      allowNull: false,
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
    createdAt: "creadoEn",
    updatedAt: "actualizadoEn",
  }
);

module.exports = Usuario;
