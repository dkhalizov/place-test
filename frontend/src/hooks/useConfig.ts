import { useState, useEffect } from 'react';
import { AppConfig } from '../types';

const CACHE_KEY = 'app_config';
const CACHE_EXPIRATION = 1000 * 60 * 60; // 1 hour

// Default configuration when backend is not available
const DEFAULT_CONFIG: AppConfig = {
  authEnabled: false,
  googleClientId: '',
  apiBaseUrl: 'http://localhost:8081',
  websocketUrl: 'ws://localhost:8081/ws',
  gridSize: 100,
  colors: [
    '#FFFFFF', '#E4E4E4', '#888888', '#222222',
    '#FFA7D1', '#E50000', '#E59500', '#A06A42',
    '#E5D900', '#94E044', '#02BE01', '#00D3DD',
    '#0083C7', '#0000EA', '#CF6EE4', '#820080'
  ],
  maxReconnectAttempts: 5,
  inactivityTimeout: 300000, // 5 minutes
};

interface UseConfigReturn {
  config: AppConfig | null;
  loading: boolean;
  error: string | null;
}

const useConfig = (): UseConfigReturn => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Check if we have a cached config
        const cachedConfig = localStorage.getItem(CACHE_KEY);
        if (cachedConfig) {
          const { data, timestamp } = JSON.parse(cachedConfig);
          
          // Check if the cache is still valid
          if (Date.now() - timestamp < CACHE_EXPIRATION) {
            setConfig(data);
            setLoading(false);
            return;
          }
        }

        // If no valid cache, fetch from server
        const response = await fetch('/config');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Cache the new config
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now()
        }));

        setConfig(data);
      } catch (e) {
        console.warn('Failed to load config from server, using defaults:', e instanceof Error ? e.message : String(e));
        setError(e instanceof Error ? e.message : String(e));
        // Use default config when backend is not available
        setConfig(DEFAULT_CONFIG);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
};

export default useConfig;