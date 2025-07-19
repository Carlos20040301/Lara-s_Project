import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { productoService, categoriaService } from '../services/api';
import { Producto, Categoria } from '../types';
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
  TextArea, 
  LoadingMessage 
} from '../components/ui/BaseComponents';

const InventarioContainer = styled.div`
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

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  background: var(--white);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 10px;

    &:hover {
      transform: translateY(-3px);
    }
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    height: 150px;
  }
`;

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 8px;
`;

const ProductCode = styled.p`
  color: var(--text-light);
  font-size: 14px;
  margin-bottom: 8px;
`;

const ProductPrice = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-gold);
  margin-bottom: 8px;
`;

const ProductStock = styled.p`
  color: var(--text-light);
  font-size: 14px;
  margin-bottom: 15px;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SubmitButton = styled(Button)``;

const Inventario: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria_id: '',
    imagen: null as File | null
  });
  const [editProductId, setEditProductId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productosData, categoriasData] = await Promise.all([
        productoService.getAll(),
        categoriaService.getAll()
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('codigo', formData.codigo);
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('precio', formData.precio);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('categoria_id', formData.categoria_id);
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen);
      }

      if (editProductId) {
        await productoService.update(editProductId, formDataToSend);
      } else {
        await productoService.create(formDataToSend);
      }

      setShowModal(false);
      setEditProductId(null);
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria_id: '',
        imagen: null
      });
      loadData();
    } catch (error) {
      console.error('Error creating/updating product:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres marcar este producto como fuera de stock?')) {
      try {
        await productoService.delete(id);
        await loadData(); // Recarga desde el backend
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) {
    return (
      <InventarioContainer>
        <Navbar />
        <LoadingMessage>Cargando inventario...</LoadingMessage>
      </InventarioContainer>
    );
  }

  return (
    <InventarioContainer>
      <Navbar />
      <MainContent>
        <Header>
          <Title>Gestión de Inventario</Title>
          <AddButton onClick={() => setShowModal(true)}>
            + Agregar Producto
          </AddButton>
        </Header>

        <ProductsGrid>
          {productos.map((producto) => {
            const isOutOfStock = producto.stock === 0 || producto.activo === false;
            return (
              <ProductCard key={producto.id} style={isOutOfStock ? { opacity: 0.7 } : {}}>
                <ProductImage
                  src={`/${producto.categoria?.nombre || 'SinCategoria'}/${producto.imagen}`}
                  alt={producto.nombre}
                  onError={e => {
                    (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                  }}
                />
                <ProductName>{producto.nombre}</ProductName>
                <ProductCode>Código: {producto.codigo}</ProductCode>
                <ProductPrice>L. {Number(producto.precio).toFixed(2)}</ProductPrice>
                <ProductStock>
                  Stock: {producto.stock} unidades
                  {isOutOfStock && <span style={{ color: 'red', fontWeight: 700, marginLeft: 8 }}>(Out of Stock)</span>}
                </ProductStock>
                <ProductActions>
                  <ActionButton
                    variant="edit"
                    onClick={() => {
                      setEditProductId(producto.id);
                      setFormData({
                        codigo: producto.codigo,
                        nombre: producto.nombre,
                        descripcion: producto.descripcion || '',
                        precio: producto.precio.toString(),
                        stock: producto.stock.toString(),
                        categoria_id: producto.categoria_id.toString(),
                        imagen: null
                      });
                      setShowModal(true);
                    }}
                  >
                    Editar
                  </ActionButton>
                  {isOutOfStock ? (
                    <ActionButton variant="delete" disabled style={{ background: '#aaa', cursor: 'not-allowed' }}>
                      Out of Stock
                    </ActionButton>
                  ) : (
                    <ActionButton
                      variant="delete"
                      onClick={() => handleDelete(producto.id)}
                    >
                      Marcar como Out of Stock
                    </ActionButton>
                  )}
                </ProductActions>
              </ProductCard>
            );
          })}
        </ProductsGrid>

        {showModal && (
          <ModalOverlay onClick={() => setShowModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={() => {
                setShowModal(false);
                setEditProductId(null);
              }}>×</CloseButton>
              <ModalTitle>
                {editProductId ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </ModalTitle>
              
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Código del Producto *</Label>
                  <Input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                    placeholder="Ej: ANI003"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Categoría *</Label>
                  <Select
                    value={formData.categoria_id}
                    onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={String(categoria.id)}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Nombre del Producto *</Label>
                  <Input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Ej: Anillo de Compromiso Diamante"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Descripción</Label>
                  <TextArea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    placeholder="Descripción detallada del producto"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Precio *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({...formData, precio: e.target.value})}
                    placeholder="0"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Stock Inicial *</Label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    placeholder="0"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Imagen del Producto</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, imagen: e.target.files?.[0] || null})}
                  />
                </FormGroup>

                <SubmitButton type="submit">
                  {editProductId ? 'Guardar Cambios' : 'Agregar Producto'}
                </SubmitButton>
              </Form>
            </ModalContent>
          </ModalOverlay>
        )}
      </MainContent>
    </InventarioContainer>
  );
};

export default Inventario; 