import { useState, useEffect, useCallback, useRef } from 'react';
import type { SlotsData, WebSocketMessage } from '../types';

export const useWebSocket = () => {
  const [slotsData, setSlotsData] = useState<SlotsData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | undefined>(undefined);
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket('wss://rerobackend.anga.codes/slot-booking');
      
      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          if (message.type === 'slots_update' && message.data) {
            setSlotsData(message.data);
          } else if (message.type === 'booking_response' || message.type === 'cancellation_response') {
            // Handle booking/cancellation responses
            console.log(`${message.type}:`, message.message);
          } else if (message.type === 'error') {
            setError(message.message || 'Unknown error occurred');
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < 5) {
          const timeout = Math.pow(2, reconnectAttempts.current) * 1000;
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, timeout);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error');
      };
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setError('Failed to connect');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    setIsConnected(false);
  }, []);

  const bookSlot = useCallback((slotId: number) => {
    const email = localStorage.getItem('user_email');
    const password = localStorage.getItem('user_password');
    
    if (ws.current && ws.current.readyState === WebSocket.OPEN && email && password) {
      const message: WebSocketMessage = {
        type: 'book_slot',
        slot_id: slotId,
        email,
        password,
      };
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  const cancelSlot = useCallback((slotId: number) => {
    const email = localStorage.getItem('user_email');
    const password = localStorage.getItem('user_password');
    
    if (ws.current && ws.current.readyState === WebSocket.OPEN && email && password) {
      const message: WebSocketMessage = {
        type: 'cancel_slot',
        slot_id: slotId,
        email,
        password,
      };
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  const refreshSlots = useCallback(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: 'get_slots',
      };
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    slotsData,
    isConnected,
    error,
    bookSlot,
    cancelSlot,
    refreshSlots,
    connect,
    disconnect,
  };
};
