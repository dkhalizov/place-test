import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.errorLight};
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.md};
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.semibold};
  margin-bottom: ${theme.spacing.md};
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.md};
  margin-bottom: ${theme.spacing.lg};
  max-width: 500px;
`;

const ErrorButton = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.primaryHover};
  }
  
  &:focus {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

const ErrorDetails = styled.details`
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.sm};
  font-family: monospace;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  max-width: 600px;
  
  summary {
    cursor: pointer;
    font-weight: ${theme.fontWeights.medium};
    margin-bottom: ${theme.spacing.sm};
  }
  
  pre {
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console or error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer role="alert">
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            {this.props.fallbackMessage || 
             'An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.'}
          </ErrorMessage>
          
          <ErrorButton onClick={this.handleReset}>
            Try Again
          </ErrorButton>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <ErrorDetails>
              <summary>Error Details (Development Only)</summary>
              <pre>
                {this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 