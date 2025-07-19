import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button, Input, Label, FormGroup, ErrorMessage, SuccessMessage } from '../components/ui/BaseComponents';
import { FaArrowLeft, FaEnvelope, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';

// Función helper para renderizar iconos de manera compatible
const renderIcon = (IconComponent: any) => {
  return React.createElement(IconComponent);
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const Card = styled.div`
  background: var(--white);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 450px;
  text-align: center;
  position: relative;

  @media (max-width: 480px) {
    padding: 30px 20px;
    margin: 10px;
    border-radius: 15px;
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-gold);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border: 2px solid var(--primary-gold);
  border-radius: 6px;
  background: rgba(212, 175, 55, 0.1);
  transition: all 0.3s ease;
  position: absolute;
  top: 20px;
  left: 20px;

  &:hover {
    color: var(--white);
    background: var(--primary-gold);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
  }

  @media (max-width: 480px) {
    top: 15px;
    left: 15px;
    font-size: 13px;
    padding: 6px 12px;
  }
`;

const Logo = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 30px;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);

  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    margin-bottom: 25px;
  }
`;

const Title = styled.h1`
  color: var(--text-dark);
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Subtitle = styled.p`
  color: var(--text-light);
  font-size: 16px;
  margin-bottom: 30px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 10px;
`;

const SubmitButton = styled(Button)`
  padding: 14px;
  margin-top: 20px;
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
  }

  &:disabled {
    transform: none;
    box-shadow: none;
  }
`;

const BackToEmailButton = styled(Button)`
  padding: 12px 20px;
  margin-top: 15px;
  background: var(--text-light);
  color: var(--white);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: var(--text-dark);
    transform: translateY(-2px);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--white);
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const PasswordInputContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  padding: 4px;
  font-size: 16px;
  transition: color 0.3s ease;

  &:hover {
    color: var(--primary-gold);
  }
`;

const TokenInput = styled(Input)`
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 8px;
  font-family: 'Courier New', monospace;

  @media (max-width: 480px) {
    font-size: 20px;
    letter-spacing: 6px;
  }
`;

const RecuperarPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [step, setStep] = useState<'email' | 'token' | 'password'>(
    token && email ? 'token' : 'email'
  );
  
  const [formData, setFormData] = useState({
    email: email || '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Aquí iría la llamada a la API para enviar el email
      const response = await fetch('http://localhost:3001/api/auth/recuperar-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.emailExists) {
          setSuccess('Se ha enviado un código de recuperación a tu email.');
          setStep('token');
        } else {
          setError('Ingresa un correo válido, verifica que hayas puesto correctamente tu correo.');
          // No avanzar al siguiente paso si el email no existe
        }
      } else {
        setError(data.mensaje || 'Error al enviar el email de recuperación');
      }
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Aquí iría la llamada a la API para verificar el token
      const response = await fetch('http://localhost:3001/api/auth/verificar-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email, 
          token: formData.token 
        }),
      });

      if (response.ok) {
        setStep('password');
      } else {
        const data = await response.json();
        setError(data.mensaje || 'Código inválido');
      }
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setSuccess('');
    setError('');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Aquí iría la llamada a la API para cambiar la contraseña
      const response = await fetch('http://localhost:3001/api/auth/cambiar-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email, 
          token: formData.token,
          newPassword: formData.newPassword 
        }),
      });

      if (response.ok) {
        setSuccess('Contraseña cambiada exitosamente. Redirigiendo al login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.mensaje || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <>
      <Title>Recuperar Contraseña</Title>
      <Subtitle>Ingresa tu email para recibir un código de recuperación</Subtitle>
      
      <Form onSubmit={handleSendEmail}>
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="tu@email.com"
            required
          />
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <SubmitButton type="submit" disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner /> Enviando...
            </>
          ) : (
            <>
              {renderIcon(FaEnvelope)} Enviar Código
            </>
          )}
        </SubmitButton>
      </Form>
    </>
  );

  const renderTokenStep = () => (
    <>
      <Title>Verificar Código</Title>
      <Subtitle>Ingresa el código de 5 dígitos enviado a {formData.email}</Subtitle>
      
      <Form onSubmit={handleVerifyToken}>
        <FormGroup>
          <Label>Código de Verificación</Label>
          <TokenInput
            type="text"
            value={formData.token}
            onChange={(e) => setFormData({...formData, token: e.target.value})}
            placeholder="12345"
            maxLength={5}
            pattern="[0-9]{5}"
            required
          />
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SubmitButton type="submit" disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner /> Verificando...
            </>
          ) : (
            <>
              {renderIcon(FaKey)} Verificar Código
            </>
          )}
        </SubmitButton>
      </Form>

      <BackToEmailButton onClick={handleBackToEmail}>
        {renderIcon(FaArrowLeft)} Cambiar Email
      </BackToEmailButton>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <Title>Nueva Contraseña</Title>
      <Subtitle>Crea una nueva contraseña segura</Subtitle>
      
      <Form onSubmit={handleResetPassword}>
        <FormGroup>
          <Label>Nueva Contraseña</Label>
          <PasswordInputContainer>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              placeholder="••••••••"
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? renderIcon(FaEyeSlash) : renderIcon(FaEye)}
            </PasswordToggle>
          </PasswordInputContainer>
        </FormGroup>

        <FormGroup>
          <Label>Confirmar Contraseña</Label>
          <PasswordInputContainer>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="••••••••"
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? renderIcon(FaEyeSlash) : renderIcon(FaEye)}
            </PasswordToggle>
          </PasswordInputContainer>
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <SubmitButton type="submit" disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner /> Cambiando...
            </>
          ) : (
            'Cambiar Contraseña'
          )}
        </SubmitButton>
      </Form>
    </>
  );

  return (
    <Container>
      <Card>
        <BackButton to="/login">
          {renderIcon(FaArrowLeft)} Volver al Login
        </BackButton>
        
        <Logo src="/Logo_Lara.jfif" alt="Lara's Joyería" />
        
        {step === 'email' && renderEmailStep()}
        {step === 'token' && renderTokenStep()}
        {step === 'password' && renderPasswordStep()}
      </Card>
    </Container>
  );
};

export default RecuperarPassword; 