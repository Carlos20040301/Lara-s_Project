const request = require('supertest');
const app = require('../app');
const Producto = require('../modelos/Producto');
const Categoria = require('../modelos/Categoria');
const path = require('path');

describe('Productos API', () => {
  let productoId;
  let categoriaId;
  let token;

  beforeAll(async () => {
    // Limpiar base de datos de prueba
    await Producto.destroy({ where: {} });
    await Categoria.destroy({ where: {} });

    // Crear categoría de prueba
    const categoria = await Categoria.create({
      nombre: 'Anillos',
      descripcion: 'Categoría de anillos'
    });
    categoriaId = categoria.id;
  });

  afterAll(async () => {
    await Producto.destroy({ where: {} });
    await Categoria.destroy({ where: {} });
  });

  describe('GET /api/productos', () => {
    it('debería obtener todos los productos', async () => {
      const response = await request(app)
        .get('/api/productos')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('debería filtrar productos por categoría', async () => {
      const response = await request(app)
        .get(`/api/productos?categoria_id=${categoriaId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('debería buscar productos por nombre', async () => {
      const response = await request(app)
        .get('/api/productos?busqueda=anillo')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/productos', () => {
    it('debería crear un nuevo producto', async () => {
      const nuevoProducto = {
        codigo: 'ANILLO001',
        nombre: 'Anillo de Oro',
        descripcion: 'Hermoso anillo de oro 18k',
        precio: 1500.00,
        stock: 10,
        categoria_id: categoriaId
      };

      const response = await request(app)
        .post('/api/productos')
        .set('Authorization', `Bearer ${token}`)
        .send(nuevoProducto)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nombre).toBe(nuevoProducto.nombre);
      expect(response.body.data.codigo).toBe(nuevoProducto.codigo);
      
      productoId = response.body.data.id;
    });

    it('debería crear producto con imagen', async () => {
      const nuevoProducto = {
        codigo: 'ANILLO002',
        nombre: 'Anillo con Diamante',
        descripcion: 'Anillo con diamante natural',
        precio: 2500.00,
        stock: 5,
        categoria_id: categoriaId
      };

      const response = await request(app)
        .post('/api/productos')
        .set('Authorization', `Bearer ${token}`)
        .field('codigo', nuevoProducto.codigo)
        .field('nombre', nuevoProducto.nombre)
        .field('descripcion', nuevoProducto.descripcion)
        .field('precio', nuevoProducto.precio)
        .field('stock', nuevoProducto.stock)
        .field('categoria_id', nuevoProducto.categoria_id)
        .attach('imagen', path.join(__dirname, '../fixtures/test-image.jpg'))
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.imagen).toBeDefined();
    });

    it('debería rechazar crear producto con código duplicado', async () => {
      const productoDuplicado = {
        codigo: 'ANILLO001',
        nombre: 'Otro Anillo',
        precio: 1000.00,
        stock: 5,
        categoria_id: categoriaId
      };

      const response = await request(app)
        .post('/api/productos')
        .set('Authorization', `Bearer ${token}`)
        .send(productoDuplicado)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Ya existe un producto');
    });

    it('debería rechazar crear producto con categoría inexistente', async () => {
      const producto = {
        codigo: 'ANILLO003',
        nombre: 'Anillo Test',
        precio: 1000.00,
        stock: 5,
        categoria_id: 99999
      };

      const response = await request(app)
        .post('/api/productos')
        .set('Authorization', `Bearer ${token}`)
        .send(producto)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Categoría no válida');
    });
  });

  describe('GET /api/productos/:id', () => {
    it('debería obtener un producto por ID', async () => {
      const response = await request(app)
        .get(`/api/productos/${productoId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(productoId);
      expect(response.body.data.categoria).toBeDefined();
    });

    it('debería devolver 404 para producto inexistente', async () => {
      const response = await request(app)
        .get('/api/productos/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/productos/:id', () => {
    it('debería actualizar un producto', async () => {
      const actualizacion = {
        nombre: 'Anillo de Oro Actualizado',
        precio: 1600.00,
        stock: 15
      };

      const response = await request(app)
        .put(`/api/productos/${productoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(actualizacion)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nombre).toBe(actualizacion.nombre);
      expect(response.body.data.precio).toBe(actualizacion.precio);
    });
  });

  describe('PATCH /api/productos/:id/stock', () => {
    it('debería actualizar el stock de un producto', async () => {
      const nuevoStock = 20;

      const response = await request(app)
        .patch(`/api/productos/${productoId}/stock`)
        .set('Authorization', `Bearer ${token}`)
        .send({ stock: nuevoStock })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.stock).toBe(nuevoStock);
    });
  });

  describe('DELETE /api/productos/:id', () => {
    it('debería eliminar un producto', async () => {
      const response = await request(app)
        .delete(`/api/productos/${productoId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
}); 