// Modern theme system for the application
export const theme = {
  colors: {
    // Primary colors
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    primaryLight: '#a5b4fc',
    
    // Secondary colors
    secondary: '#64748b',
    secondaryHover: '#475569',
    secondaryLight: '#cbd5e1',
    
    // Neutral colors
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    
    // Status colors
    success: '#10b981',
    successLight: '#dcfce7',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    info: '#3b82f6',
    infoLight: '#dbeafe',
    
    // Background colors
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceHover: '#f1f5f9',
    
    // Border colors
    border: '#e2e8f0',
    borderHover: '#cbd5e1',
    
    // Text colors
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    textInverse: '#ffffff',
  },
  
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
  },
  
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  borders: {
    none: 'none',
    thin: '1px solid',
    medium: '2px solid',
    thick: '4px solid',
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  
  transitions: {
    fast: 'all 0.15s ease-in-out',
    normal: 'all 0.3s ease-in-out',
    slow: 'all 0.5s ease-in-out',
  },
  
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  },
  
  zIndices: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

// Theme type for TypeScript
export type Theme = typeof theme;

// Dark theme variant (with flexible typing)
export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    // Override colors for dark theme
    background: '#0f172a',
    surface: '#1e293b',
    surfaceHover: '#334155',
    
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    textInverse: '#1e293b',
    
    border: '#334155',
    borderHover: '#475569',
    
    gray: {
      50: '#0f172a',
      100: '#1e293b',
      200: '#334155',
      300: '#475569',
      400: '#64748b',
      500: '#94a3b8',
      600: '#cbd5e1',
      700: '#e2e8f0',
      800: '#f1f5f9',
      900: '#f8fafc',
    },
  },
};

// Utility functions for responsive design
export const breakpoint = (size: keyof typeof theme.breakpoints) => 
  `@media (min-width: ${theme.breakpoints[size]})`;

// Utility functions for spacing
export const spacing = (size: keyof typeof theme.spacing) => theme.spacing[size];

// Utility functions for colors
export const color = (colorKey: string) => {
  const keys = colorKey.split('.');
  let value: any = theme.colors;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return colorKey; // Return original key if not found
    }
  }
  
  return typeof value === 'string' ? value : colorKey;
};

// CSS-in-JS utilities
export const cssUtils = {
  // Flexbox utilities
  flexCenter: `
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  
  flexBetween: `
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  
  flexColumn: `
    display: flex;
    flex-direction: column;
  `,
  
  // Text utilities
  textEllipsis: `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  
  // Visual utilities
  visuallyHidden: `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `,
  
  // Focus utilities
  focusRing: `
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  `,
  
  // Hover utilities
  hoverScale: `
    transition: transform 0.2s ease-in-out;
    &:hover {
      transform: scale(1.05);
    }
  `,
}; 