
import axios from 'axios';
import { LoginCredentials, AuthResponse, Producto, Cliente, Venta, Categoria } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Eliminar venta usando query param, como espera el backend
const deleteByQuery = async (id: number): Promise<void> => {
  await api.delete(`/pedido/eliminar?id=${id}`);
};

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Actualizar usuario por id (solo para admin)
  updateUsuario: async (id: number, data: any) => {
    const response = await api.put(`/usuario/actualizar?id=${id}`, data);
    return response.data;
  },
  // Obtener todos los usuarios desde MongoDB (solo para admin)
  getAllUsuariosMongo: async () => {
    const response = await api.get('/usuario-mongo/listar-mongo');
    return response.data;
  },
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/autenticacion/iniciar-sesion', credentials);
    return response.data;
  },

  register: async (usuario: any) => {
    const response = await api.post('/autenticacion/registro', usuario);
    return response.data;
  },


  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  // Obtener todos los usuarios (solo para admin)
  getAllUsuarios: async () => {
    const response = await api.get('/usuario/listar');
    return response.data;
  },

  // Eliminar usuario por id (solo para admin)
  deleteUsuario: async (id: string) => {
    const response = await api.delete(`/usuario/eliminar?id=${id}`);
    return response.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  },
  // ...otros métodos...
  deleteByQuery,
};

// Servicios de productos
export const productoService = {
  getAll: async (): Promise<Producto[]> => {
    const response = await api.get('/producto/listar');
    return response.data.data || response.data;
  },

  getById: async (id: number): Promise<Producto> => {
    const response = await api.get(`/producto/${id}`);
    return response.data.data || response.data;
  },

  create: async (producto: FormData): Promise<Producto> => {
    const response = await api.post('/producto/guardar', producto, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data || response.data;
  },

  update: async (id: number, producto: FormData): Promise<Producto> => {
    const response = await api.put(`/producto/actualizar?id=${id}`, producto, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data || response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/producto/eliminar?id=${id}`);
  },

  updateStock: async (id: number, stock: number): Promise<Producto> => {
    const response = await api.patch(`/producto/${id}/stock`, { stock });
    return response.data.data || response.data;
  },
};

// Servicios de categorías
export const categoriaService = {
  getAll: async (): Promise<Categoria[]> => {
    // Usar el endpoint correcto y devolver el array de categorias desde 'data'
    const response = await api.get('/categoria/listar');
    return response.data.data || [];
  },

  create: async (categoria: Partial<Categoria>): Promise<Categoria> => {
    const response = await api.post('/categoria/guardar', categoria);
    return response.data.data || response.data;
  },
};

// Servicios de clientes
export const clienteService = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await api.get('/cliente/listar');
    return response.data.data || response.data;
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await api.get(`/cliente/${id}`);
    return response.data.data || response.data;
  },

  create: async (cliente: Partial<Cliente>): Promise<Cliente> => {
    const response = await api.post('/cliente/guardar', cliente);
    return response.data.data || response.data;
  },

  update: async (id: number, cliente: Partial<Cliente>): Promise<Cliente> => {
    const response = await api.put(`/cliente/editar?id=${id}`, cliente);
    return response.data.data || response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/cliente/eliminar?id=${id}`);
  },

  createWithUsuario: async (cliente: Partial<Cliente>): Promise<Cliente> => {
    const response = await api.post('/cliente/crear-con-usuario', cliente);
    return response.data.data || response.data;
  },
};

// Servicios de ventas
export const ventaService = {
  getAll: async (): Promise<Venta[]> => {
    const response = await api.get('/pedido/listar');
    return response.data.data || response.data;
  },

  getById: async (id: number): Promise<Venta> => {
    const response = await api.get(`/pedido/${id}`);
    return response.data.data || response.data;
  },

  create: async (venta: Partial<Venta>): Promise<Venta> => {
    // Validación previa de campos requeridos
    const requiredFields = [
      'cliente_nombre',
      'cliente_email',
      'cliente_telefono',
      'direccion_entrega',
      'metodo_pago',
      'productos'
    ];
    for (const field of requiredFields) {
      if (!(field in venta) || (field !== 'productos' && !venta[field as keyof typeof venta])) {
        throw new Error(`El campo '${field}' es obligatorio y debe estar correctamente definido.`);
      }
    }
    // Validar productos solo si existe y es array
    if (!Array.isArray((venta as any).productos) || ((venta as any).productos.length === 0)) {
      throw new Error("El campo 'productos' es obligatorio y debe ser un array con al menos un producto.");
    }
    for (const producto of (venta as any).productos) {
      if (!producto.producto_id || !producto.cantidad) {
        throw new Error('Cada producto debe tener producto_id y cantidad.');
      }
    }
    const response = await api.post('/pedido/guardar', venta);
    return response.data.data || response.data;
  },

  update: async (id: number, venta: Partial<Venta>): Promise<Venta> => {
    const response = await api.put(`/pedido/${id}`, venta);
    return response.data.data || response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/pedido/${id}`);
  },

  updateStatus: async (id: number, estado: Venta['estado']): Promise<Venta> => {
    const response = await api.patch(`/pedido/actualizarEstado?id=${id}`, { estado });
    return response.data.data || response.data;
  },
  deleteByQuery,
};

export default api; 