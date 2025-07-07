import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { AuthState, User } from '../../types';
import { AUTH_TOKEN_KEY, API_ENDPOINTS } from '../../constants';

interface AuthContextType extends AuthState {
  signIn: (tokenResponse: any) => Promise<void>;
  signOut: () => void;
  renewToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  authEnabled: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, authEnabled }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
  });

  const signIn = useCallback(async (tokenResponse: any) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const res = await fetch(`${window.location.origin}${API_ENDPOINTS.AUTH.SIGN_IN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: "google",
          token: tokenResponse.credential
        }),
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        const token = data.token;
        
        setAuthState({
          isAuthenticated: true,
          user: data.user || null,
          token,
          loading: false,
          error: null,
        });
        
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      } else {
        throw new Error('Failed to authenticate with the server');
      }
    } catch (err) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Authentication failed',
      }));
    }
  }, []);

  const signOut = useCallback(() => {
    googleLogout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    });
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }, []);

  const renewToken = useCallback(async () => {
    const currentToken = authState.token;
    if (!currentToken) return;

    try {
      const res = await fetch(`${window.location.origin}${API_ENDPOINTS.AUTH.RENEW}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const newToken = data.token;
        
        setAuthState(prev => ({
          ...prev,
          token: newToken,
        }));
        
        localStorage.setItem(AUTH_TOKEN_KEY, newToken);
      } else {
        throw new Error('Failed to renew token');
      }
    } catch (err) {
      console.error('Error renewing token:', err);
      signOut();
    }
  }, [authState.token, signOut]);

  // Initialize auth state from localStorage
  useEffect(() => {
    if (!authEnabled) {
      setAuthState({
        isAuthenticated: true,
        user: null,
        token: 'public',
        loading: false,
        error: null,
      });
      return;
    }

    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (storedToken) {
      setAuthState(prev => ({
        ...prev,
        token: storedToken,
        isAuthenticated: true,
      }));
    }
  }, [authEnabled]);

  // Token expiration check
  useEffect(() => {
    if (!authState.token || authState.token === 'public') return;

    const checkTokenExpiration = () => {
      // Token expiration logic can be added here
      // For now, we'll just check every minute
    };

    const intervalId = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(intervalId);
  }, [authState.token]);

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signOut,
    renewToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 