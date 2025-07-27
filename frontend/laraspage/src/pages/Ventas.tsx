import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { ventaService, clienteService, productoService } from '../services/api';
import { Venta, Cliente, Producto } from '../types';
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
  StatusBadge
} from '../components/ui/BaseComponents';
import { useAuth } from '../context/AuthContext';

const VentasContainer = styled.div`
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

const SalesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const SalesCard = styled.div`
  background: var(--white);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 10px;
  }
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const SalesTable = styled(Table)``;

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

const Ventas: React.FC = () => {
  const { user } = useAuth();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: '',
    cliente_nombre: '',
    cliente_email: '',
    cliente_telefono: '',
    direccion_entrega: '',
    metodo_pago: '',
    notas: '',
    productosVenta: [] as any[],
    productoSeleccionado: '',
    cantidadSeleccionada: 1,
    subtotal: '',
    impuesto: '',
    total: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ventasData, clientesData, productosData] = await Promise.all([
        ventaService.getAll(),
        clienteService.getAll(),
        productoService.getAll()
      ]);
      setVentas(ventasData);
      setClientes(clientesData);
      setProductosDisponibles(productosData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular subtotal, impuesto y total automáticamente
  useEffect(() => {
    const subtotal = formData.productosVenta.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
    const impuesto = +(subtotal * 0.12).toFixed(2);
    const total = +(subtotal + impuesto).toFixed(2);
    setFormData(f => ({
      ...f,
      subtotal: subtotal.toFixed(2),
      impuesto: impuesto.toFixed(2),
      total: total.toFixed(2)
    }));
  }, [formData.productosVenta]);

  const handleAgregarProducto = () => {
    if (formData.productoSeleccionado && formData.cantidadSeleccionada > 0) {
      const producto = productosDisponibles.find(p => p.id === parseInt(formData.productoSeleccionado));
      if (producto) {
        setFormData({
          ...formData,
          productosVenta: [
            ...formData.productosVenta,
            {
              producto_id: producto.id,
              nombre: producto.nombre,
              cantidad: formData.cantidadSeleccionada,
              precio: producto.precio
            }
          ],
          productoSeleccionado: '',
          cantidadSeleccionada: 1
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Solo valores válidos para método de pago
      const metodoPagoValido = ['efectivo', 'tarjeta', 'transferencia'].includes(formData.metodo_pago)
        ? formData.metodo_pago
        : 'efectivo';
      // Solo los campos requeridos en productos
      const productos = formData.productosVenta.map((p: any) => ({
        producto_id: p.producto_id,
        cantidad: p.cantidad,
        descuento: p.descuento || 0
      }));
      const ventaData: Partial<Venta> = {
        cliente_nombre: formData.cliente_nombre,
        cliente_email: formData.cliente_email,
        cliente_telefono: formData.cliente_telefono,
        direccion_entrega: formData.direccion_entrega,
        metodo_pago: metodoPagoValido as 'efectivo' | 'tarjeta' | 'transferencia' | 'paypal',
        notas: formData.notas,
        productos,
        subtotal: parseFloat(formData.subtotal),
        impuesto: parseFloat(formData.impuesto),
        total: parseFloat(formData.total)
      };
      if (user?.id !== undefined && user?.rol === 'empleado') {
        (ventaData as any).empleado_id = user.id;
      }
      const response = await ventaService.create(ventaData);
      setShowModal(false);
      setFormData({
        clienteId: '',
        cliente_nombre: '',
        cliente_email: '',
        cliente_telefono: '',
        direccion_entrega: '',
        metodo_pago: '',
        notas: '',
        productosVenta: [],
        productoSeleccionado: '',
        cantidadSeleccionada: 1,
        subtotal: '',
        impuesto: '',
        total: ''
      });
      loadData();
      if (response && response.numero_pedido) {
        alert(`Venta creada. Número de pedido: ${response.numero_pedido}`);
      }
    } catch (error: any) {
      console.error('Error creating sale:', error);
      if (error.response && error.response.data) {
        console.error('Detalles del error:', error.response.data);
        alert(JSON.stringify(error.response.data, null, 2));
      } else {
        alert('Error desconocido al crear la venta');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
      try {
        await ventaService.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting sale:', error);
      }
    }
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(formData.subtotal) || 0;
    const impuesto = parseFloat(formData.impuesto) || 0;
    return (subtotal + impuesto).toFixed(2);
  };

  const totalCalculado = calculateTotal();

  const handleSubtotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const subtotal = parseFloat(e.target.value) || 0;
    const impuesto = +(subtotal * 0.12).toFixed(2);
    const total = +(subtotal + impuesto).toFixed(2);
    setFormData({
      ...formData,
      subtotal: e.target.value,
      impuesto: impuesto.toString(),
      total: total.toString()
    });
  };

  return (
    <VentasContainer>
      <Navbar />
      <MainContent>
        <Header>
          <Title>Caja Registradora</Title>
          <AddButton onClick={() => setShowModal(true)}>
            + Nueva Venta
          </AddButton>
        </Header>

        <SalesGrid>
          <SalesCard>
            <CardTitle>Ventas Recientes</CardTitle>
            <SalesTable>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Pedido</TableHeaderCell>
                  <TableHeaderCell>Cliente</TableHeaderCell>
                  <TableHeaderCell>Total</TableHeaderCell>
                  <TableHeaderCell>Estado</TableHeaderCell>
                  <TableHeaderCell>Teléfono Cliente</TableHeaderCell>
                  <TableHeaderCell>Empleado</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {ventas.slice(0, 5).map((venta) => (
                  <TableRow key={venta.id}>
                    <TableCell>{venta.numero_pedido}</TableCell>
                    <TableCell>{venta.cliente_nombre}</TableCell>
                    <TableCell>L. {(Number(venta.total) || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge status={venta.estado || 'pendiente'}>
                        {venta.estado || 'pendiente'}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{venta.cliente_telefono || 'N/A'}</TableCell>
                    <TableCell>{venta.empleado_nombre || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </SalesTable>
          </SalesCard>

          <SalesCard>
            <CardTitle>Resumen del Día</CardTitle>
            <div style={{ fontSize: '18px', lineHeight: '2' }}>
              <p><strong>Total Ventas:</strong> {ventas.length}</p>
              <p><strong>Ingresos:</strong> L. {(Number(ventas.reduce((sum, venta) => sum + Number(venta.total || 0), 0)) || 0).toFixed(2)}</p>
              <p><strong>Promedio:</strong> L. {ventas.length > 0 ? (Number(ventas.reduce((sum, venta) => sum + Number(venta.total || 0), 0)) / ventas.length).toFixed(2) : '0.00'}</p>
            </div>
          </SalesCard>
        </SalesGrid>

        {showModal && (
          <ModalOverlay onClick={() => setShowModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
              <ModalTitle>Registrar Nueva Venta</ModalTitle>
              
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Cliente</Label>
                  <Select
                    value={formData.clienteId}
                    onChange={e => {
                      const cliente = clientes.find(c => c.id === parseInt(e.target.value));
                      setFormData({
                        ...formData,
                        clienteId: cliente ? String(cliente.id) : '',
                        cliente_nombre: cliente ? `${cliente.primerNombre} ${cliente.primerApellido}` : '',
                        cliente_email: cliente?.email || '',
                        cliente_telefono: cliente?.telefono || ''
                      });
                    }}
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {`${cliente.primerNombre} ${cliente.primerApellido}`}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Email del Cliente</Label>
                  <Input
                    type="email"
                    value={formData.cliente_email}
                    onChange={(e) => setFormData({...formData, cliente_email: e.target.value})}
                    placeholder="cliente@email.com"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Teléfono del Cliente</Label>
                  <Input
                    type="tel"
                    value={formData.cliente_telefono}
                    onChange={(e) => setFormData({...formData, cliente_telefono: e.target.value})}
                    placeholder="+57 300 123 4567"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Producto</Label>
                  <Select
                    value={formData.productoSeleccionado}
                    onChange={e => setFormData({ ...formData, productoSeleccionado: e.target.value })}
                  >
                    <option value="">Seleccionar producto</option>
                    {productosDisponibles.map((producto) => (
                      <option key={producto.id} value={producto.id}>
                        {producto.nombre} (L. {producto.precio})
                      </option>
                    ))}
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.cantidadSeleccionada}
                    onChange={e => setFormData({ ...formData, cantidadSeleccionada: parseInt(e.target.value) })}
                  />
                </FormGroup>
                <Button type="button" onClick={handleAgregarProducto} style={{ marginBottom: 10 }}>
                  Agregar producto
                </Button>
                {formData.productosVenta.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <h4>Productos en la venta:</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {formData.productosVenta.map((prod, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, background: '#faf8f2', borderRadius: 8, padding: '8px 12px' }}>
                          <span>
                            {prod.nombre} - Cantidad: {prod.cantidad} - Precio: L. {prod.precio}
                          </span>
                          <Button type="button" style={{ marginLeft: 16, background: '#b8860b', color: '#fff', fontWeight: 600, padding: '4px 16px' }} onClick={() => {
                            setFormData({
                              ...formData,
                              productosVenta: formData.productosVenta.filter((_, i) => i !== idx)
                            });
                          }}>Eliminar</Button>
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: 16, padding: '12px 16px', background: '#fffbe6', borderRadius: 8, boxShadow: '0 2px 8px #f5e4bc55', maxWidth: 350 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span>Subtotal:</span>
                        <span>L. {formData.subtotal}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span>Impuesto (ISV 12%):</span>
                        <span>L. {formData.impuesto}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
                        <span>Total:</span>
                        <span>L. {formData.total}</span>
                      </div>
                    </div>
                  </div>
                )}

                <FormGroup>
                  <Label>Método de Pago</Label>
                  <Select
                    value={formData.metodo_pago}
                    onChange={(e) => setFormData({...formData, metodo_pago: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar método</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="paypal">PayPal</option>
                  </Select>
                </FormGroup>

                <FormGroupFull>
                  <Label>Dirección de Entrega</Label>
                  <Input
                    type="text"
                    value={formData.direccion_entrega}
                    onChange={(e) => setFormData({...formData, direccion_entrega: e.target.value})}
                    placeholder="Dirección completa para entrega"
                  />
                </FormGroupFull>

                <FormGroupFull>
                  <Label>Notas Adicionales</Label>
                  <Input
                    type="text"
                    value={formData.notas}
                    onChange={(e) => setFormData({...formData, notas: e.target.value})}
                    placeholder="Notas especiales o instrucciones"
                  />
                </FormGroupFull>

                <SubmitButton type="submit">
                  Registrar Venta
                </SubmitButton>
              </Form>
            </ModalContent>
          </ModalOverlay>
        )}
      </MainContent>
    </VentasContainer>
  );
};

export default Ventas; 