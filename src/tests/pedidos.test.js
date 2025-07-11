const request = require('supertest');
const app = require('../app');
const Venta = require('../modelos/Venta');
const Facturacion = require('../modelos/Facturacion');
const Producto = require('../modelos/Producto');
const Categoria = require('../modelos/Categoria');
const Caja = require('../modelos/Caja');

describe('Pedidos API', () => {
  let pedidoId;
  let productoId;
  let categoriaId;
  let token;

  beforeAll(async () => {
    // Limpiar base de datos de prueba
    await Caja.destroy({ where: {} });
    await Facturacion.destroy({ where: {} });
    await Venta.destroy({ where: {} });
    await Producto.destroy({ where: {} });
    await Categoria.destroy({ where: {} });

    // Crear categoría y producto de prueba
    const categoria = await Categoria.create({
      nombre: 'Anillos',
      descripcion: 'Categoría de anillos'
    });
    categoriaId = categoria.id;

    const producto = await Producto.create({
      codigo: 'ANILLO001',
      nombre: 'Anillo de Oro',
      descripcion: 'Hermoso anillo de oro 18k',
      precio: 1500.00,
      stock: 10,
      categoria_id: categoriaId
    });
    productoId = producto.id;
  });

  afterAll(async () => {
    await Caja.destroy({ where: {} });
    await Facturacion.destroy({ where: {} });
    await Venta.destroy({ where: {} });
    await Producto.destroy({ where: {} });
    await Categoria.destroy({ where: {} });
  });

  describe('GET /api/pedidos', () => {
    it('debería obtener todos los pedidos', async () => {
      const response = await request(app)
        .get('/api/pedidos')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('debería filtrar pedidos por estado', async () => {
      const response = await request(app)
        .get('/api/pedidos?estado=pendiente')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/pedidos', () => {
    it('debería crear un nuevo pedido', async () => {
      const nuevoPedido = {
        cliente_nombre: 'Juan Pérez',
        cliente_email: 'juan@example.com',
        cliente_telefono: '123456789',
        direccion_entrega: 'Calle Principal 123',
        productos: [
          {
            producto_id: productoId,
            cantidad: 2,
            descuento: 100.00
          }
        ],
        metodo_pago: 'efectivo',
        notas: 'Pedido de prueba'
      };

      const response = await request(app)
        .post('/api/pedidos')
        .send(nuevoPedido)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.numero_pedido).toBeDefined();
      expect(response.body.data.cliente_nombre).toBe(nuevoPedido.cliente_nombre);
      expect(response.body.data.detalles).toHaveLength(1);
      
      pedidoId = response.body.data.id;
    });

    it('debería rechazar pedido con stock insuficiente', async () => {
      const pedidoSinStock = {
        cliente_nombre: 'María García',
        cliente_email: 'maria@example.com',
        productos: [
          {
            producto_id: productoId,
            cantidad: 999, // Más del stock disponible
            descuento: 0
          }
        ],
        metodo_pago: 'efectivo'
      };

      const response = await request(app)
        .post('/api/pedidos')
        .send(pedidoSinStock)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Stock insuficiente');
    });

    it('debería rechazar pedido sin productos', async () => {
      const pedidoSinProductos = {
        cliente_nombre: 'Pedro López',
        cliente_email: 'pedro@example.com',
        productos: [],
        metodo_pago: 'efectivo'
      };

      const response = await request(app)
        .post('/api/pedidos')
        .send(pedidoSinProductos)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Debe incluir al menos un producto');
    });
  });

  describe('GET /api/pedidos/:id', () => {
    it('debería obtener un pedido por ID', async () => {
      const response = await request(app)
        .get(`/api/pedidos/${pedidoId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(pedidoId);
      expect(response.body.data.detalles).toBeDefined();
    });

    it('debería devolver 404 para pedido inexistente', async () => {
      const response = await request(app)
        .get('/api/pedidos/99999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/pedidos/:id/estado', () => {
    it('debería actualizar el estado del pedido', async () => {
      const nuevoEstado = 'confirmado';

      const response = await request(app)
        .patch(`/api/pedidos/${pedidoId}/estado`)
        .set('Authorization', `Bearer ${token}`)
        .send({ estado: nuevoEstado })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.estado).toBe(nuevoEstado);
    });

    it('debería rechazar estado no válido', async () => {
      const estadoInvalido = 'estado_invalido';

      const response = await request(app)
        .patch(`/api/pedidos/${pedidoId}/estado`)
        .set('Authorization', `Bearer ${token}`)
        .send({ estado: estadoInvalido })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Estado no válido');
    });

    it('debería restaurar stock al cancelar pedido', async () => {
      // Obtener stock actual
      const producto = await Producto.findByPk(productoId);
      const stockAntes = producto.stock;

      // Cancelar pedido
      const response = await request(app)
        .patch(`/api/pedidos/${pedidoId}/estado`)
        .set('Authorization', `Bearer ${token}`)
        .send({ estado: 'cancelado' })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verificar que el stock se restauró
      await producto.reload();
      expect(producto.stock).toBeGreaterThan(stockAntes);
    });
  });

  describe('DELETE /api/pedidos/:id', () => {
    it('debería eliminar un pedido cancelado', async () => {
      // Primero cancelar el pedido
      await request(app)
        .patch(`/api/pedidos/${pedidoId}/estado`)
        .set('Authorization', `Bearer ${token}`)
        .send({ estado: 'cancelado' });

      const response = await request(app)
        .delete(`/api/pedidos/${pedidoId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('debería rechazar eliminar pedido no cancelado', async () => {
      // Crear un nuevo pedido
      const nuevoPedido = {
        cliente_nombre: 'Ana López',
        cliente_email: 'ana@example.com',
        productos: [
          {
            producto_id: productoId,
            cantidad: 1,
            descuento: 0
          }
        ],
        metodo_pago: 'efectivo'
      };

      const pedido = await request(app)
        .post('/api/pedidos')
        .send(nuevoPedido)
        .expect(201);

      const response = await request(app)
        .delete(`/api/pedidos/${pedido.body.data.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Solo se pueden eliminar pedidos cancelados');
    });
  });
}); 