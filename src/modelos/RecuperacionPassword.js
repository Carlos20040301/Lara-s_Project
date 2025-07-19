const { DataTypes } = require("sequelize");
const sequelize = require("../configuraciones/base_datos");
const Usuario = require("./Usuario");

const RecuperacionPassword = sequelize.define(
  "RecuperacionPassword",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id",
      },
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    token: {
      type: DataTypes.STRING(5),
      allowNull: false,
      validate: {
        len: [5, 5], // Exactamente 5 caracteres
        isNumeric: true, // Solo números
      },
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "usado", "expirado"),
      allowNull: false,
      defaultValue: "pendiente",
    },
    expiracion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: function() {
        // Token expira en 15 minutos
        const expiracion = new Date();
        expiracion.setMinutes(expiracion.getMinutes() + 15);
        return expiracion;
      },
    },
  },
  {
    tableName: "recuperaciones_password",
    timestamps: true,
    createdAt: "creadoEn",
    updatedAt: "actualizadoEn",
    indexes: [
      {
        fields: ['token'],
        unique: true,
      },
      {
        fields: ['correo'],
      },
      {
        fields: ['estado'],
      },
    ],
  }
);

// Relación: RecuperacionPassword pertenece a Usuario
RecuperacionPassword.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });
Usuario.hasMany(RecuperacionPassword, { foreignKey: "usuario_id", as: "recuperaciones" });

module.exports = RecuperacionPassword; 