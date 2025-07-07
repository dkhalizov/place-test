import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import Button from '../ui/Button';

const AppContainer = styled.div`
  background: linear-gradient(135deg, ${theme.colors.background}, ${theme.colors.gray[100]});
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
`;

const Title = styled.h1`
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.textPrimary};
  margin: 0;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

const Subtitle = styled.p`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.textSecondary};
  margin: ${theme.spacing.xs} 0 0 0;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
`;

const MainContent = styled.main`
  width: 100%;
  max-width: 1200px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.sm};
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
`;

const ConnectionStatus = styled.div<{ isConnected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ isConnected }) => 
      isConnected ? theme.colors.success : theme.colors.error};
  }
`;

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onSignOut?: () => void;
  isAuthenticated?: boolean;
  isConnected?: boolean;
  connectedClients?: number;
  showSignOut?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title = "Pixel Place",
  subtitle = "Choose a color and place a pixel",
  onSignOut,
  isAuthenticated = false,
  isConnected = false,
  connectedClients = 0,
  showSignOut = false,
}) => {
  return (
    <AppContainer>
      <Header>
        <HeaderContent>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </HeaderContent>
        
        <HeaderActions>
          {isAuthenticated && (
            <StatusBar>
              <ConnectionStatus isConnected={isConnected}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </ConnectionStatus>
              <span>{connectedClients} users online</span>
            </StatusBar>
          )}
          
          {showSignOut && onSignOut && (
            <Button
              variant="danger"
              size="small"
              onClick={onSignOut}
              aria-label="Sign out"
            >
              Sign Out
            </Button>
          )}
        </HeaderActions>
      </Header>
      
      <MainContent>
        {children}
      </MainContent>
    </AppContainer>
  );
};

export default AppLayout; 