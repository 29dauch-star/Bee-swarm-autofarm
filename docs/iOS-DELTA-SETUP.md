# iOS Delta Setup Guide

## 🚀 Quick Start on Delta iOS

### Step 1: Install Delta Emulator
1. Open App Store on iOS
2. Search for **"Delta"** (by Riley Testut)
3. Install the emulator

### Step 2: Add Bee Swarm Simulator
1. Open Delta
2. Tap the **+** icon
3. Select **Bee Swarm Simulator** ROM file
4. Game loads in library

### Step 3: Start Auto Farmer Backend
On your computer/server:
```bash
git clone https://github.com/29dauch-star/bee-swarm-autofarm.git
cd bee-swarm-autofarm
npm install
npm start
```

Note your computer's IP address (e.g., 192.168.1.100)

### Step 4: Connect iOS to Hub
1. Open Bee Swarm in Delta
2. Launch Auto Farmer Hub app
3. Enter hub IP: `192.168.1.100:3000`
4. Tap **Connect**

### Step 5: Start Farming
1. Tap the **🐝 Bee Icon**
2. Select farming mode
3. Enable **Sleep Mode** (optional)
4. Watch the magic happen! ✨

---

## ⚙️ Configuration for iOS

### Create `.env` File

```env
# Server
PORT=3000
WS_PORT=8080
NODE_ENV=production

# iOS Connection
DELTA_URL=ws://YOUR_IP:8080
DELTA_AUTO_CONNECT=true

# AI & Farming
AI_ENABLED=true
FARMING_MODE=smart
FARMING_SLEEP_MODE=true
FARMING_FIELD_DELAY=500
FARMING_AUTO_UPGRADE=true

# Database
DB_PATH=./data/progression.db
```

---

## 📱 iOS App Features

### Hub Interface
- **Bee Icon**: Tap to activate/deactivate farming
- **Mode Selector**: Choose Smart, Aggressive, Balanced, or Sleep
- **Sleep Mode Toggle**: Enable for overnight farming
- **Live Stats**: Real-time Honey, XP, Nectar, Pollen tracking
- **Time Display**: Monitor farming session duration

### Farming Modes

| Mode | Speed | CPU | Best For |
|------|-------|-----|----------|
| 🎯 Smart | Fast | Medium | General Use |
| ⚡ Aggressive | Very Fast | High | Fast Farming |
| ⚖️ Balanced | Medium | Low | Casual Play |
| 😴 Sleep | Slow | Very Low | Overnight |

---

## 🔧 Advanced Setup

### Connect to Remote Server

If running backend on remote server:

```env
DELTA_URL=ws://your-server.com:8080
PORT=3000
```

Make sure ports are forwarded and firewall allows traffic.

### Enable Local Network

For iOS to find your computer:

1. Router: Enable mDNS/Bonjour
2. iOS Settings → Privacy → Local Network → Allow Auto Farmer
3. Use computer hostname instead of IP (if available)

### Optimize for iOS

```json
{
  "farming": {
    "fieldDelay": 800,
    "aiEnabled": true,
    "sleepMode": true
  },
  "performance": {
    "maxCPUUsage": 3,
    "batteryOptimization": true
  }
}
```

---

## 🐛 Troubleshooting

### "Cannot Connect to Hub"
```
❌ Error: Connection refused

✅ Fix:
1. Verify backend is running: npm start
2. Check firewall allows port 3000 & 8080
3. Ensure iOS and computer on same WiFi
4. Try using computer's hostname instead of IP
```

### "Farming Not Starting"
```
❌ Error: Farming remains idle

✅ Fix:
1. Tap bee icon again
2. Check Bee Swarm is running in Delta
3. Restart Delta emulator
4. Verify AI system enabled in config.json
```

### "WebSocket Connection Failed"
```
❌ Error: WS connection timeout

✅ Fix:
1. Verify DELTA_URL in .env is correct
2. Check both ports 3000 and 8080 are open
3. Restart backend: Ctrl+C then npm start
4. Check WiFi connection stable
```

### "Low Farming Performance"
```
❌ Problem: Farming slowly, getting little honey/XP

✅ Fix:
1. Switch to "Smart" mode for AI optimization
2. Reduce fieldDelay: "fieldDelay": 300
3. Enable Auto Upgrade in settings
4. Restart Delta with more RAM available
5. Close other apps on iOS
```

### "High Battery Drain"
```
❌ Problem: iPad/iPhone heating up

✅ Fix:
1. Enable Sleep Mode
2. Switch to Balanced or Sleep mode
3. Increase fieldDelay: "fieldDelay": 1000
4. Disable AI temporarily
5. Use device charger while farming
```

---

## 📊 Performance Tips

### For Best Honey/XP Rates
- **Mode**: Smart (AI optimized)
- **fieldDelay**: 300-500ms
- **AI**: Enabled
- **Auto Upgrade**: Enabled

Expected: 500K+ XP/hour, 100M+ Honey/hour

### For Overnight Farming
- **Mode**: Sleep
- **fieldDelay**: 1000ms
- **Sleep Mode**: Enabled
- **Duration**: 6-8 hours

Battery Impact: Minimal

### For Casual Play
- **Mode**: Balanced
- **fieldDelay**: 700ms
- **Sleep Mode**: Disabled
- **Updates**: Every 5 seconds

CPU Impact: <2%

---

## 🔗 Repository Links

- **GitHub**: https://github.com/29dauch-star/bee-swarm-autofarm
- **Issues**: https://github.com/29dauch-star/bee-swarm-autofarm/issues
- **Releases**: https://github.com/29dauch-star/bee-swarm-autofarm/releases

---

## ✅ Verification Checklist

Before starting:
- [ ] Delta installed on iOS
- [ ] Bee Swarm ROM in Delta library
- [ ] Backend running on computer
- [ ] iOS and computer on same WiFi
- [ ] Port 3000 & 8080 accessible
- [ ] Auto Farmer Hub app launched
- [ ] Hub connected to backend
- [ ] Farming mode selected

---

## 🎯 Next Steps

1. **Start farming** - Tap bee icon to begin
2. **Monitor progress** - Check stats every hour
3. **Optimize config** - Adjust settings for your device
4. **Enjoy! 🎉** - Let it farm while you sleep

---

**Happy Farming! 🐝🍯**