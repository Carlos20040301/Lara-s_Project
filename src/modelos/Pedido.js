const { DataTypes } = require('sequelize');
const { sequelize } = require('../configuracion/db');
const Usuario = require('./Usuario');

// Modelo de Pedido con todas las especificaciones requeridas
const Pedido = sequelize.define(
  'Pedido',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    joya_id: {
      type: DataTypes.STRING, // String porque las joyas usan MongoDB con IDs string
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, // Cantidad debe ser mayor a 0
        isInt: true,
      },
    },
    total: {
      type: DataTypes.DECIMAL(10, 2), // Decimal con 2 decimales
      allowNull: false,
      validate: {
        min: 0, // Total debe ser mayor o igual a 0
      },
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'pagado', 'enviado', 'cancelado'),
      allowNull: false,
      defaultValue: 'pendiente',
      validate: {
        isIn: [['pendiente', 'pagado', 'enviado', 'cancelado']],
      },
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: 'id',
      },
    },
  },
  {
    tableName: 'pedidos',
    timestamps: true, // Agregamos timestamps para auditoría
  }
);

// Relación 1:N (un usuario puede tener muchos pedidos)
Usuario.hasMany(Pedido, { foreignKey: 'admin_id' });
Pedido.belongsTo(Usuario, { foreignKey: 'admin_id' });

module.exports = Pedido;