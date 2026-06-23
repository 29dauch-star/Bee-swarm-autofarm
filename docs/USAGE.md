# Usage Guide

## Getting Started

### 1. Start the Backend Hub

```bash
npm start
```

Hub runs on port 3000, WebSocket on port 8080

### 2. Launch on iOS/Delta

1. Open Delta emulator
2. Launch Bee Swarm Simulator
3. Open Auto Farmer Hub app
4. Tap **Bee Icon** to activate farming

## Farming Modes

### 🎯 Smart (Recommended)
- AI analyzes field state
- Makes optimal decisions
- Best XP/hour & Honey/hour
- Moderate CPU usage

**Best for:** Most players

### ⚡ Aggressive
- Goes after EVERYTHING
- Maximum resource collection
- High CPU usage
- Fast progression

**Best for:** High-end devices

### ⚖️ Balanced
- Moderate farming rate
- Lower CPU/battery usage
- Good progression pace
- Stable performance

**Best for:** Casual play

### 😴 Sleep
- Minimal CPU usage
- Passive farming
- Battery efficient
- Overnight farming

**Best for:** AFK farming

## API Endpoints

### Get Status
```bash
curl http://localhost:3000/api/status
```

### Start Farming
```bash
curl -X POST http://localhost:3000/api/start \
  -H "Content-Type: application/json" \
  -d '{"mode":"smart","sleepMode":true}'
```

### Stop Farming
```bash
curl -X POST http://localhost:3000/api/stop
```

### Get Progression Stats
```bash
curl http://localhost:3000/api/progression
```

### Get AI Decision
```bash
curl http://localhost:3000/api/ai/decision
```

## Configuration

Edit `config.json`:

```json
{
  "farming": {
    "mode": "smart",
    "sleepMode": true,
    "fieldDelay": 500,
    "aiEnabled": true,
    "autoUpgrade": true,
    "resourcePriority": ["honey", "xp", "nectar", "pollen"]
  }
}
```

## Command Line Farming

```bash
# Run indefinite smart farming
node scripts/auto_farm.js

# 2-hour aggressive session
node scripts/auto_farm.js --mode aggressive --duration 7200000

# Disable AI
node scripts/auto_farm.js --mode balanced --no-ai

# Disable sleep mode
node scripts/auto_farm.js --no-sleep
```

## Performance Optimization

### Maximize Honey/XP
- Use **Smart** mode (AI optimized)
- Enable **Auto Upgrade**
- Set `fieldDelay: 300` (fast scanning)
- Upgrade your bees & fields in-game

### Minimize Battery Drain
- Use **Sleep** mode
- Enable **Sleep Mode** toggle
- Reduce field delay to 1000ms
- Close other apps

### Best Overnight Farming
- Set mode to **Sleep**
- Enable Sleep Mode
- Use Balanced resource priority
- Let run 6-8 hours

## Monitoring Progress

Check stats every hour:

```bash
curl http://localhost:3000/api/progression | python -m json.tool
```

Watch for:
- Honey/hour rate
- XP/hour rate
- Total bees unlocked
- Field level progression

## Troubleshooting

### "Connection Failed"
```bash
# Check if backend is running
curl http://localhost:3000/api/status

# Restart backend
npm start

# Check firewall ports 3000 & 8080 open
```

### "Low Farming Rate"
- Verify AI enabled in config
- Check resource priority setting
- Ensure in-game bees are upgraded
- Try aggressive mode for faster farming

### "High CPU Usage"
- Switch to balanced or sleep mode
- Increase field delay: `"fieldDelay": 1000`
- Close other apps
- Restart Delta emulator

### "Stuck/Not Progressing"
- Check if WebSocket connection active
- Verify Bee Swarm window is in focus
- Restart auto farmer hub
- Check game hasn't timed out

## Advanced Tips

1. **Multi-Tab Farming** - Run on multiple devices simultaneously
2. **Custom Priority** - Reorder `resourcePriority` for your goals
3. **Scheduled Farming** - Use cron jobs to auto-start at specific times
4. **API Integration** - Build custom dashboards using REST API
5. **Performance Tuning** - Adjust `fieldDelay` based on device specs

## Getting Help

- 📖 Check [SETUP.md](SETUP.md)
- 🐛 Report issues on GitHub: https://github.com/29dauch-star/bee-swarm-autofarm/issues
- 💬 View README for overview
- ⚙️ Edit config.json for customization

---

**Happy Farming! 🐝**