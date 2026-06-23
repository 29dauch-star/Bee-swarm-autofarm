/**
 * Bee Swarm Auto Farmer - Main Entry Point
 * Initializes the hub interface and farming engine
 */

const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const AutoFarmingEngine = require('./engines/AutoFarmingEngine');
const AIDecisionSystem = require('./ai/AIDecisionSystem');
const ProgressionTracker = require('./tracking/ProgressionTracker');
const DeltaExecutor = require('./ios/DeltaExecutor');

const app = express();
const PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize systems
const farmingEngine = new AutoFarmingEngine();
const aiSystem = new AIDecisionSystem();
const progressionTracker = new ProgressionTracker();
const deltaExecutor = new DeltaExecutor();

let isRunning = false;

// REST API Endpoints

/**
 * GET /api/status
 * Returns current farming status and statistics
 */
app.get('/api/status', (req, res) => {
  res.json({
    running: isRunning,
    engine: farmingEngine.getStatus(),
    progress: progressionTracker.getStats(),
    ai: aiSystem.getStatus(),
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/start
 * Start auto farming with specified mode
 */
app.post('/api/start', (req, res) => {
  const { mode = 'smart', sleepMode = true } = req.body;
  
  try {
    isRunning = true;
    farmingEngine.start(mode);
    aiSystem.enable();
    progressionTracker.start();
    
    res.json({
      success: true,
      message: `Auto farming started in ${mode} mode`,
      mode,
      sleepMode,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/stop
 * Stop auto farming
 */
app.post('/api/stop', (req, res) => {
  try {
    isRunning = false;
    farmingEngine.stop();
    aiSystem.disable();
    progressionTracker.pause();
    
    res.json({
      success: true,
      message: 'Auto farming stopped',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/progression
 * Get detailed progression statistics
 */
app.get('/api/progression', (req, res) => {
  res.json(progressionTracker.getDetailedStats());
});

/**
 * GET /api/ai/decision
 * Get AI's current decision
 */
app.get('/api/ai/decision', (req, res) => {
  const decision = aiSystem.getNextDecision();
  res.json({
    decision,
    confidence: aiSystem.getConfidence(),
    alternatives: aiSystem.getAlternatives()
  });
});

/**
 * POST /api/config
 * Update configuration
 */
app.post('/api/config', (req, res) => {
  try {
    const config = req.body;
    farmingEngine.updateConfig(config);
    res.json({ success: true, config });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/field/analyze
 * Analyze current field state
 */
app.post('/api/field/analyze', (req, res) => {
  try {
    const analysis = aiSystem.analyzeField();
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// WebSocket Server for real-time communication
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('connection', (ws) => {
  console.log('[WS] Client connected from iOS/Delta');
  
  // Send initial status
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'Auto Farmer Hub connected',
    version: '1.0.0'
  }));
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleWebSocketMessage(ws, data);
    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', message: error.message }));
    }
  });
  
  ws.on('close', () => {
    console.log('[WS] Client disconnected');
  });
});

function handleWebSocketMessage(ws, data) {
  const { type, payload } = data;
  
  switch (type) {
    case 'start':
      isRunning = true;
      farmingEngine.start(payload.mode || 'smart');
      ws.send(JSON.stringify({ type: 'farming_started', payload }));
      break;
      
    case 'stop':
      isRunning = false;
      farmingEngine.stop();
      ws.send(JSON.stringify({ type: 'farming_stopped' }));
      break;
      
    case 'get_status':
      ws.send(JSON.stringify({
        type: 'status',
        payload: {
          running: isRunning,
          engine: farmingEngine.getStatus(),
          progress: progressionTracker.getStats()
        }
      }));
      break;
      
    case 'field_action':
      const result = farmingEngine.performAction(payload);
      ws.send(JSON.stringify({ type: 'action_result', payload: result }));
      break;
      
    default:
      ws.send(JSON.stringify({ type: 'unknown_command', payload: data }));
  }
}

// Broadcast status to all connected clients every 5 seconds
setInterval(() => {
  if (isRunning) {
    const status = {
      type: 'status_update',
      payload: {
        running: isRunning,
        stats: progressionTracker.getStats(),
        engineStatus: farmingEngine.getStatus()
      }
    };
    
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(status));
      }
    });
  }
}, 5000);

// Start HTTP Server
app.listen(PORT, () => {
  console.log(`🐝 Bee Swarm Auto Farmer Hub listening on port ${PORT}`);
  console.log(`🔌 WebSocket server listening on port ${WS_PORT}`);
  console.log(`🤖 AI Decision System ready`);
  console.log(`📊 Progression Tracker active`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Auto Farmer...');
  if (isRunning) {
    farmingEngine.stop();
  }
  progressionTracker.save();
  wss.close();
  process.exit(0);
});

module.exports = { app, wss, farmingEngine, aiSystem, progressionTracker };