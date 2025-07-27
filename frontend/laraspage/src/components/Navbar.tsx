import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaHome, FaBoxes, FaUsers, FaCashRegister, FaSignOutAlt, FaUser } from 'react-icons/fa';

// Función helper para renderizar iconos de manera compatible
const renderIcon = (IconComponent: any) => {
  return React.createElement(IconComponent);
};

const NavbarContainer = styled.nav`
  background: var(--white);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
`;

const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const LogoText = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-gold);
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const DesktopMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-dark);
  cursor: pointer;
  padding: 8px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavLink = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: ${props => props.active ? 'var(--primary-gold)' : 'var(--text-dark)'};
  background: ${props => props.active ? 'var(--light-gold)' : 'transparent'};

  &:hover {
    background: var(--light-gold);
    color: var(--primary-gold);
  }

  svg {
    font-size: 16px;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserInfo = styled.div`
  text-align: right;

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserName = styled.p`
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
  font-size: 14px;
`;

const UserRole = styled.p`
  color: var(--text-light);
  margin: 0;
  font-size: 12px;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--error);
  color: var(--white);
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #c82333;
  }

  svg {
    font-size: 14px;
  }
`;

// Mobile Menu Styles
const MobileMenu = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: var(--white);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(${props => props.$isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease;
  z-index: 999;
  max-height: calc(100vh - 70px);
  overflow-y: auto;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenuContent = styled.div`
  padding: 20px;
`;

const MobileNavLink = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: ${props => props.active ? 'var(--primary-gold)' : 'var(--text-dark)'};
  background: ${props => props.active ? 'var(--light-gold)' : 'transparent'};
  margin-bottom: 8px;

  &:hover {
    background: var(--light-gold);
    color: var(--primary-gold);
  }

  svg {
    font-size: 18px;
  }
`;

const MobileUserInfo = styled.div`
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  margin-top: 20px;
`;

const MobileUserName = styled.p`
  font-weight: 600;
  color: var(--text-dark);
  margin: 0 0 5px 0;
  font-size: 16px;
`;

const MobileUserRole = styled.p`
  color: var(--text-light);
  margin: 0 0 15px 0;
  font-size: 14px;
`;



const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${props => props.$isOpen ? '1' : '0'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 998;

  @media (min-width: 769px) {
    display: none;
  }
`;

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: renderIcon(FaHome) },
    { path: '/inventario', label: 'Inventario', icon: renderIcon(FaBoxes) },
    { path: '/clientes', label: 'Clientes', icon: renderIcon(FaUsers) },
    { path: '/ventas', label: 'Ventas', icon: renderIcon(FaCashRegister) }
  ];

  return (
    <>
      <NavbarContainer>
        <NavContent>
          <Logo onClick={() => handleNavigation('/dashboard')}>
            <LogoImage src="/Logo_Lara.jfif" alt="Lara's Joyería" />
            <LogoText>Lara's Joyería</LogoText>
          </Logo>

          <DesktopMenu>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                active={isActive(item.path)}
                onClick={() => handleNavigation(item.path)}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </DesktopMenu>

          <UserSection>
            <UserInfo>
              <UserName>
                {user
                  ? (user.primerNombre && user.primerApellido
                      ? `${user.primerNombre} ${user.primerApellido}`
                      : user.correo || 'Usuario')
                  : 'Usuario'}
              </UserName>
              <UserRole>{user?.rol || 'Empleado'}</UserRole>
            </UserInfo>
            <LogoutButton onClick={handleLogout}>
              {renderIcon(FaSignOutAlt)}
              Cerrar Sesión
            </LogoutButton>
          </UserSection>

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? renderIcon(FaTimes) : renderIcon(FaBars)}
          </MobileMenuButton>
        </NavContent>
      </NavbarContainer>

      <MobileMenu $isOpen={isMobileMenuOpen}>
        <MobileMenuContent>
          {menuItems.map((item) => (
            <MobileNavLink
              key={item.path}
              active={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
            >
              {item.icon}
              {item.label}
            </MobileNavLink>
          ))}
          
          <MobileNavLink onClick={handleLogout}>
            {renderIcon(FaSignOutAlt)}
            Cerrar Sesión
          </MobileNavLink>
          
          <MobileUserInfo>
            <MobileUserName>
              {renderIcon(FaUser)}
              {user?.nombre || 'Usuario'}
            </MobileUserName>
            <MobileUserRole>{user?.rol || 'Empleado'}</MobileUserRole>
          </MobileUserInfo>
        </MobileMenuContent>
      </MobileMenu>

      <Overlay 
        $isOpen={isMobileMenuOpen} 
        onClick={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

export default Navbar; 