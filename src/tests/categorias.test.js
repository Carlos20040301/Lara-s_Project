const request = require('supertest');
const app = require('../app');
const Categoria = require('../modelos/Categoria');
const Producto = require('../modelos/Producto');

describe('Categorías API', () => {
  let categoriaId;
  let token;

  beforeAll(async () => {
    // Limpiar base de datos de prueba
    await Producto.destroy({ where: {} });
    await Categoria.destroy({ where: {} });
  });

  afterAll(async () => {
    await Producto.destroy({ where: {} });
    await Categoria.destroy({ where: {} });
  });

  describe('GET /api/categorias', () => {
    it('debería obtener todas las categorías', async () => {
      const response = await request(app)
        .get('/api/categorias')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/categorias', () => {
    it('debería crear una nueva categoría', async () => {
      const nuevaCategoria = {
        nombre: 'Anillos',
        descripcion: 'Categoría de anillos de joyería'
      };

      const response = await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${token}`)
        .send(nuevaCategoria)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nombre).toBe(nuevaCategoria.nombre);
      expect(response.body.data.descripcion).toBe(nuevaCategoria.descripcion);
      
      categoriaId = response.body.data.id;
    });

    it('debería rechazar crear categoría con nombre duplicado', async () => {
      const categoriaDuplicada = {
        nombre: 'Anillos',
        descripcion: 'Otra descripción'
      };

      const response = await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${token}`)
        .send(categoriaDuplicada)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Ya existe una categoría');
    });
  });

  describe('GET /api/categorias/:id', () => {
    it('debería obtener una categoría por ID', async () => {
      const response = await request(app)
        .get(`/api/categorias/${categoriaId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(categoriaId);
      expect(response.body.data.nombre).toBe('Anillos');
    });

    it('debería devolver 404 para categoría inexistente', async () => {
      const response = await request(app)
        .get('/api/categorias/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/categorias/:id', () => {
    it('debería actualizar una categoría', async () => {
      const actualizacion = {
        nombre: 'Anillos de Oro',
        descripcion: 'Categoría actualizada de anillos'
      };

      const response = await request(app)
        .put(`/api/categorias/${categoriaId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(actualizacion)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nombre).toBe(actualizacion.nombre);
      expect(response.body.data.descripcion).toBe(actualizacion.descripcion);
    });
  });

  describe('DELETE /api/categorias/:id', () => {
    it('debería eliminar una categoría sin productos', async () => {
      const response = await request(app)
        .delete(`/api/categorias/${categoriaId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('debería rechazar eliminar categoría con productos', async () => {
      // Crear una categoría
      const categoria = await Categoria.create({
        nombre: 'Collares',
        descripcion: 'Categoría de collares'
      });

      // Crear un producto asociado
      await Producto.create({
        codigo: 'TEST001',
        nombre: 'Collar de Prueba',
        precio: 100.00,
        stock: 5,
        categoria_id: categoria.id
      });

      const response = await request(app)
        .delete(`/api/categorias/${categoria.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('producto(s) asociado(s)');
    });
  });
}); 