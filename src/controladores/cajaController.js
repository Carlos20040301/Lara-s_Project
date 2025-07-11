const Caja = require('../modelos/Caja');
const Venta = require('../modelos/Venta');
const { Op } = require('sequelize');

// Obtener todos los movimientos de caja
const obtenerMovimientos = async (req, res) => {
  try {
    const { tipo, fecha_inicio, fecha_fin, metodo_pago } = req.query;
    const where = {};

    // Filtros
    if (tipo) {
      where.tipo = tipo;
    }

    if (metodo_pago) {
      where.metodo_pago = metodo_pago;
    }

    if (fecha_inicio && fecha_fin) {
      where.fecha_movimiento = {
        [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)]
      };
    }

    const movimientos = await Caja.findAll({
      where,
      include: [{
        model: Venta,
        as: 'venta',
        attributes: ['id', 'numero_pedido', 'cliente_nombre'],
        required: false
      }],
      order: [['fecha_movimiento', 'DESC']]
    });

    // Calcular totales
    const totalIngresos = movimientos
      .filter(m => m.tipo === 'ingreso')
      .reduce((sum, m) => sum + parseFloat(m.monto), 0);

    const totalEgresos = movimientos
      .filter(m => m.tipo === 'egreso')
      .reduce((sum, m) => sum + parseFloat(m.monto), 0);

    const balance = totalIngresos - totalEgresos;

    res.json({
      success: true,
      data: {
        movimientos,
        resumen: {
          totalIngresos,
          totalEgresos,
          balance
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener un movimiento por ID
const obtenerMovimientoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const movimiento = await Caja.findByPk(id, {
      include: [{
        model: Venta,
        as: 'venta',
        attributes: ['id', 'numero_pedido', 'cliente_nombre', 'total'],
        required: false
      }]
    });

    if (!movimiento) {
      return res.status(404).json({
        success: false,
        message: 'Movimiento no encontrado'
      });
    }

    res.json({
      success: true,
      data: movimiento
    });
  } catch (error) {
    console.error('Error al obtener movimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo movimiento
const crearMovimiento = async (req, res) => {
  try {
    const {
      tipo,
      concepto,
      monto,
      metodo_pago,
      referencia,
      venta_id,
      notas
    } = req.body;

    // Validar tipo
    if (!['ingreso', 'egreso'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo debe ser "ingreso" o "egreso"'
      });
    }

    // Validar monto
    if (!monto || parseFloat(monto) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Monto debe ser mayor a 0'
      });
    }

    // Si es un ingreso relacionado con una venta, verificar que la venta existe
    if (venta_id && tipo === 'ingreso') {
      const venta = await Venta.findByPk(venta_id);
      if (!venta) {
        return res.status(400).json({
          success: false,
          message: 'Venta no encontrada'
        });
      }
    }

    const nuevoMovimiento = await Caja.create({
      tipo,
      concepto,
      monto: parseFloat(monto),
      metodo_pago: metodo_pago || 'efectivo',
      referencia,
      venta_id,
      empleado_id: req.user?.id || null,
      fecha_movimiento: new Date(),
      notas
    });

    // Obtener el movimiento con la venta relacionada
    const movimientoCompleto = await Caja.findByPk(nuevoMovimiento.id, {
      include: [{
        model: Venta,
        as: 'venta',
        attributes: ['id', 'numero_pedido', 'cliente_nombre'],
        required: false
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Movimiento creado exitosamente',
      data: movimientoCompleto
    });
  } catch (error) {
    console.error('Error al crear movimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar movimiento
const actualizarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      concepto,
      monto,
      metodo_pago,
      referencia,
      notas
    } = req.body;

    const movimiento = await Caja.findByPk(id);
    if (!movimiento) {
      return res.status(404).json({
        success: false,
        message: 'Movimiento no encontrado'
      });
    }

    // No permitir cambiar el tipo de movimiento
    if (req.body.tipo && req.body.tipo !== movimiento.tipo) {
      return res.status(400).json({
        success: false,
        message: 'No se puede cambiar el tipo de movimiento'
      });
    }

    await movimiento.update({
      concepto: concepto || movimiento.concepto,
      monto: monto ? parseFloat(monto) : movimiento.monto,
      metodo_pago: metodo_pago || movimiento.metodo_pago,
      referencia: referencia !== undefined ? referencia : movimiento.referencia,
      notas: notas !== undefined ? notas : movimiento.notas
    });

    res.json({
      success: true,
      message: 'Movimiento actualizado exitosamente',
      data: movimiento
    });
  } catch (error) {
    console.error('Error al actualizar movimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar movimiento
const eliminarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;

    const movimiento = await Caja.findByPk(id);
    if (!movimiento) {
      return res.status(404).json({
        success: false,
        message: 'Movimiento no encontrado'
      });
    }

    // No permitir eliminar movimientos relacionados con ventas
    if (movimiento.venta_id) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar un movimiento relacionado con una venta'
      });
    }

    await movimiento.destroy();

    res.json({
      success: true,
      message: 'Movimiento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar movimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener resumen de caja
const obtenerResumenCaja = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    const where = {};

    if (fecha_inicio && fecha_fin) {
      where.fecha_movimiento = {
        [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)]
      };
    }

    const movimientos = await Caja.findAll({ where });

    const totalIngresos = movimientos
      .filter(m => m.tipo === 'ingreso')
      .reduce((sum, m) => sum + parseFloat(m.monto), 0);

    const totalEgresos = movimientos
      .filter(m => m.tipo === 'egreso')
      .reduce((sum, m) => sum + parseFloat(m.monto), 0);

    const balance = totalIngresos - totalEgresos;

    // Agrupar por método de pago
    const porMetodoPago = {};
    movimientos.forEach(m => {
      const metodo = m.metodo_pago;
      if (!porMetodoPago[metodo]) {
        porMetodoPago[metodo] = { ingresos: 0, egresos: 0 };
      }
      if (m.tipo === 'ingreso') {
        porMetodoPago[metodo].ingresos += parseFloat(m.monto);
      } else {
        porMetodoPago[metodo].egresos += parseFloat(m.monto);
      }
    });

    res.json({
      success: true,
      data: {
        totalIngresos,
        totalEgresos,
        balance,
        porMetodoPago,
        cantidadMovimientos: movimientos.length
      }
    });
  } catch (error) {
    console.error('Error al obtener resumen de caja:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  obtenerMovimientos,
  obtenerMovimientoPorId,
  crearMovimiento,
  actualizarMovimiento,
  eliminarMovimiento,
  obtenerResumenCaja
}; 