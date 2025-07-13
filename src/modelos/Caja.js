const { DataTypes } = require('sequelize');
const sequelize = require('../configuraciones/base_datos');
const Venta = require('./Venta');

const Caja = sequelize.define('Caja', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.ENUM('ingreso', 'egreso'),
    allowNull: false
  },
  concepto: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  metodo_pago: {
    type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'paypal'),
    allowNull: false,
    defaultValue: 'efectivo'
  },
  referencia: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  venta_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'ventas',
      key: 'id'
    }
  },
  empleado_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'empleados',
      key: 'id'
    }
  },
  fecha_movimiento: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'caja',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});

// Asociaciones
Caja.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
Venta.hasMany(Caja, { foreignKey: 'venta_id', as: 'cajas' });

module.exports = Caja; 