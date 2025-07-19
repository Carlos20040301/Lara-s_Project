import styled from 'styled-components';

// Botón base
export const Button = styled.button`
  background: linear-gradient(135deg, var(--primary-gold), var(--dark-gold));
  color: var(--white);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

// Botón secundario
export const ButtonSecondary = styled(Button)`
  background: var(--white);
  color: var(--primary-gold);
  border: 2px solid var(--primary-gold);

  &:hover {
    background: var(--primary-gold);
    color: var(--white);
  }
`;

// Botón de acción (editar/eliminar)
export const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 5px;

  background: ${props => props.variant === 'delete' ? 'var(--error)' : 'var(--info)'};
  color: var(--white);

  &:hover {
    opacity: 0.8;
  }
`;

// Input base
export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-gold);
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }
`;

// Select base
export const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: var(--white);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--primary-gold);
  }
`;

// Textarea base
export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: var(--primary-gold);
  }
`;

// Label base
export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-dark);
`;

// Grupo de formulario
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

// Grupo de formulario que ocupa todo el ancho
export const FormGroupFull = styled(FormGroup)`
  grid-column: 1 / -1;
`;

// Card base
export const Card = styled.div`
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 8px 25px var(--shadow);
  padding: 24px;
  margin-bottom: 20px;
`;

// Modal base
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background: var(--white);
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 10px;
    max-height: 85vh;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 20px;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-light);
  transition: color 0.3s ease;

  &:hover {
    color: var(--error);
  }
`;

// Tabla base
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: var(--white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    border-radius: 10px;
    font-size: 14px;
  }
`;

export const TableHeader = styled.thead`
  background: var(--light-gold);
`;

export const TableRow = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

export const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  color: var(--text-dark);

  @media (max-width: 768px) {
    padding: 10px 8px;
  }
`;

export const TableHeaderCell = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: var(--text-dark);

  @media (max-width: 768px) {
    padding: 10px 8px;
    font-size: 13px;
  }
`;

// Badge de estado
export const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.status) {
      case 'pendiente': return '#fff3cd';
      case 'confirmado': return '#d1ecf1';
      case 'enviado': return '#d4edda';
      case 'entregado': return '#d4edda';
      case 'cancelado': return '#f8d7da';
      case 'activo': return '#d4edda';
      case 'inactivo': return '#f8d7da';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pendiente': return '#856404';
      case 'confirmado': return '#0c5460';
      case 'enviado': return '#155724';
      case 'entregado': return '#155724';
      case 'cancelado': return '#721c24';
      case 'activo': return '#155724';
      case 'inactivo': return '#721c24';
      default: return '#6c757d';
    }
  }};
`;

// Mensajes
export const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--text-light);
  font-size: 18px;
`;

export const ErrorMessage = styled.div`
  color: var(--error);
  background: #f8d7da;
  padding: 12px;
  border-radius: 8px;
  margin: 10px 0;
  font-size: 14px;
`;

export const SuccessMessage = styled.div`
  color: var(--success);
  background: #d4edda;
  padding: 12px;
  border-radius: 8px;
  margin: 10px 0;
  font-size: 14px;
`; 