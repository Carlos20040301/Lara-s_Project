const { DataTypes } = require('sequelize');
const sequelize = require('../configuraciones/base_datos');

const ReporteVentas = sequelize.define('ReporteVentas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  total_ventas: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total_productos: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  metodo_pago: {
    type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'paypal'),
    allowNull: false
  }
}, {
  tableName: 'reporte_ventas',
  timestamps: false // Asume que son datos resumidos generados.
});

module.exports = ReporteVentas;
