import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Usuario } from '../types';
import { authService } from '../services/api';

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
  top: 12px;
  right: 16px;
  background: #fffbe6;
  border: 2px solid #b8860b;
  color: #b8860b;
  font-size: 32px;
  font-weight: bold;
  border-radius: 50%;
  width: 40px;
  height: 40px;
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
  usuario: Usuario | null;
  onSuccess?: () => void;
}

const EditarUsuarioModal: React.FC<Props> = ({ isOpen, onClose, usuario, onSuccess }) => {
  const [form, setForm] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    genero: '',
    correo: '',
    rol: '',
    telefono: '',
    cargo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (usuario) {
      setForm({
        primerNombre: usuario.primerNombre || '',
        segundoNombre: usuario.segundoNombre || '',
        primerApellido: usuario.primerApellido || '',
        segundoApellido: usuario.segundoApellido || '',
        genero: usuario.genero || '',
        correo: usuario.correo || '',
        rol: usuario.rol || '',
        telefono: usuario.telefono || '',
        cargo: usuario.cargo || '',
      });
    }
  }, [usuario]);

  if (!isOpen || !usuario) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      // Validar campos obligatorios
      if (form.rol === 'empleado' && (!form.telefono || !form.cargo)) {
        setError('El teléfono y el cargo son obligatorios para empleados.');
        setLoading(false);
        return;
      }
      await authService.updateUsuario(usuario.id, form);
      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.response?.data?.mensaje || 'Error al actualizar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseBtn onClick={onClose}>&times;</CloseBtn>
        <Title>Editar Usuario</Title>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        {success && <div style={{color: 'green', textAlign: 'center'}}>Usuario actualizado correctamente</div>}
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
          <Input name="correo" type="email" placeholder="Correo" value={form.correo} onChange={handleChange} required />
          <Select name="rol" value={form.rol} onChange={handleChange} required>
            <option value="admin">Administrador</option>
            <option value="empleado">Empleado</option>
            <option value="cliente">Cliente</option>
          </Select>
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
          <Button type="submit" disabled={loading}>{loading ? 'Actualizando...' : 'Actualizar Usuario'}</Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditarUsuarioModal;
