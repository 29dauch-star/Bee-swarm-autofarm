/**
 * Progression Tracker
 * Tracks farming progress, resources, and achievements
 */

class ProgressionTracker {
  constructor() {
    this.running = false;
    this.stats = {
      honey: 0,
      xp: 0,
      nectar: 0,
      pollen: 0,
      beesUnlocked: 0,
      fieldLevels: {},
      timeSpent: 0,
      sessionsCompleted: 0
    };
    this.startTime = null;
    this.sessionStart = null;
  }

  start() {
    this.running = true;
    this.sessionStart = Date.now();
    this.startTime = new Date().toISOString();
    console.log('[ProgressionTracker] Session started');
  }

  pause() {
    this.running = false;
    if (this.sessionStart) {
      const duration = Date.now() - this.sessionStart;
      this.stats.timeSpent += duration;
      this.stats.sessionsCompleted++;
    }
    console.log('[ProgressionTracker] Session paused');
  }

  addResource(type, amount, source) {
    if (this.stats[type] !== undefined) {
      this.stats[type] += amount;
      console.log(`[Resources] +${amount} ${type} from ${source}`);
    }
  }

  unlockBee(beeId, beeData) {
    this.stats.beesUnlocked++;
    console.log(`[Achievement] Unlocked bee: ${beeId}`);
  }

  upgradeBee(beeId, level) {
    console.log(`[Upgrade] Bee ${beeId} upgraded to level ${level}`);
  }

  upgradeField(fieldId, level) {
    this.stats.fieldLevels[fieldId] = level;
    console.log(`[Upgrade] Field ${fieldId} upgraded to level ${level}`);
  }

  getStats() {
    return {
      ...this.stats,
      sessionDuration: this.sessionStart ? Date.now() - this.sessionStart : 0
    };
  }

  getDetailedStats() {
    return {
      resources: {
        honey: this.stats.honey,
        xp: this.stats.xp,
        nectar: this.stats.nectar,
        pollen: this.stats.pollen
      },
      progression: {
        beesUnlocked: this.stats.beesUnlocked,
        fieldLevels: this.stats.fieldLevels
      },
      farming: {
        timeSpent: this.stats.timeSpent,
        sessionsCompleted: this.stats.sessionsCompleted,
        averageSessionDuration: this.stats.sessionsCompleted > 0 
          ? this.stats.timeSpent / this.stats.sessionsCompleted 
          : 0
      },
      rates: {
        honeyPerHour: this._calculateRate('honey'),
        xpPerHour: this._calculateRate('xp'),
        nectarPerHour: this._calculateRate('nectar'),
        pollenPerHour: this._calculateRate('pollen')
      }
    };
  }

  _calculateRate(type) {
    if (this.stats.timeSpent === 0) return 0;
    const hours = this.stats.timeSpent / (1000 * 60 * 60);
    return (this.stats[type] / hours).toFixed(0);
  }

  async save() {
    console.log('[ProgressionTracker] Session saved');
  }

  async getHistory(limit = 10) {
    return [];
  }
}

module.exports = ProgressionTracker;