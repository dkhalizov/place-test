import React from 'react';
import useConfig from './hooks/useConfig';
import { AppConfig } from './types';

export const ConfigContext = React.createContext<AppConfig | null>(null);

interface ConfigProviderProps {
  children: React.ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const { config, loading, error } = useConfig();

  if (loading) return <div>Loading configuration...</div>;
  if (error && !config) return <div>Error loading configuration: {error}</div>;
  if (!config) return null;

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};