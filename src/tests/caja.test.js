const request = require('supertest');
const app = require('../app');
const Caja = require('../modelos/Caja');
const Venta = require('../modelos/Venta');

describe('Caja API', () => {
  let movimientoId;
  let ventaId;
  let token;

  beforeAll(async () => {
    // Limpiar base de datos de prueba
    await Caja.destroy({ where: {} });
    await Venta.destroy({ where: {} });

    // Crear venta de prueba
    const venta = await Venta.create({
      numero_pedido: 'TEST001',
      cliente_nombre: 'Cliente Test',
      cliente_email: 'test@example.com',
      subtotal: 1000.00,
      impuesto: 160.00,
      total: 1160.00,
      metodo_pago: 'efectivo'
    });
    ventaId = venta.id;
  });

  afterAll(async () => {
    await Caja.destroy({ where: {} });
    await Venta.destroy({ where: {} });
  });

  describe('GET /api/caja', () => {
    it('debería obtener todos los movimientos', async () => {
      const response = await request(app)
        .get('/api/caja')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.movimientos)).toBe(true);
      expect(response.body.data.resumen).toBeDefined();
    });

    it('debería filtrar movimientos por tipo', async () => {
      const response = await request(app)
        .get('/api/caja?tipo=ingreso')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('debería filtrar movimientos por fecha', async () => {
      const fechaInicio = new Date().toISOString().split('T')[0];
      const fechaFin = new Date().toISOString().split('T')[0];

      const response = await request(app)
        .get(`/api/caja?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/caja', () => {
    it('debería crear un nuevo ingreso', async () => {
      const nuevoIngreso = {
        tipo: 'ingreso',
        concepto: 'Venta de prueba',
        monto: 500.00,
        metodo_pago: 'efectivo',
        referencia: 'REF001',
        notas: 'Ingreso de prueba'
      };

      const response = await request(app)
        .post('/api/caja')
        .set('Authorization', `Bearer ${token}`)
        .send(nuevoIngreso)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tipo).toBe('ingreso');
      expect(response.body.data.monto).toBe(500.00);
      
      movimientoId = response.body.data.id;
    });

    it('debería crear un nuevo egreso', async () => {
      const nuevoEgreso = {
        tipo: 'egreso',
        concepto: 'Compra de materiales',
        monto: 200.00,
        metodo_pago: 'transferencia',
        referencia: 'REF002',
        notas: 'Egreso de prueba'
      };

      const response = await request(app)
        .post('/api/caja')
        .set('Authorization', `Bearer ${token}`)
        .send(nuevoEgreso)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tipo).toBe('egreso');
      expect(response.body.data.monto).toBe(200.00);
    });

    it('debería crear ingreso relacionado con venta', async () => {
      const ingresoVenta = {
        tipo: 'ingreso',
        concepto: 'Venta relacionada',
        monto: 1160.00,
        metodo_pago: 'efectivo',
        venta_id: ventaId,
        notas: 'Ingreso de venta'
      };

      const response = await request(app)
        .post('/api/caja')
        .set('Authorization', `Bearer ${token}`)
        .send(ingresoVenta)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.venta_id).toBe(ventaId);
    });

    it('debería rechazar tipo no válido', async () => {
      const movimientoInvalido = {
        tipo: 'tipo_invalido',
        concepto: 'Concepto inválido',
        monto: 100.00,
        metodo_pago: 'efectivo'
      };

      const response = await request(app)
        .post('/api/caja')
        .set('Authorization', `Bearer ${token}`)
        .send(movimientoInvalido)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Tipo debe ser');
    });

    it('debería rechazar monto inválido', async () => {
      const movimientoSinMonto = {
        tipo: 'ingreso',
        concepto: 'Sin monto',
        monto: 0,
        metodo_pago: 'efectivo'
      };

      const response = await request(app)
        .post('/api/caja')
        .set('Authorization', `Bearer ${token}`)
        .send(movimientoSinMonto)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Monto debe ser mayor a 0');
    });
  });

  describe('GET /api/caja/:id', () => {
    it('debería obtener un movimiento por ID', async () => {
      const response = await request(app)
        .get(`/api/caja/${movimientoId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(movimientoId);
    });

    it('debería devolver 404 para movimiento inexistente', async () => {
      const response = await request(app)
        .get('/api/caja/99999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/caja/:id', () => {
    it('debería actualizar un movimiento', async () => {
      const actualizacion = {
        concepto: 'Concepto actualizado',
        monto: 600.00,
        notas: 'Notas actualizadas'
      };

      const response = await request(app)
        .put(`/api/caja/${movimientoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(actualizacion)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.concepto).toBe(actualizacion.concepto);
      expect(response.body.data.monto).toBe(600.00);
    });

    it('debería rechazar cambiar el tipo', async () => {
      const actualizacionTipo = {
        tipo: 'egreso',
        concepto: 'Cambio de tipo'
      };

      const response = await request(app)
        .put(`/api/caja/${movimientoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(actualizacionTipo)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No se puede cambiar el tipo');
    });
  });

  describe('GET /api/caja/resumen', () => {
    it('debería obtener resumen de caja', async () => {
      const response = await request(app)
        .get('/api/caja/resumen')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalIngresos).toBeDefined();
      expect(response.body.data.totalEgresos).toBeDefined();
      expect(response.body.data.balance).toBeDefined();
      expect(response.body.data.porMetodoPago).toBeDefined();
    });
  });

  describe('DELETE /api/caja/:id', () => {
    it('debería eliminar un movimiento sin venta relacionada', async () => {
      // Crear un movimiento sin venta
      const movimiento = await Caja.create({
        tipo: 'egreso',
        concepto: 'Egreso para eliminar',
        monto: 50.00,
        metodo_pago: 'efectivo'
      });

      const response = await request(app)
        .delete(`/api/caja/${movimiento.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('debería rechazar eliminar movimiento con venta relacionada', async () => {
      // Buscar un movimiento con venta relacionada
      const movimientoConVenta = await Caja.findOne({
        where: { venta_id: { [require('sequelize').Op.ne]: null } }
      });

      if (movimientoConVenta) {
        const response = await request(app)
          .delete(`/api/caja/${movimientoConVenta.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('No se puede eliminar un movimiento relacionado con una venta');
      }
    });
  });
}); 