class WebSocketManager {
  constructor() {
    this.baseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
    this.connections = new Map(); // channel -> WebSocket
    this.listeners = new Map();   // channel -> Set of callbacks
    this.reconnectAttempts = new Map(); // channel -> number
    this.maxReconnectDelay = 30000;
    this.pingIntervals = new Map();
  }

  connect(channel) {
    if (this.connections.has(channel)) {
      const ws = this.connections.get(channel);
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        return () => this.disconnect(channel);
      }
    }

    const url = `${this.baseUrl}/${channel}`;
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log(`[WS] Connected to ${channel}`);
      this.reconnectAttempts.set(channel, 0);
      
      // Setup ping heartbeat every 30s
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000);
      this.pingIntervals.set(channel, pingInterval);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const callbacks = this.listeners.get(channel) || new Set();
        callbacks.forEach(cb => cb(data));
      } catch (error) {
        console.error(`[WS] Message parse error on ${channel}:`, error);
      }
    };

    ws.onclose = () => {
      console.log(`[WS] Disconnected from ${channel}`);
      this.cleanup(channel);
      this.scheduleReconnect(channel);
    };

    ws.onerror = (error) => {
      console.error(`[WS] Error on ${channel}:`, error);
    };

    this.connections.set(channel, ws);

    return () => this.disconnect(channel);
  }

  onMessage(channel, callback) {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }
    this.listeners.get(channel).add(callback);
    return () => this.listeners.get(channel).delete(callback);
  }

  disconnect(channel) {
    const ws = this.connections.get(channel);
    if (ws) {
      ws.onclose = null; // Prevent reconnect
      ws.close();
      this.cleanup(channel);
      this.connections.delete(channel);
      this.listeners.delete(channel);
    }
  }

  cleanup(channel) {
    if (this.pingIntervals.has(channel)) {
      clearInterval(this.pingIntervals.get(channel));
      this.pingIntervals.delete(channel);
    }
  }

  scheduleReconnect(channel) {
    const attempts = this.reconnectAttempts.get(channel) || 0;
    const delay = Math.min(1000 * Math.pow(2, attempts), this.maxReconnectDelay);
    
    console.log(`[WS] Reconnecting to ${channel} in ${delay}ms...`);
    
    setTimeout(() => {
      this.reconnectAttempts.set(channel, attempts + 1);
      this.connect(channel);
    }, delay);
  }
}

export const wsManager = new WebSocketManager();
