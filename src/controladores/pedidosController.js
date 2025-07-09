const Pedido = require('../modelos/Pedido');
const Usuario = require('../modelos/Usuario');
const Joya = require('../modelos/joya');
const { movimiento } = require('../helpers/inventario');

const { enviarCorreoNuevoPedido, enviarCorreoActualizacionEstado } = require('../configuracion/correo');


// Crear nuevo pedido
const crearPedido = async (req, res) => {
  try {
    const { joya_id, cantidad, total, estado = 'pendiente', admin_id } = req.body;

    //  Verificar admin 
    const admin = await Usuario.findByPk(admin_id);
    if (!admin) return res.status(404).json({ success:false, message:'Administrador no encontrado' });

    // Verificar joya y stock
    const joya = await Joya.findById(joya_id);
    if (!joya) return res.status(404).json({ success:false, message:'Joya no encontrada' });
    if (joya.stock < cantidad)
      return res.status(400).json({ success:false, message:`Stock insuficiente (quedan ${joya.stock})` });

    // Crear pedido en MySQL
    const nuevoPedido = await Pedido.create({ joya_id, cantidad, total, estado, admin_id });

    // Registrar venta y restar stock 
    await movimiento({
      joyaId: joya_id,
      tipo:   'venta',
      cantidad,
      nota:   `Pedido #${nuevoPedido.id}`
    });

    // Enviar correo
    await enviarCorreoNuevoPedido(nuevoPedido, joya, admin);

    const pedidoCompleto = await Pedido.findByPk(nuevoPedido.id, {
      include: [{ model: Usuario, as: 'Usuario', attributes:['id','nombre','email'] }]
    });

    res.status(201).json({ success:true, message:'Pedido creado', data:pedidoCompleto });

  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ success:false, message:error.message });
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

// ACTUALIZAR PEDIDO
const actualizarPedido = async (req, res) => {
  try {
    const { id }      = req.params;
    const { joya_id, cantidad, total, estado, admin_id } = req.body;

    const pedido = await Pedido.findByPk(id);
    if (!pedido) return res.status(404).json({ success:false, message:'Pedido no encontrado' });

    const estadoAnterior = pedido.estado;
    const joyaAnterior   = pedido.joya_id;
    const cantAnterior   = pedido.cantidad;

  // Validaciones si cambian admin o joya
    if (admin_id && !(await Usuario.findByPk(admin_id)))
      return res.status(404).json({ success:false, message:'Administrador no encontrado' });

    if (joya_id && !(await Joya.findById(joya_id)))
      return res.status(404).json({ success:false, message:'Joya nueva no encontrada' });

  // Actualizar campos 
    await pedido.update({ joya_id, cantidad, total, estado, admin_id });

    // Cambio de cantidad (misma joya)
    if (joya_id === joyaAnterior && cantidad && cantidad !== cantAnterior) {
      const dif = cantidad - cantAnterior;
      const tipoMov = dif > 0 ? 'venta' : 'ajuste';   // venta ↓, ajuste ↑
      await movimiento({
        joyaId: joya_id,
        tipo:   tipoMov,
        cantidad: Math.abs(dif),
        nota:   `Corrección pedido #${id}`
      });
    }

    //Cambio de joya
    if (joya_id && joya_id !== joyaAnterior) {
      // devuelve stock a joya anterior
      await movimiento({ joyaId: joyaAnterior, tipo:'ajuste', cantidad:cantAnterior,
                         nota:`Cambio pedido #${id}` });
      // descuenta stock a nueva joya
      await movimiento({ joyaId: joya_id, tipo:'venta',  cantidad:cantidad || cantAnterior,
                         nota:`Cambio pedido #${id}` });
    }

    // Correo si cambia estado 
    if (estado && estado !== estadoAnterior) {
      const joyaInfo  = await Joya.findById(pedido.joya_id);
      const adminInfo = await Usuario.findByPk(pedido.admin_id);
      await enviarCorreoActualizacionEstado(pedido, joyaInfo, adminInfo, estadoAnterior);
    }

    const pedidoActualizado = await Pedido.findByPk(id, {
      include:[{ model:Usuario, as:'Usuario', attributes:['id','nombre','email'] }]
    });

    res.json({ success:true, message:'Pedido actualizado', data:pedidoActualizado });

  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({ success:false, message:error.message });
  }
};

//Eliminar pedido
const eliminarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findByPk(id);
    if (!pedido) return res.status(404).json({ success:false, message:'Pedido no encontrado' });

    await pedido.destroy();

    // devolver stock
    await movimiento({
      joyaId:  pedido.joya_id,
      tipo:    'ajuste',
      cantidad: pedido.cantidad,
      nota:    `Anulación pedido #${id}`
    });

    res.json({ success:true, message:'Pedido eliminado' });

  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ success:false, message:error.message });
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


module.exports = {
  crearPedido,
  listarPedidos,
  obtenerPedidoPorId,
  actualizarPedido,
  eliminarPedido,
  obtenerPedidosPorEstado
};