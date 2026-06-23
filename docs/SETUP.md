# Setup Guide

## Prerequisites

- Node.js 18+ 
- Python 3.9+
- iOS device with Delta emulator
- Bee Swarm Simulator ROM

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/29dauch-star/bee-swarm-autofarm.git
cd bee-swarm-autofarm
```

### 2. Install Dependencies

```bash
npm install
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=3000
WS_PORT=8080
NODE_ENV=production
DELTA_URL=ws://your-local-ip:8080
FARMING_MODE=smart
```

### 4. Start Auto Farmer Hub

```bash
npm start
```

Server will run on `http://localhost:3000`

## iOS Delta Setup

1. **Install Delta** - Download from App Store
2. **Load Bee Swarm ROM** - Add game to Delta library
3. **Open Auto Farmer App** - Launch from Delta
4. **Connect to Hub** - Enter hub IP address
5. **Start Farming** - Tap bee icon to begin

## Command Line Usage

```bash
# Smart farming indefinite
node scripts/auto_farm.js --mode smart

# Aggressive for 1 hour
node scripts/auto_farm.js --mode aggressive --duration 3600000

# Balanced with sleep mode
node scripts/auto_farm.js --mode balanced
```

## Troubleshooting

**Connection Issues:**
- Verify both devices on same network
- Check firewall allows port 3000 & 8080
- Ensure Delta WebSocket bridge enabled

**Low Farming Rates:**
- Enable AI mode for optimization
- Check field priority in config.json
- Upgrade bees and fields

**Battery Drain:**
- Enable Sleep Mode
- Use balanced mode instead of aggressive
- Reduce field scan delay in config.json

## Next Steps

See [USAGE.md](USAGE.md) for detailed usage guide.