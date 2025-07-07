import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
}

interface StyledButtonProps {
  variant: ButtonProps['variant'];
  size: ButtonProps['size'];
}

const ButtonBase = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: ${theme.transitions.fast};
  text-decoration: none;
  outline: none;
  
  &:focus {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${({ variant, size }) => getVariantStyles(variant, size)}
`;

const getVariantStyles = (variant: ButtonProps['variant'], size: ButtonProps['size']) => {
  const sizeStyles = {
    small: css`
      padding: ${theme.spacing.xs} ${theme.spacing.sm};
      font-size: ${theme.fontSizes.sm};
      gap: ${theme.spacing.xs};
    `,
    medium: css`
      padding: ${theme.spacing.sm} ${theme.spacing.md};
      font-size: ${theme.fontSizes.md};
      gap: ${theme.spacing.sm};
    `,
    large: css`
      padding: ${theme.spacing.md} ${theme.spacing.lg};
      font-size: ${theme.fontSizes.lg};
      gap: ${theme.spacing.sm};
    `,
  };

  const variantStyles = {
    primary: css`
      background-color: ${theme.colors.primary};
      color: ${theme.colors.white};
      
      &:hover:not(:disabled) {
        background-color: ${theme.colors.primaryHover};
      }
      
      &:active:not(:disabled) {
        background-color: ${theme.colors.primaryHover};
        transform: translateY(1px);
      }
    `,
    secondary: css`
      background-color: ${theme.colors.secondary};
      color: ${theme.colors.white};
      
      &:hover:not(:disabled) {
        background-color: ${theme.colors.secondaryHover};
      }
      
      &:active:not(:disabled) {
        background-color: ${theme.colors.secondaryHover};
        transform: translateY(1px);
      }
    `,
    outline: css`
      background-color: transparent;
      color: ${theme.colors.primary};
      border: 2px solid ${theme.colors.primary};
      
      &:hover:not(:disabled) {
        background-color: ${theme.colors.primary};
        color: ${theme.colors.white};
      }
      
      &:active:not(:disabled) {
        transform: translateY(1px);
      }
    `,
    ghost: css`
      background-color: transparent;
      color: ${theme.colors.primary};
      
      &:hover:not(:disabled) {
        background-color: ${theme.colors.gray[100]};
      }
      
      &:active:not(:disabled) {
        background-color: ${theme.colors.gray[200]};
        transform: translateY(1px);
      }
    `,
    success: css`
      background-color: ${theme.colors.success};
      color: ${theme.colors.white};
      
      &:hover:not(:disabled) {
        background-color: #0d9488;
      }
      
      &:active:not(:disabled) {
        background-color: #0d9488;
        transform: translateY(1px);
      }
    `,
    danger: css`
      background-color: ${theme.colors.error};
      color: ${theme.colors.white};
      
      &:hover:not(:disabled) {
        background-color: #dc2626;
      }
      
      &:active:not(:disabled) {
        background-color: #dc2626;
        transform: translateY(1px);
      }
    `,
  };

  return css`
    ${sizeStyles[size || 'medium']}
    ${variantStyles[variant || 'primary']}
  `;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  type = 'button',
  onClick,
  className,
  'aria-label': ariaLabel,
  ...props 
}, ref) => {
  return (
    <ButtonBase
      ref={ref}
      variant={variant}
      size={size}
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </ButtonBase>
  );
});

Button.displayName = 'Button';

export default Button; 