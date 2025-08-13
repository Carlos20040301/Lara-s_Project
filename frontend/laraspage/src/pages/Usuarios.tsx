import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import { Usuario } from '../types';
import CrearUsuarioModal from '../components/modals/CrearUsuarioModal';
// Si tienes un modal de edición diferente, cámbialo aquí
// import EditarUsuarioModal from '../components/EditarUsuarioModal';
import Navbar from '../components/layout/Navbar';

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCrearUsuario, setShowCrearUsuario] = useState(false);
  const [showEditarUsuario, setShowEditarUsuario] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState<any>(null);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await authService.getAllUsuarios();
      // Permitir tanto data como data.usuarios, y mapear id/_id
      let usuariosArray = Array.isArray(data)
        ? data
        : Array.isArray(data.usuarios)
        ? data.usuarios
        : Array.isArray(data.data)
        ? data.data
        : [];
      // Normalizar id para que siempre exista
      usuariosArray = usuariosArray.map((u: any) => ({
        ...u,
        id: u._id || u.id
      }));
      setUsuarios(usuariosArray);
    } catch (err: any) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [showCrearUsuario]);

  const handleEliminarUsuario = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    setLoading(true);
    setError('');
    try {
      await authService.deleteUsuario(id);
      setUsuarios(usuarios.filter((u) => String(u.id) !== String(id) && String((u as any)._id) !== String(id)));
    } catch (err: any) {
      // Si el backend responde con un mensaje específico, mostrarlo de forma amigable
      if (err?.response?.data?.mensaje) {
        let msg = err.response.data.mensaje;
        if (
          msg.toLowerCase().includes('foreign key constraint fails') ||
          msg.toLowerCase().includes('clave foránea') ||
          msg.toLowerCase().includes('vinculado') ||
          msg.toLowerCase().includes('asociad')
        ) {
          setError('No se puede eliminar este usuario porque está relacionado con otros datos importantes del sistema (por ejemplo, recuperaciones de contraseña, ventas, pedidos, etc). Elimina primero esos registros asociados.');
        } else {
          setError('No se puede eliminar este usuario: ' + msg);
        }
      } else {
        setError('Error al eliminar usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 32 }}>
        <h1>Gestión de Usuarios Internos</h1>
        <button onClick={() => setShowCrearUsuario(true)} style={{ marginBottom: 24, padding: '10px 24px', borderRadius: 8, background: '#bfa14a', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}>
          Crear Usuario
        </button>
        {loading && <div>Cargando usuarios...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <table style={{ width: '100%', marginTop: 12, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Nombre</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Correo</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Rol</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u: any) => {
              // Mostrar el id correspondiente según el rol
              let displayId = '';
              if (u.rol === 'empleado' && u.id_empleado) {
                displayId = u.id_empleado;
              } else if (u.rol === 'cliente' && u.id_cliente) {
                displayId = u.id_cliente;
              } else {
                displayId = u.id || u._id;
              }
              return (
                <tr key={displayId}>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{displayId}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{u.primerNombre || ''} {u.primerApellido || ''}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{u.correo}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{u.rol}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd', display: 'flex', gap: 8 }}>
                    <button style={{ color: 'white', background: '#bfa14a', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}
                      onClick={() => { setUsuarioEditar(u); setShowEditarUsuario(true); }}>
                      Editar
                    </button>
                    <button style={{ color: 'white', background: '#c00', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }} onClick={() => handleEliminarUsuario(u.id || u._id)}>Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <CrearUsuarioModal isOpen={showCrearUsuario} onClose={() => setShowCrearUsuario(false)} onSuccess={cargarUsuarios} />
      {/* Modal de edición, puedes reemplazarlo por tu propio modal si tienes uno */}
      {showEditarUsuario && (
        <CrearUsuarioModal
          isOpen={showEditarUsuario}
          onClose={() => { setShowEditarUsuario(false); setUsuarioEditar(null); }}
          onSuccess={() => { setShowEditarUsuario(false); setUsuarioEditar(null); cargarUsuarios(); }}
          usuario={usuarioEditar}
          modoEdicion={true}
        />
      )}
    </div>
  );
};

export default Usuarios;
