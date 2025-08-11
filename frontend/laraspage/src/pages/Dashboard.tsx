import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const DashboardContainer = styled.div`
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

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 20px;
  background: linear-gradient(135deg, var(--primary-gold), var(--dark-gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 32px;
  }

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const ChangingText = styled.div`
  font-size: 24px;
  color: var(--text-light);
  min-height: 36px;
  margin-bottom: 40px;
  font-style: italic;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 30px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 40px;
  }
`;

const ActionCard = styled.div`
  background: var(--white);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
    border-radius: 15px;

    &:hover {
      transform: translateY(-5px);
    }
  }
`;

const ActionIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-gold), var(--dark-gold));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 32px;
  color: var(--white);

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
`;

const ActionTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ActionDescription = styled.p`
  color: var(--text-light);
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const CompanyInfo = styled.div`
  background: var(--white);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 30px 20px;
    border-radius: 15px;
  }
`;

const CompanyTitle = styled.h2`
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 30px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const InfoCard = styled.div`
  text-align: center;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const InfoIcon = styled.div`
  width: 60px;
  height: 60px;
  background: var(--light-gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 24px;
  color: var(--primary-gold);

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
`;

const InfoTitle = styled.h4`
  font-size: 20px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const InfoText = styled.p`
  color: var(--text-light);
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  // Cargar usuarios solo si es admin


  const changingTexts = [
    "Lara's Joyería - Las mejores joyas",
    "Lara's Joyería va de tu mano",
    "Lara's Joyería - Elegancia en cada detalle",
    "Lara's Joyería - Joyas que cuentan historias",
    "Lara's Joyería - Brillo que perdura",
    "Lara's Joyería - Calidad y belleza",
    "Lara's Joyería - Momentos especiales",
    "Lara's Joyería - Tu joyería de confianza"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => 
        prevIndex === changingTexts.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [changingTexts.length]);

  return (
    <DashboardContainer>
      <Navbar />
      <MainContent>
        <WelcomeSection>
          <WelcomeTitle>Bienvenido a Lara's Joyería</WelcomeTitle>
          <ChangingText>
            {changingTexts[currentTextIndex]}
          </ChangingText>
        </WelcomeSection>

        <ActionButtons>
          <ActionCard onClick={() => navigate('/inventario')}>
            <ActionIcon>📦</ActionIcon>
            <ActionTitle>Gestionar Inventario</ActionTitle>
            <ActionDescription>
              Administra el stock de joyas, añade nuevos productos y mantén un control completo del inventario.
            </ActionDescription>
          </ActionCard>

          <ActionCard onClick={() => navigate('/clientes')}>
            <ActionIcon>👥</ActionIcon>
            <ActionTitle>Gestionar Clientes</ActionTitle>
            <ActionDescription>
              Mantén un registro de tus mejores clientes y gestiona la información de contacto.
            </ActionDescription>
          </ActionCard>
        </ActionButtons>

        <CompanyInfo>
          <CompanyTitle>Nuestra Empresa</CompanyTitle>
          <InfoGrid>
            <InfoCard>
              <InfoIcon>🎯</InfoIcon>
              <InfoTitle>Misión</InfoTitle>
              <InfoText>
                Ser la joyería líder en Honduras, ofreciendo joyas de la más alta calidad y diseño único, 
                creando momentos inolvidables para nuestros clientes a través de piezas que cuentan historias 
                y transmiten emociones especiales.
              </InfoText>
            </InfoCard>

            <InfoCard>
              <InfoIcon>👁️</InfoIcon>
              <InfoTitle>Visión</InfoTitle>
              <InfoText>
                Ser reconocidos como la joyería más prestigiosa y confiable del país, 
                destacando por nuestra innovación en diseño, excelencia en servicio al cliente 
                y compromiso con la calidad artesanal en cada pieza que creamos.
              </InfoText>
            </InfoCard>

            <InfoCard>
              <InfoIcon>🎯</InfoIcon>
              <InfoTitle>Objetivo</InfoTitle>
              <InfoText>
                Satisfacer las necesidades de nuestros clientes ofreciendo joyas únicas y de calidad, 
                manteniendo los más altos estándares de excelencia en diseño, fabricación y servicio, 
                contribuyendo a crear momentos especiales en la vida de cada persona.
              </InfoText>
            </InfoCard>
          </InfoGrid>
        </CompanyInfo>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard; 