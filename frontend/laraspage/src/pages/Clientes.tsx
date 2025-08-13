import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../components/layout/Navbar';
import { clienteService } from '../services/api';
import { Cliente } from '../types';
import { 
  Button, 
  ActionButton, 
  ModalOverlay, 
  ModalContent, 
  ModalTitle, 
  CloseButton, 
  FormGroup, 
  FormGroupFull,
  Label, 
  Input, 
  Select, 
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableHeaderCell,
  LoadingMessage
} from '../components/ui/BaseComponents';
import { authService } from '../services/api';

const ClientesContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
    margin-bottom: 20px;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: var(--text-dark);

  @media (max-width: 768px) {
    font-size: 24px;
    text-align: center;
  }
`;

const AddButton = styled(Button)``;

const ClientsTable = styled(Table)`
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const SubmitButton = styled(Button)`
  grid-column: 1 / -1;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--text-light);
  font-size: 18px;
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editClientId, setEditClientId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    rtn: '',
    genero: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const data = await clienteService.getAll();
      setClientes(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditClientId(cliente.id);
    setFormData({
      primerNombre: cliente.primerNombre,
      segundoNombre: cliente.segundoNombre || '',
      primerApellido: cliente.primerApellido,
      segundoApellido: cliente.segundoApellido || '',
      rtn: cliente.rtn || '',
      genero: cliente.genero || '',
      telefono: cliente.telefono || '',
      email: cliente.email || '',
      direccion: cliente.direccion || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editClientId) {
        // Editar cliente y usuario
        await clienteService.update(editClientId, formData);
        setEditClientId(null);
      } else {
        // Crear cliente y usuario en un solo paso
        await clienteService.createWithUsuario(formData);
      }
      setShowModal(false);
      setFormData({
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        rtn: '',
        genero: '',
        telefono: '',
        email: '',
        direccion: ''
      });
      loadClientes();
    } catch (error: any) {
      console.error('Error creando/editando cliente:', error);
      if (error.response && error.response.data) {
        console.error('Detalles del error:', error.response.data);
        alert(JSON.stringify(error.response.data, null, 2));
      } else {
        alert('Error desconocido al crear/editar cliente');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await clienteService.delete(id);
        loadClientes();
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  if (loading) {
    return (
      <ClientesContainer>
        <Navbar />
        <LoadingMessage>Cargando clientes...</LoadingMessage>
      </ClientesContainer>
    );
  }

  return (
    <ClientesContainer>
      <Navbar />
      <MainContent>
        <Header>
          <Title>Gestión de Clientes</Title>
          <AddButton onClick={() => setShowModal(true)}>
            + Registrar Nuevo Cliente
          </AddButton>
        </Header>

        {clientes.length === 0 ? (
          <EmptyMessage>
            No hay clientes registrados. ¡Agrega tu primer cliente!
          </EmptyMessage>
        ) : (
          <ClientsTable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Nombre Completo</TableHeaderCell>
                <TableHeaderCell>RTN</TableHeaderCell>
                <TableHeaderCell>Teléfono</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Acciones</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>
                    {`${cliente.primerNombre || ''} ${cliente.segundoNombre || ''} ${cliente.primerApellido || ''} ${cliente.segundoApellido || ''}`.trim()}
                  </TableCell>
                  <TableCell>{cliente.rtn || 'N/A'}</TableCell>
                  <TableCell>{cliente.telefono || 'N/A'}</TableCell>
                  <TableCell>{cliente.email || 'N/A'}</TableCell>
                  <TableCell>
                    <ActionButton variant="edit" onClick={() => handleEdit(cliente)}>Editar</ActionButton>
                    <ActionButton 
                      variant="delete" 
                      onClick={() => handleDelete(cliente.id)}
                    >
                      Eliminar
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </ClientsTable>
        )}

        {showModal && (
          <ModalOverlay onClick={() => setShowModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={() => { setShowModal(false); setEditClientId(null); }}>×</CloseButton>
              <ModalTitle>{editClientId ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</ModalTitle>
              
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Primer Nombre *</Label>
                  <Input
                    type="text"
                    value={formData.primerNombre}
                    onChange={(e) => setFormData({...formData, primerNombre: e.target.value})}
                    placeholder="Ej: María"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Segundo Nombre</Label>
                  <Input
                    type="text"
                    value={formData.segundoNombre}
                    onChange={(e) => setFormData({...formData, segundoNombre: e.target.value})}
                    placeholder="Ej: Elena"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Primer Apellido *</Label>
                  <Input
                    type="text"
                    value={formData.primerApellido}
                    onChange={(e) => setFormData({...formData, primerApellido: e.target.value})}
                    placeholder="Ej: González"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Segundo Apellido</Label>
                  <Input
                    type="text"
                    value={formData.segundoApellido}
                    onChange={(e) => setFormData({...formData, segundoApellido: e.target.value})}
                    placeholder="Ej: Rodríguez"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>RTN (Opcional)</Label>
                  <Input
                    type="text"
                    value={formData.rtn}
                    onChange={(e) => setFormData({...formData, rtn: e.target.value})}
                    placeholder="08011990123456"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Género</Label>
                  <Select
                    name="genero"
                    value={formData.genero}
                    onChange={e => setFormData({ ...formData, genero: e.target.value })}
                    required
                  >
                    <option value="">Selecciona género</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Teléfono</Label>
                  <Input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    placeholder="+57 300 123 4567"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="cliente@email.com"
                  />
                </FormGroup>

                <FormGroupFull>
                  <Label>Dirección</Label>
                  <Input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    placeholder="Dirección completa"
                  />
                </FormGroupFull>

                <SubmitButton type="submit">{editClientId ? 'Guardar Cambios' : 'Registrar Cliente'}</SubmitButton>
              </Form>
            </ModalContent>
          </ModalOverlay>
        )}
      </MainContent>
    </ClientesContainer>
  );
};

export default Clientes; 