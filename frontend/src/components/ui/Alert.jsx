import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../../styles/theme';

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const AlertContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid;
  margin-bottom: ${theme.spacing.md};
  position: relative;
  animation: ${({ isExiting }) => 
    isExiting ? slideOut : slideIn} 0.3s ease-in-out;
  
  ${({ variant }) => getVariantStyles(variant)}
`;

const getVariantStyles = (variant) => {
  const styles = {
    success: css`
      background-color: ${theme.colors.successLight};
      border-color: ${theme.colors.success};
      color: ${theme.colors.success};
    `,
    error: css`
      background-color: ${theme.colors.errorLight};
      border-color: ${theme.colors.error};
      color: ${theme.colors.error};
    `,
    warning: css`
      background-color: ${theme.colors.warningLight};
      border-color: ${theme.colors.warning};
      color: ${theme.colors.warning};
    `,
    info: css`
      background-color: ${theme.colors.infoLight};
      border-color: ${theme.colors.info};
      color: ${theme.colors.info};
    `,
  };
  
  return styles[variant] || styles.info;
};

const AlertIcon = styled.div`
  font-size: ${theme.fontSizes.lg};
  margin-top: 0.125rem;
  flex-shrink: 0;
`;

const AlertContent = styled.div`
  flex: 1;
  font-size: ${theme.fontSizes.md};
  line-height: ${theme.lineHeights.normal};
`;

const AlertTitle = styled.h4`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const AlertMessage = styled.p`
  margin: 0;
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeights.normal};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.fontSizes.lg};
  cursor: pointer;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.sm};
  color: inherit;
  opacity: 0.7;
  transition: ${theme.transitions.fast};
  
  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  &:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

const getIcon = (variant) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };
  return icons[variant] || icons.info;
};

const Alert = ({ 
  variant = 'info', 
  title, 
  children, 
  onClose,
  autoClose = false,
  autoCloseDelay = 5000,
  className 
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  return (
    <AlertContainer 
      variant={variant} 
      isExiting={isExiting}
      className={className}
      role="alert"
    >
      <AlertIcon aria-hidden="true">
        {getIcon(variant)}
      </AlertIcon>
      
      <AlertContent>
        {title && <AlertTitle>{title}</AlertTitle>}
        {typeof children === 'string' ? (
          <AlertMessage>{children}</AlertMessage>
        ) : (
          children
        )}
      </AlertContent>
      
      {onClose && (
        <CloseButton 
          onClick={handleClose}
          aria-label="Close alert"
          title="Close"
        >
          ×
        </CloseButton>
      )}
    </AlertContainer>
  );
};

export default Alert; 