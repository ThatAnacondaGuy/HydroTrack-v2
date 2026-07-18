# 🌊 HydroTrack v3.0 — Municipal Authority Command Center

**Real-time IoT water network monitoring for smart city infrastructure**

> A full-stack command center dashboard for municipal water authorities to monitor consumption, detect acoustic anomalies (micro-leaks, water hammer, pipe cavitation), track water quality (TDS/UV-C), and respond to thermal hazards — all in real time via ESP32 edge sensors and MQTT telemetry.

---

## 🏗️ Architecture

```
ESP32-S3 Edge Node (C++/ESP-IDF)
    │  ESP-NOW (MAC-to-MAC, connectionless)
    ▼
ESP32 Gateway (Wi-Fi → MQTT)
    │  JSON telemetry via MQTT
    ▼
HiveMQ / Mosquitto Broker
    ├──► React Frontend (MQTT.js WebSocket — LIVE updates, zero-latency)
    └──► Node.js Backend (MQTT subscriber — ingestion + persistence + alerts)
              │
              ▼
        InfluxDB (time-series store)
              │
              ▼
        Express REST API ──► React Frontend (historical data, auth, CRUD)
```

---

## 🚀 Quick Start (< 5 minutes)

### Prerequisites
- **Docker** & **Docker Compose** installed
- **Node.js 20+** (for seed scripts outside Docker)

### Option A: Docker (Recommended — One Command)

```bash
# 1. Clone and enter the project
cd hydroFE

# 2. Start all services
docker-compose up

# 3. (In another terminal) Install seed script deps & seed historical data
npm install
npm run seed:history

# 4. Start live data stream
npm run seed:live
```

### Option B: Manual (Without Docker)

You'll need **InfluxDB 2.x** and a **Mosquitto MQTT broker** running locally.

```bash
# Terminal 1: Start InfluxDB (port 8086)
# Terminal 2: Start Mosquitto (ports 1883 + 9001)

# Terminal 3: Backend
cd apps/backend
cp .env.example .env     # Edit with your InfluxDB/MQTT settings
npm install
npm run dev              # → http://localhost:3001

# Terminal 4: Frontend
cd apps/frontend
cp .env.example .env
npm install
npm run dev              # → http://localhost:5173

# Terminal 5: Seed data
npm install              # (from root)
npm run seed:history     # One-time: backfill 30 days
npm run seed:live        # Ongoing: live telemetry stream
```

---

## 🔐 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Engineer** | `engineer@hydrotrack.in` | `hydro2026` |
| **Admin** | `admin@hydrotrack.in` | `admin2026` |

---

## 🌐 Service Ports

| Service | Port | URL |
|---------|------|-----|
| **Frontend** (Vite) | 5173 | http://localhost:5173 |
| **Backend** (Express) | 3001 | http://localhost:3001 |
| **InfluxDB** UI | 8086 | http://localhost:8086 |
| **Mosquitto** MQTT | 1883 | `mqtt://localhost:1883` |
| **Mosquitto** WebSocket | 9001 | `ws://localhost:9001` |

---

## 📡 MQTT Topics

```
hydrotrack/{zone}/{device_id}/telemetry    — Raw sensor data
hydrotrack/{zone}/{device_id}/alert        — Classified hazard events
hydrotrack/{zone}/{device_id}/status       — Device heartbeat/battery
```

---

## 📊 Dashboard Pages

| Page | Route | Description |
|------|-------|-------------|
| **Dashboard** | `/dashboard` | KPI strip, GIS mini-map, live alerts, consumption trend |
| **GIS Heatmap** | `/gis-heatmap` | Full-screen map with device markers & detail drawer |
| **Acoustic Ledger** | `/acoustic-ledger` | Anomaly table with filters, pagination, CSV export |
| **Water Quality** | `/water-quality` | TDS gauges, UV-C uptime, compliance trend |
| **Thermal Hazards** | `/thermal-hazards` | Active hazard cards, incident history |
| **Device Fleet** | `/device-fleet` | Full device list with status |
| **Zones** | `/zones` | Ward-level aggregate stats |

---

## 🔌 REST API

All endpoints require `Authorization: Bearer <JWT>` except `/api/auth/login`.

### Auth
- `POST /api/auth/login` — Get JWT token
- `POST /api/auth/refresh` — Refresh token
- `GET /api/auth/me` — Current user profile

### Dashboard
- `GET /api/dashboard/summary` — KPI strip data
- `GET /api/dashboard/trend?start=&stop=` — Consumption trend

### Devices
- `GET /api/devices` — Fleet list (filterable)
- `GET /api/devices/geo` — Device map markers
- `GET /api/devices/:id` — Device detail

### Anomalies
- `GET /api/anomalies?page=&limit=&type=&status=&zone=` — Paginated list
- `PATCH /api/anomalies/:id/status` — Acknowledge/resolve
- `GET /api/anomalies/export` — CSV download

### Water Quality
- `GET /api/water-quality/summary` — City-wide TDS & compliance
- `GET /api/water-quality/trend` — 30-day TDS trend
- `GET /api/water-quality/devices` — Per-device compliance

### Thermal Hazards
- `GET /api/thermal-hazards` — Active + historical events
- `PATCH /api/thermal-hazards/:id/ack` — Acknowledge hazard

### Zones
- `GET /api/zones` — Zone list with stats

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Zustand, MQTT.js, Recharts, React Router v6 |
| **Backend** | Node.js, Express, TypeScript, Zod, JWT, bcrypt, Pino |
| **Database** | InfluxDB 2.x (Flux queries) |
| **Messaging** | MQTT 3.1.1 via Mosquitto (HiveMQ stand-in) |
| **Infra** | Docker, Docker Compose |

---

## 📁 Project Structure

```
hydroFE/
├── apps/
│   ├── backend/
│   │   └── src/
│   │       ├── config/          # env.ts, thresholds.ts
│   │       ├── db/              # influxClient.ts, queries/
│   │       ├── mqtt/            # mqttClient.ts, payloadSchema.ts, ingestHandler.ts
│   │       ├── services/        # alertRules.ts, authService.ts
│   │       ├── routes/          # auth, dashboard, devices, anomalies, waterQuality, thermalHazards, zones
│   │       ├── middleware/      # authMiddleware.ts, errorHandler.ts, validateRequest.ts
│   │       ├── types/           # telemetry.types.ts
│   │       ├── app.ts           # Express assembly
│   │       └── server.ts        # Entrypoint (Express + MQTT)
│   └── frontend/
│       └── src/
│           ├── pages/           # Dashboard, GIS, Acoustic, WaterQuality, Thermal, etc.
│           ├── components/      # layout/ (TopNav, SideNav, AppLayout) + ui/ (StatusPill, etc.)
│           ├── store/           # useTelemetryStore.ts, useAuthStore.ts
│           ├── lib/             # mqttClient.ts, apiClient.ts
│           └── hooks/           # useLiveTelemetry.ts, useAuthGuard.ts
├── scripts/
│   ├── seedDemoData.ts          # Live MQTT publisher
│   └── seedHistoricalData.ts    # InfluxDB backfill
├── mosquitto/
│   └── mosquitto.conf
├── docker-compose.yml
└── README.md
```

---

## 🏆 Built for Smart India Hackathon 2026

**Team**: HydroTrack | **Problem Statement**: Real-time municipal water network monitoring with IoT edge computing
