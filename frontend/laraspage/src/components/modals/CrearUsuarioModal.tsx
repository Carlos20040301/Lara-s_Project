import React, { useState } from 'react';
import styled from 'styled-components';
import { Usuario } from '../../types';
import { authService } from '../../services/api';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  position: relative; 
`;

const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 0;
  border-radius: 8px;
  border: none;
  background: var(--primary-gold, #bfa14a);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
  &:hover {
    background: var(--dark-gold, #a68a2d);
  }
`;

const ErrorMsg = styled.div`
  color: #c00;
  text-align: center;
  margin-bottom: 8px;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #fffbe6;
  border: 2px solid #b8860b;
  color: #b8860b;
  font-size: 28px;
  font-weight: bold;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px #f5e4bc55;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
  z-index: 10;
  &:hover {
    background: #b8860b;
    color: #fffbe6;
    border: 2px solid #a68a2d;
  }
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  usuario?: any;
  modoEdicion?: boolean;
}


//Componentes
const CrearUsuarioModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, usuario, modoEdicion }) => {
  const [form, setForm] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    genero: '',
    correo: '',
    contrasena: '',
    rol: 'empleado',
    telefono: '',
    cargo: '',
    id: '', // Para edición
    _id: '', // Para edición si aplica
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (modoEdicion && usuario) {
      setForm({
        primerNombre: usuario.primerNombre || '',
        segundoNombre: usuario.segundoNombre || '',
        primerApellido: usuario.primerApellido || '',
        segundoApellido: usuario.segundoApellido || '',
        genero: usuario.genero || '',
        correo: usuario.correo || '',
        contrasena: '', // No se muestra la contraseña actual
        rol: usuario.rol || 'empleado',
        telefono: usuario.telefono || '',
        cargo: usuario.cargo || '',
        id: usuario.id || usuario._id || '',
        _id: usuario._id || usuario.id || '',
      });
    } else if (!modoEdicion) {
      setForm({
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        genero: '',
        correo: '',
        contrasena: '',
        rol: 'empleado',
        telefono: '',
        cargo: '',
        id: '',
        _id: '',
      });
    }
  }, [usuario, modoEdicion, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const rolesEmpleado = ['empleado', 'cajero', 'gerente', 'vendedor'];
      if (rolesEmpleado.includes(form.rol)) {
        if (!form.telefono || !form.cargo) {
          setError('El teléfono y el cargo son obligatorios para empleados.');
          setLoading(false);
          return;
        }
      }
      if (modoEdicion && usuario) {
        // Actualizar usuario existente, asegurando que el id se envía correctamente
        const idToSend = usuario.id || usuario._id || form.id || form._id;
        const formToSend = { ...form };
        // Elimina campos vacíos innecesarios
        if (!formToSend.contrasena) delete (formToSend as any).contrasena;
        // Elimina id duplicado si el backend solo espera uno
        if (formToSend._id && formToSend.id && formToSend._id === formToSend.id) delete (formToSend as any)._id;
        await authService.updateUsuario(idToSend, formToSend);
        setSuccess(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1200);
      } else {
        // Crear usuario nuevo
        await authService.register(form);
        setSuccess(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setError(err?.response?.data?.mensaje || (modoEdicion ? 'Error al actualizar usuario' : 'Error al crear usuario'));
    } finally {
      setLoading(false);
    }
  };

  return (
     <ModalOverlay>
    <ModalContent>
      <CloseBtn onClick={onClose} aria-label="Cerrar">&times;</CloseBtn>
      <Title>{modoEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</Title>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {success && <div style={{color: 'green', textAlign: 'center'}}>Usuario creado correctamente</div>}
      <Form onSubmit={handleSubmit}>
          <Input name="primerNombre" placeholder="Primer Nombre" value={form.primerNombre} onChange={handleChange} required />
          <Input name="segundoNombre" placeholder="Segundo Nombre" value={form.segundoNombre} onChange={handleChange} />
          <Input name="primerApellido" placeholder="Primer Apellido" value={form.primerApellido} onChange={handleChange} required />
          <Input name="segundoApellido" placeholder="Segundo Apellido" value={form.segundoApellido} onChange={handleChange} />
          <Select name="genero" value={form.genero} onChange={handleChange} required>
            <option value="">Género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </Select>
          <Input name="correo" type="email" placeholder="Correo" value={form.correo} onChange={handleChange} required disabled={!!modoEdicion} />
          <Input name="contrasena" type="password" placeholder={modoEdicion ? 'Nueva contraseña (opcional)' : 'Contraseña'} value={form.contrasena} onChange={handleChange} required={!modoEdicion} />
          <Select name="rol" value={form.rol} onChange={handleChange} required disabled={!!modoEdicion}>
            <option value="admin">Administrador</option>
            <option value="empleado">Empleado</option>
            <option value="cliente">Cliente</option>
          </Select>
          {/* Mostrar campos de teléfono y cargo solo si es empleado */}
          {form.rol === 'empleado' && (
            <>
              <Input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} required />
              <Select name="cargo" value={form.cargo} onChange={handleChange} required>
                <option value="">Seleccionar cargo</option>
                <option value="cajero">Cajero</option>
                <option value="vendedor">Vendedor</option>
                <option value="gerente">Gerente</option>
                <option value="otro">Otro</option>
              </Select>
            </>
          )}
          <Button type="submit" disabled={loading}>{loading ? (modoEdicion ? 'Actualizando...' : 'Creando...') : (modoEdicion ? 'Actualizar Usuario' : 'Crear Usuario')}</Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CrearUsuarioModal;
