const Venta = require('../modelos/Venta');
const Facturacion = require('../modelos/Facturacion');
const Producto = require('../modelos/Producto');
const Caja = require('../modelos/Caja');
const { Op } = require('sequelize');
const { nanoid } = require('nanoid');
const enviarEmail = require('../configuraciones/email');

// Obtener todos los pedidos
const obtenerPedidos = async (req, res) => {
  try {
    const { estado, fecha_inicio, fecha_fin, cliente_email } = req.query;
    const where = {};

    // Filtros
    if (estado) {
      where.estado = estado;
    }

    if (cliente_email) {
      where.cliente_email = { [Op.like]: `%${cliente_email}%` };
    }

    if (fecha_inicio && fecha_fin) {
      where.fecha_creacion = {
        [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)]
      };
    }

    const pedidos = await Venta.findAll({
      where,
      include: [{
        model: Facturacion,
        as: 'detalles',
        include: [{
          model: Producto,
          as: 'producto',
          attributes: ['id', 'nombre', 'codigo', 'precio']
        }]
      }],
      order: [['fecha_creacion', 'DESC']]
    });

    res.json({
      success: true,
      data: pedidos
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener un pedido por ID
const obtenerPedidoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Venta.findByPk(id, {
      include: [{
        model: Facturacion,
        as: 'detalles',
        include: [{
          model: Producto,
          as: 'producto',
          attributes: ['id', 'nombre', 'codigo', 'precio', 'descripcion']
        }]
      }]
    });

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      data: pedido
    });
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo pedido
const crearPedido = async (req, res) => {
  try {
    const {
      cliente_nombre,
      cliente_email,
      cliente_telefono,
      direccion_entrega,
      productos,
      metodo_pago,
      notas
    } = req.body;

    // Validar productos
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe incluir al menos un producto'
      });
    }

    // Verificar stock y calcular totales
    let subtotal = 0;
    const detallesProductos = [];

    for (const item of productos) {
      const producto = await Producto.findByPk(item.producto_id);
      if (!producto || !producto.activo) {
        return res.status(400).json({
          success: false,
          message: `Producto ${item.producto_id} no encontrado o inactivo`
        });
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}`
        });
      }

      const precioUnitario = parseFloat(producto.precio);
      const cantidad = parseInt(item.cantidad);
      const descuento = parseFloat(item.descuento || 0);
      const subtotalItem = precioUnitario * cantidad;
      const totalItem = subtotalItem - descuento;

      subtotal += totalItem;

      detallesProductos.push({
        producto,
        cantidad,
        precio_unitario: precioUnitario,
        subtotal: subtotalItem,
        descuento,
        total: totalItem
      });
    }

    // Calcular impuestos y total
    const impuesto = subtotal * 0.16; // 16% IVA
    const total = subtotal + impuesto;

    // Generar número de pedido único
    const numeroPedido = `PED-${nanoid(8).toUpperCase()}`;

    // Crear la venta
    const nuevaVenta = await Venta.create({
      numero_pedido: numeroPedido,
      cliente_nombre,
      cliente_email,
      cliente_telefono,
      direccion_entrega,
      subtotal,
      impuesto,
      total,
      metodo_pago,
      notas,
      empleado_id: req.user?.id || null
    });

    // Crear detalles de facturación y actualizar stock
    for (const detalle of detallesProductos) {
      await Facturacion.create({
        venta_id: nuevaVenta.id,
        producto_id: detalle.producto.id,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario,
        subtotal: detalle.subtotal,
        descuento: detalle.descuento,
        total: detalle.total
      });

      // Actualizar stock del producto
      await detalle.producto.update({
        stock: detalle.producto.stock - detalle.cantidad
      });
    }

    // Registrar ingreso en caja
    await Caja.create({
      tipo: 'ingreso',
      concepto: `Venta - Pedido ${numeroPedido}`,
      monto: total,
      metodo_pago,
      referencia: numeroPedido,
      venta_id: nuevaVenta.id,
      empleado_id: req.user?.id || null
    });

    // Enviar email al cliente
    try {
      await enviarEmail({
        to: cliente_email,
        subject: `Confirmación de Pedido - ${numeroPedido}`,
        html: `
          <h2>¡Gracias por tu pedido!</h2>
          <p><strong>Número de Pedido:</strong> ${numeroPedido}</p>
          <p><strong>Cliente:</strong> ${cliente_nombre}</p>
          <p><strong>Total:</strong> $${total.toFixed(2)}</p>
          <p><strong>Estado:</strong> Pendiente</p>
          <p>Te notificaremos cuando tu pedido esté listo.</p>
        `
      });
    } catch (emailError) {
      console.error('Error al enviar email:', emailError);
    }

    // Obtener el pedido completo
    const pedidoCompleto = await Venta.findByPk(nuevaVenta.id, {
      include: [{
        model: Facturacion,
        as: 'detalles',
        include: [{
          model: Producto,
          as: 'producto',
          attributes: ['id', 'nombre', 'codigo', 'precio']
        }]
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: pedidoCompleto
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar estado del pedido
const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const pedido = await Venta.findByPk(id);
    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    const estadosValidos = ['pendiente', 'confirmado', 'en_proceso', 'enviado', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado no válido'
      });
    }

    await pedido.update({ estado });

    // Si se cancela el pedido, restaurar stock
    if (estado === 'cancelado' && pedido.estado !== 'cancelado') {
      const detalles = await Facturacion.findAll({
        where: { venta_id: id },
        include: [{
          model: Producto,
          as: 'producto'
        }]
      });

      for (const detalle of detalles) {
        await detalle.producto.update({
          stock: detalle.producto.stock + detalle.cantidad
        });
      }
    }

    res.json({
      success: true,
      message: 'Estado del pedido actualizado exitosamente',
      data: { id: pedido.id, estado: pedido.estado }
    });
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar pedido (solo si está cancelado)
const eliminarPedido = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Venta.findByPk(id);
    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    if (pedido.estado !== 'cancelado') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden eliminar pedidos cancelados'
      });
    }

    // Eliminar detalles de facturación
    await Facturacion.destroy({
      where: { venta_id: id }
    });

    // Eliminar movimientos de caja
    await Caja.destroy({
      where: { venta_id: id }
    });

    // Eliminar la venta
    await pedido.destroy();

    res.json({
      success: true,
      message: 'Pedido eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarEstadoPedido,
  eliminarPedido
}; 