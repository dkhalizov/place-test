import React from 'react';
import styled from 'styled-components';
import { GoogleLogin } from '@react-oauth/google';
import { theme } from '../../styles/theme';
import { useAuth } from './AuthProvider';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
`;

const LoginTitle = styled.h2`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
`;

const LoginSubtitle = styled.p`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
  max-width: 400px;
`;

const LoadingText = styled.div`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.textSecondary};
  margin-top: ${theme.spacing.md};
`;

interface LoginFormProps {
  googleClientId: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ googleClientId }) => {
  const { signIn, loading, error } = useAuth();

  const handleGoogleSuccess = (tokenResponse: any) => {
    signIn(tokenResponse);
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
  };

  return (
    <LoginContainer>
      <LoginTitle>Welcome to Pixel Place</LoginTitle>
      <LoginSubtitle>
        Sign in with your Google account to start placing pixels and collaborating with others.
      </LoginSubtitle>
      
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />
      
      {loading && (
        <LoadingText>Signing you in...</LoadingText>
      )}
      
      {error && (
        <div style={{ 
          color: theme.colors.error, 
          marginTop: theme.spacing.md,
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
    </LoginContainer>
  );
};

export default LoginForm; 