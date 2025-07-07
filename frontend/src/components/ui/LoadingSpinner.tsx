import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  'aria-label'?: string;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div<{ size: LoadingSpinnerProps['size'] }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => 
    size === 'small' ? '1rem' : 
    size === 'large' ? '3rem' : '2rem'};
  height: ${({ size }) => 
    size === 'small' ? '1rem' : 
    size === 'large' ? '3rem' : '2rem'};
`;

const Spinner = styled.div<{ size: LoadingSpinnerProps['size']; color: string }>`
  width: 100%;
  height: 100%;
  border: ${({ size }) => 
    size === 'small' ? '2px' : 
    size === 'large' ? '4px' : '3px'} solid ${theme.colors.gray[200]};
  border-top: ${({ size }) => 
    size === 'small' ? '2px' : 
    size === 'large' ? '4px' : '3px'} solid ${({ color }) => color};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = theme.colors.primary,
  'aria-label': ariaLabel = 'Loading...'
}) => {
  return (
    <SpinnerContainer 
      size={size}
      role="status"
      aria-label={ariaLabel}
    >
      <Spinner size={size} color={color} />
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 