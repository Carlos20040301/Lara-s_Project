import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Label, FormGroup, ErrorMessage } from '../components/ui/BaseComponents';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const LoginCard = styled.div`
  background: var(--white);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  text-align: center;

  @media (max-width: 480px) {
    padding: 30px 20px;
    margin: 10px;
    border-radius: 15px;
  }
`;

const Logo = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 20px;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

const Title = styled.h1`
  color: var(--text-dark);
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;

  @media (max-width: 480px) {
    font-size: 24px;
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



const LoginButton = styled(Button)`
  padding: 16px;
  margin-top: 15px;
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

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: center;
  color: var(--primary-gold);
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  margin-top: 20px;
  padding: 12px 20px;
  border: 2px solid var(--primary-gold);
  border-radius: 8px;
  background: rgba(212, 175, 55, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    color: var(--white);
    background: var(--primary-gold);
    text-decoration: none;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
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

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // (Eliminado el alert de bienvenida)
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.mensaje || err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo src="/Logo_Lara.jfif" alt="Lara's Joyería" />
        <Title>Lara's Joyería</Title>
        <Subtitle>Sistema de Gestión</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@joyeria.com"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <LoginButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner /> Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </LoginButton>
        </Form>

        <ForgotPasswordLink to="/recuperar-password">
          ¿Olvidaste tu contraseña?
        </ForgotPasswordLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 