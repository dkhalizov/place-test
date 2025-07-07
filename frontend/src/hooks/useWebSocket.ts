import { useCallback, useEffect, useRef, useState } from 'react';
import { 
  WS_RECONNECT_DELAY, 
  WS_MAX_RECONNECT_ATTEMPTS, 
  WS_RECONNECT_BACKOFF_FACTOR, 
  WS_MAX_RECONNECT_DELAY,
  WS_MESSAGE_TYPES,
  API_ENDPOINTS
} from '../constants';

interface WebSocketMessage {
  type: number;
  data: ArrayBuffer;
  view: DataView;
}

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  reconnectAttempts: number;
}

interface UseWebSocketReturn {
  connectionState: WebSocketState;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (data: any) => boolean;
  resetConnection: () => void;
}

const useWebSocket = (
  token: string | null, 
  onMessage?: (message: WebSocketMessage) => void, 
  enabled: boolean = true
): UseWebSocketReturn => {
  const [connectionState, setConnectionState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    reconnectAttempts: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectDelayRef = useRef(WS_RECONNECT_DELAY);
  const isManuallyClosedRef = useRef(false);

  const getWebSocketUrl = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}${API_ENDPOINTS.WEBSOCKET}?token=${token}`;
  }, [token]);

  const disconnect = useCallback(() => {
    isManuallyClosedRef.current = true;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setConnectionState({
      isConnected: false,
      isConnecting: false,
      error: null,
      reconnectAttempts: 0,
    });
    
    reconnectAttemptsRef.current = 0;
    reconnectDelayRef.current = WS_RECONNECT_DELAY;
  }, []);

  const connect = useCallback(() => {
    if (!enabled || !token || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    isManuallyClosedRef.current = false;
    
    setConnectionState(prev => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    try {
      const ws = new WebSocket(getWebSocketUrl());
      wsRef.current = ws;

      ws.binaryType = 'arraybuffer';

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnectionState({
          isConnected: true,
          isConnecting: false,
          error: null,
          reconnectAttempts: reconnectAttemptsRef.current,
        });
        
        // Reset reconnection parameters on successful connection
        reconnectAttemptsRef.current = 0;
        reconnectDelayRef.current = WS_RECONNECT_DELAY;
      };

      ws.onmessage = (event) => {
        try {
          if (event.data instanceof ArrayBuffer) {
            const view = new DataView(event.data);
            const messageType = view.getUint8(0);
            
            const messageData: WebSocketMessage = {
              type: messageType,
              data: event.data,
              view: view,
            };
            
            onMessage?.(messageData);
          } else {
            console.warn('Received non-binary message:', event.data);
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionState(prev => ({
          ...prev,
          isConnecting: false,
          error: 'Connection error occurred',
        }));
      };

      ws.onclose = (event) => {
        wsRef.current = null;
        
        setConnectionState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
        }));

        // Only attempt to reconnect if not manually closed and we haven't exceeded max attempts
        if (!isManuallyClosedRef.current && 
            reconnectAttemptsRef.current < WS_MAX_RECONNECT_ATTEMPTS &&
            enabled) {
          
          reconnectAttemptsRef.current++;
          const delay = Math.min(
            reconnectDelayRef.current * Math.pow(WS_RECONNECT_BACKOFF_FACTOR, reconnectAttemptsRef.current - 1),
            WS_MAX_RECONNECT_DELAY
          );
          
          console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${WS_MAX_RECONNECT_ATTEMPTS})`);
          
          setConnectionState(prev => ({
            ...prev,
            reconnectAttempts: reconnectAttemptsRef.current,
          }));
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else if (reconnectAttemptsRef.current >= WS_MAX_RECONNECT_ATTEMPTS) {
          setConnectionState(prev => ({
            ...prev,
            error: 'Unable to connect after multiple attempts. Please refresh the page.',
          }));
        }
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionState(prev => ({
        ...prev,
        isConnecting: false,
        error: 'Failed to establish connection',
      }));
    }
  }, [enabled, token, getWebSocketUrl, onMessage]);

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
      return true;
    }
    return false;
  }, []);

  const resetConnection = useCallback(() => {
    disconnect();
    if (enabled && token) {
      setTimeout(() => {
        connect();
      }, 100);
    }
  }, [disconnect, connect, enabled, token]);

  // Handle connection when token or enabled state changes
  useEffect(() => {
    if (enabled && token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, token, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionState,
    connect,
    disconnect,
    sendMessage,
    resetConnection,
  };
};

export default useWebSocket; 