const Pedido = require('../modelos/Pedido');
const Usuario = require('../modelos/Usuario');
const joya = require('../modelos/joya');
const { enviarCorreoNuevoPedido, enviarCorreoActualizacionEstado } = require('../configuracion/correo');

// Controlador para crear un nuevo pedido
const crearPedido = async (req, res) => {
  try {
    const { joya_id, cantidad, total, estado = 'pendiente', admin_id } = req.body;

    // Verificar que el administrador existe
    const admin = await Usuario.findByPk(admin_id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }

    // Verificar que la joya existe
    const joyaEncontrada = await joya.findById(joya_id);
    if (!joyaEncontrada) {
      return res.status(404).json({
        success: false,
        message: 'Joya no encontrada'
      });
    }

    // Crear el pedido
    const nuevoPedido = await Pedido.create({
      joya_id,
      cantidad,
      total,
      estado,
      admin_id
    });

    // Enviar correo de notificación
    await enviarCorreoNuevoPedido(nuevoPedido, joyaEncontrada, admin);

    // Obtener el pedido con información del administrador
    const pedidoCompleto = await Pedido.findByPk(nuevoPedido.id, {
      include: [{
        model: Usuario,
        as: 'Usuario',
        attributes: ['id', 'nombre', 'email']
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
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Controlador para obtener todos los pedidos
const listarPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [{
        model: Usuario,
        as: 'Usuario',
        attributes: ['id', 'nombre', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Pedidos obtenidos exitosamente',
      count: pedidos.length,
      data: pedidos
    });

  } catch (error) {
    console.error('Error al listar pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Controlador para obtener un pedido por ID
const obtenerPedidoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'Usuario',
        attributes: ['id', 'nombre', 'email']
      }]
    });

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pedido obtenido exitosamente',
      data: pedido
    });

  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Controlador para actualizar un pedido
const actualizarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { joya_id, cantidad, total, estado, admin_id } = req.body;

    // Buscar el pedido existente
    const pedidoExistente = await Pedido.findByPk(id);
    if (!pedidoExistente) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    // Guardar el estado anterior para el correo
    const estadoAnterior = pedidoExistente.estado;

    // Verificar que el administrador existe si se está actualizando
    if (admin_id) {
      const admin = await Usuario.findByPk(admin_id);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Administrador no encontrado'
        });
      }
    }

    // Verificar que la joya existe si se está actualizando
    if (joya_id) {
      const joyaEncontrada = await joya.findById(joya_id);
      if (!joyaEncontrada) {
        return res.status(404).json({
          success: false,
          message: 'Joya no encontrada'
        });
      }
    }

    // Actualizar el pedido
    const datosActualizar = {};
    if (joya_id) datosActualizar.joya_id = joya_id;
    if (cantidad) datosActualizar.cantidad = cantidad;
    if (total) datosActualizar.total = total;
    if (estado) datosActualizar.estado = estado;
    if (admin_id) datosActualizar.admin_id = admin_id;

    await pedidoExistente.update(datosActualizar);

    // Obtener el pedido actualizado con información relacionada
    const pedidoActualizado = await Pedido.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'Usuario',
        attributes: ['id', 'nombre', 'email']
      }]
    });

    // Enviar correo de actualización si el estado cambió
    if (estado && estado !== estadoAnterior) {
      const joyaInfo = await joya.findById(pedidoActualizado.joya_id);
      const adminInfo = await Usuario.findByPk(pedidoActualizado.admin_id);
      
      if (joyaInfo && adminInfo) {
        await enviarCorreoActualizacionEstado(pedidoActualizado, joyaInfo, adminInfo, estadoAnterior);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Pedido actualizado exitosamente',
      data: pedidoActualizado
    });

  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Controlador para eliminar un pedido
const eliminarPedido = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    await pedido.destroy();

    res.status(200).json({
      success: true,
      message: 'Pedido eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Controlador para obtener pedidos por estado
const obtenerPedidosPorEstado = async (req, res) => {
  try {
    const { estado } = req.params;

    const estadosValidos = ['pendiente', 'pagado', 'enviado', 'cancelado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Estados válidos: pendiente, pagado, enviado, cancelado'
      });
    }

    const pedidos = await Pedido.findAll({
      where: { estado },
      include: [{
        model: Usuario,
        as: 'Usuario',
        attributes: ['id', 'nombre', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: `Pedidos con estado '${estado}' obtenidos exitosamente`,
      count: pedidos.length,
      data: pedidos
    });

  } catch (error) {
    console.error('Error al obtener pedidos por estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Controlador para obtener estadísticas de pedidos
const obtenerEstadisticas = async (req, res) => {
  try {
    const totalPedidos = await Pedido.count();
    const pedidosPendientes = await Pedido.count({ where: { estado: 'pendiente' } });
    const pedidosPagados = await Pedido.count({ where: { estado: 'pagado' } });
    const pedidosEnviados = await Pedido.count({ where: { estado: 'enviado' } });
    const pedidosCancelados = await Pedido.count({ where: { estado: 'cancelado' } });

    // Calcular total de ventas (solo pedidos pagados y enviados)
    const pedidosCompletados = await Pedido.findAll({
      where: {
        estado: ['pagado', 'enviado']
      },
      attributes: ['total']
    });

    const totalVentas = pedidosCompletados.reduce((sum, pedido) => {
      return sum + parseFloat(pedido.total);
    }, 0);

    res.status(200).json({
      success: true,
      message: 'Estadísticas obtenidas exitosamente',
      data: {
        totalPedidos,
        pedidosPendientes,
        pedidosPagados,
        pedidosEnviados,
        pedidosCancelados,
        totalVentas: totalVentas.toFixed(2)
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  crearPedido,
  listarPedidos,
  obtenerPedidoPorId,
  actualizarPedido,
  eliminarPedido,
  obtenerPedidosPorEstado,
  obtenerEstadisticas
}; 