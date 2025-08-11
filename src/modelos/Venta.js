const { DataTypes } = require('sequelize');
const sequelize = require('../configuraciones/base_datos');


const Venta = sequelize.define('Venta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_pedido: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  cliente_nombre: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  cliente_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  cliente_telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  direccion_entrega: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  impuesto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
    estado: {
    type: DataTypes.ENUM('pendiente', 'confirmado', 'en_proceso', 'enviado', 'entregado', 'cancelado'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  metodo_pago: {
    type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'paypal'),
    allowNull: false,
    defaultValue: 'efectivo'
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  empleado_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'empleados',
      key: 'id'
    }
  }
}, {
  tableName: 'ventas',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});



// Relación con Empleado
const Empleado = require('./Empleado');
Venta.belongsTo(Empleado, { foreignKey: 'empleado_id', as: 'empleado' });

module.exports = Venta; 