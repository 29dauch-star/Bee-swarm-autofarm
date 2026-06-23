#!/usr/bin/env node

/**
 * Auto Farming Script
 * Direct farming without UI - for background/headless operation
 */

const AutoFarmingEngine = require('../src/engines/AutoFarmingEngine');
const AIDecisionSystem = require('../src/ai/AIDecisionSystem');
const ProgressionTracker = require('../src/tracking/ProgressionTracker');

class AutoFarmingScript {
  constructor() {
    this.engine = new AutoFarmingEngine();
    this.ai = new AIDecisionSystem();
    this.tracker = new ProgressionTracker();
    this.running = false;
  }

  async start(options = {}) {
    const {
      mode = 'smart',
      duration = 0,
      sleepMode = true,
      updateInterval = 10000
    } = options;

    console.log('🐝 Bee Swarm Auto Farmer Script Started');
    console.log(`📋 Mode: ${mode}`);
    console.log(`⏰ Duration: ${duration === 0 ? 'Indefinite' : duration + 'ms'}`);
    console.log(`🤖 AI Enabled: true`);
    console.log(`😴 Sleep Mode: ${sleepMode}`);
    console.log('---');

    this.running = true;
    this.tracker.start();
    this.ai.enable();
    this.engine.start(mode);

    const statusInterval = setInterval(() => {
      if (this.running) {
        this._printStatus();
      }
    }, updateInterval);

    if (duration > 0) {
      setTimeout(() => {
        this.stop();
        clearInterval(statusInterval);
      }, duration);
    }

    process.on('SIGINT', () => {
      console.log('\n\n🛑 Stopping...');
      this.stop();
      clearInterval(statusInterval);
      process.exit(0);
    });
  }

  _printStatus() {
    const stats = this.tracker.getStats();
    const decision = this.ai.getNextDecision();
    
    console.log('\n📊 Farming Status:');
    console.log(`  🍯 Honey: ${stats.honey.toLocaleString()}`);
    console.log(`  ⭐ XP: ${stats.xp.toLocaleString()}`);
    console.log(`  🌼 Nectar: ${stats.nectar.toLocaleString()}`);
    console.log(`  💛 Pollen: ${stats.pollen.toLocaleString()}`);
    console.log(`  ⏱️  Time: ${Math.floor(stats.timeSpent / 1000)}s`);
    
    if (decision) {
      console.log(`\n🤖 AI Decision: ${decision.action}`);
      console.log(`  Confidence: ${(this.ai.getConfidence() * 100).toFixed(1)}%`);
    }
  }

  stop() {
    this.running = false;
    this.engine.stop();
    this.ai.disable();
    this.tracker.pause();
    this.tracker.save();
    console.log('\n✅ Farming session ended');
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--mode') options.mode = args[++i];
    if (args[i] === '--duration') options.duration = parseInt(args[++i]);
    if (args[i] === '--no-ai') options.ai = false;
    if (args[i] === '--no-sleep') options.sleepMode = false;
  }

  const script = new AutoFarmingScript();
  script.start(options);
}

module.exports = AutoFarmingScript;