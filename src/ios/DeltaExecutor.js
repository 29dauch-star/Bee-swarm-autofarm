/**
 * Delta iOS Executor
 * Handles communication with Delta emulator on iOS
 */

const WebSocket = require('ws');

class DeltaExecutor {
  constructor() {
    this.connected = false;
    this.deltaURL = process.env.DELTA_URL || 'ws://localhost:8080';
    this.ws = null;
    this.messageHandlers = {};
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.deltaURL);
        
        this.ws.on('open', () => {
          this.connected = true;
          console.log('[Delta] Connected to iOS emulator');
          resolve();
        });
        
        this.ws.on('message', (data) => {
          this._handleMessage(data);
        });
        
        this.ws.on('error', (error) => {
          console.error('[Delta] Connection error:', error);
          reject(error);
        });
        
        this.ws.on('close', () => {
          this.connected = false;
          console.log('[Delta] Disconnected from iOS emulator');
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  sendCommand(command, params = {}) {
    if (!this.connected) {
      throw new Error('Delta executor not connected');
    }
    
    const message = {
      type: 'command',
      command,
      params,
      timestamp: Date.now()
    };
    
    this.ws.send(JSON.stringify(message));
  }

  tap(x, y, duration = 100) {
    return this.sendCommand('tap', { x, y, duration });
  }

  swipe(fromX, fromY, toX, toY, duration = 500) {
    return this.sendCommand('swipe', { fromX, fromY, toX, toY, duration });
  }

  takeScreenshot() {
    return this.sendCommand('screenshot');
  }

  getGameState() {
    return this.sendCommand('get_game_state');
  }

  analyzeScreen() {
    return this.sendCommand('analyze_screen');
  }

  clickElement(elementId) {
    return this.sendCommand('click_element', { elementId });
  }

  _handleMessage(data) {
    try {
      const message = JSON.parse(data);
      console.log('[Delta] Message received:', message.type);
      
      if (this.messageHandlers[message.type]) {
        this.messageHandlers[message.type](message);
      }
    } catch (error) {
      console.error('[Delta] Message parse error:', error);
    }
  }

  on(type, handler) {
    this.messageHandlers[type] = handler;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.connected = false;
    }
  }

  isConnected() {
    return this.connected;
  }
}

module.exports = DeltaExecutor;