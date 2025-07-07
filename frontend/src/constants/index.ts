// Color palette for the pixel grid
export const COLORS = [
  '#FFFFFF', // White
  '#E4E4E4', // Light Gray
  '#888888', // Gray
  '#222222', // Dark Gray
  '#FFA7D1', // Pink
  '#E50000', // Red
  '#E59500', // Orange
  '#A06A42', // Brown
  '#E5D900', // Yellow
  '#94E044', // Light Green
  '#02BE01', // Green
  '#00D3DD', // Cyan
  '#0083C7', // Blue
  '#0000EA', // Dark Blue
  '#CF6EE4', // Purple
  '#820080', // Dark Purple
] as const;

// Grid configuration
export const GRID_SIZE = 100;
export const INITIAL_ZOOM = 1;
export const MAX_ZOOM = 40;
export const MIN_ZOOM = 1;
export const ZOOM_FACTOR = 0.1;

// WebSocket configuration
export const WS_RECONNECT_DELAY = 1000; // Initial delay in ms
export const WS_MAX_RECONNECT_ATTEMPTS = 5;
export const WS_RECONNECT_BACKOFF_FACTOR = 2;
export const WS_MAX_RECONNECT_DELAY = 30000; // Maximum delay in ms

// Authentication
export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiration
export const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// API configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';
export const API_ENDPOINTS = {
  CONFIG: '/config',
  AUTH: {
    SIGN_IN: '/api/auth/signIn',
    SIGN_OUT: '/api/auth/signOut',
    REFRESH: '/api/auth/refresh',
    RENEW: '/api/auth/renew',
  },
  DRAW: '/api/draw',
  WEBSOCKET: '/ws',
} as const;

// Cache configuration
export const CACHE_KEYS = {
  APP_CONFIG: 'app_config',
  USER_PREFERENCES: 'user_preferences',
} as const;

export const CACHE_EXPIRATION = {
  CONFIG: 1000 * 60 * 60, // 1 hour
  USER_PREFERENCES: 1000 * 60 * 60 * 24 * 7, // 1 week
} as const;

// UI configuration
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
} as const;

export const LOADING_DELAYS = {
  DEBOUNCE: 300, // ms
  THROTTLE: 100, // ms
  RETRY: 1000, // ms
} as const;

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// WebSocket message types
export const WS_MESSAGE_TYPES = {
  STATE: 2,
  PIXEL_UPDATE: 4,
  CONNECTED_CLIENTS: 8,
  ERROR: 16,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  AUTH_REQUIRED: 'Please sign in to continue.',
  AUTH_EXPIRED: 'Your session has expired. Please sign in again.',
  WEBSOCKET_ERROR: 'Connection lost. Trying to reconnect...',
  DRAW_ERROR: 'Failed to update pixel. Please try again.',
  CONFIG_ERROR: 'Failed to load configuration.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  DRAW_SUCCESS: 'Pixel updated successfully!',
  AUTH_SUCCESS: 'Signed in successfully!',
  CONNECTION_SUCCESS: 'Connected to server!',
} as const;

// Feature flags
export const FEATURES = {
  DARK_MODE: false,
  SOUND_EFFECTS: false,
  ANALYTICS: false,
  KEYBOARD_SHORTCUTS: true,
  ACCESSIBILITY: true,
} as const;

// Accessibility
export const ARIA_LABELS = {
  COLOR_PICKER: 'Select color for pixel',
  GRID: 'Pixel grid for drawing',
  SIGN_IN: 'Sign in with Google',
  SIGN_OUT: 'Sign out',
  ZOOM_IN: 'Zoom in',
  ZOOM_OUT: 'Zoom out',
  RESET_ZOOM: 'Reset zoom',
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  ZOOM_IN: '+',
  ZOOM_OUT: '-',
  RESET_ZOOM: '0',
  ESCAPE: 'Escape',
} as const;

// Development flags
export const __DEV__ = process.env.NODE_ENV === 'development';
export const __PROD__ = process.env.NODE_ENV === 'production';
export const __TEST__ = process.env.NODE_ENV === 'test';

// Type exports for constants
export type ColorIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
export type WSMessageType = typeof WS_MESSAGE_TYPES[keyof typeof WS_MESSAGE_TYPES];
export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
export type SuccessMessageKey = keyof typeof SUCCESS_MESSAGES; 