const { DataTypes } = require("sequelize");
const sequelize = require("../configuraciones/base_datos");
const Usuario = require("./Usuario");

const Empleado = sequelize.define(
  "Empleado",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id",
      },
    },
    cargo: {
      type: DataTypes.ENUM("gerente", "vendedor", "cajero", "otro"),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "empleados",
    timestamps: true,
    createdAt: "creadoEn",
    updatedAt: "actualizadoEn",
  }
);

Empleado.belongsTo(Usuario, { foreignKey: "id_usuario" });
Usuario.hasOne(Empleado, { foreignKey: "id_usuario" });

module.exports = Empleado;
