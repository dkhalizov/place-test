import { ErrorInfo } from 'react';

// Grid and pixel related types
export interface PixelUpdate {
  x: number;
  y: number;
  color: number;
  time: number;
}

export interface GridState {
  grid: Uint8Array;
  size: number;
}

// WebSocket related types
export interface WebSocketMessage {
  type: 'state' | 'pixel' | 'unknown';
  data?: any;
}

export interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  reconnectAttempts: number;
  error: string | null;
}

// Authentication related types
export interface AuthToken {
  token: string;
  expiresAt?: number;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// API related types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface DrawRequest {
  x: number;
  y: number;
  color: number;
}

// Configuration types
export interface AppConfig {
  authEnabled: boolean;
  googleClientId?: string;
  apiBaseUrl: string;
  websocketUrl: string;
  gridSize: number;
  colors: string[];
  maxReconnectAttempts: number;
  inactivityTimeout: number;
}

// Component prop types
export interface ColorPickerProps {
  selectedColor: number;
  onColorSelect: (color: number) => void;
  colors: string[];
  disabled?: boolean;
}

export interface PixelGridProps {
  grid: Uint8Array;
  onPixelClick: (x: number, y: number) => void;
  size: number;
  colors: string[];
  disabled?: boolean;
  loading?: boolean;
}

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// Canvas related types
export interface CanvasPosition {
  x: number;
  y: number;
}

export interface ViewportState {
  zoom: number;
  offset: CanvasPosition;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Error types
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class WebSocketError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'WEBSOCKET_ERROR', details);
    this.name = 'WebSocketError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'AUTH_ERROR', details);
    this.name = 'AuthError';
  }
} 