export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: 'admin' | 'empleado' | 'cliente';
  creadoEn: string;
  actualizadoEn: string;
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
}

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  imagen?: string;
  categoria_id: number;
  activo: boolean;
  categoria?: Categoria;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface Cliente {
  id: number;
  usuario_id?: number;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  rtn?: string;
  genero?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface Venta {
  id: number;
  numero_pedido: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono?: string;
  direccion_entrega?: string;
  subtotal: number;
  impuesto: number;
  total: number;
  estado: 'pendiente' | 'confirmado' | 'en_proceso' | 'enviado' | 'entregado' | 'cancelado';
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia' | 'paypal';
  notas?: string;
  empleado_id?: number;
  empleado_nombre?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface LoginCredentials {
  correo: string;
  contrasena: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
} 