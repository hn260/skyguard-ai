# SKYGUARD AI — Autonomous Weather Station Quality Intelligence

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Production-success?style=for-the-badge&logo=vercel)](https://skyguard-ai-xi.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-hn260%2Fskyguard--ai-blue?style=for-the-badge&logo=github)](https://github.com/hn260/skyguard-ai)
[![Python FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React Vite TS](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%20%7C%20TS-61DAFB?style=for-the-badge&logo=react)](https://vitejs.dev)

> **"SKYGUARD doesn't just detect unusual weather — it determines whether the weather station itself is telling the truth."**

---

## 🌐 Live Links

- 🚀 **Live Production Web App**: [https://skyguard-ai-xi.vercel.app](https://skyguard-ai-xi.vercel.app)
- 🔌 **Production Health API**: [https://skyguard-ai-xi.vercel.app/api/health](https://skyguard-ai-xi.vercel.app/api/health)
- 🐙 **GitHub Source Code**: [https://github.com/hn260/skyguard-ai](https://github.com/hn260/skyguard-ai)

---

## 🎯 Executive Summary

**SKYGUARD AI** is an autonomous quality-control and physical fault disambiguation system engineered for high-reliability meteorological observation networks. Using hourly observations from **NOAA GHCNh (Global Historical Climatology Network-hourly)** station USW00014739 (Boston Logan International Airport), SKYGUARD continuously monitors Temperature, Relative Humidity, and Barometric Pressure telemetry.

When an anomaly occurs, SKYGUARD uses a multi-layer explainable physics ensemble to distinguish between:
1. **Physical Sensor Faults**: Temperature sensor drift, ADC binding/freezing, zero-point offset/bias, transient electrical spikes, and missing data frames.
2. **Legitimate Extreme Weather Events**: Rapid synoptic warm fronts, convective storms, or thermal shifts where multi-sensor parameters move in thermodynamic harmony ($\Delta RH \approx -2.2 \times \Delta Temp$).

---

## ✨ Core Capabilities & Features

- **Explainable Anomaly Detection Ensemble**: Combines physical domain boundary checks, 1-step derivative rate-of-change limits, rolling window Z-scores, persistence checks (frozen sensor), Isolation Forest unsupervised outlier scores, and thermodynamic cross-variable coherence equations into a single 0.0–1.0 score.
- **Dynamic Fault Classification & Explainer**: Classifies anomalies into `NORMAL`, `SPIKE`, `DROP`, `DRIFT`, `BIAS`, `STUCK_SENSOR`, `NOISE`, `MISSING_DATA`, and `GENUINE_WEATHER_EVENT`. Produces human-readable evidence bullet points and actionable maintenance recommendations.
- **Self-Healing Value Reconstruction**: Preserves raw telemetry intact in an immutable log while publishing expected baselines, reconstructed corrected values, and quality flags (`OK`, `SUSPECT`, `BAD`, `CORRECTED`, `IMPUTED`).
- **Dynamic Station & Sensor Health Metrics**: Computes real-time 0–100 composite health scores (`overall_health`, `temperature_health`, `humidity_health`, `pressure_health`, `data_quality`) and risk indicators (`OPTIMAL`, `MONITOR`, `MAINTENANCE_REQUIRED`, `CRITICAL`).
- **Interactive Command Center UI**: Built with React, Vite, TypeScript, Tailwind CSS, Lucide icons, and Recharts, featuring a dark meteorological defense aesthetic.
- **One-Click Automated Demo Mode**: Programmatically executes a 9-step walkthrough demonstrating healthy operation, sensor drift injection, anomaly detection, self-healing value reconstruction, station reset, genuine weather front verification, and ML benchmark evaluation.

---

## 📐 System Architecture

```
                          [ NOAA GHCNh Hourly Dataset ]
                                       ↓
                    [ Ingestion & Local CSV Cache ]
                                       ↓
                [ Offline Weather Stream Replay Engine ]
                                       ↓
             [ Synthetic Fault Injection & Ground Truth ]
                                       ↓
       [ Multi-Layer Anomaly Engine (Physical, Z-Score, Rate, IsoForest) ]
                                       ↓
        [ Rule & Score-based Fault Classifier + Dynamic Explainer ]
                                       ↓
           [ Self-Healing Reconstruction (Observed/Expected/Corrected) ]
                                       ↓
             [ Dynamic Station & Sensor Health HUD Metrics ]
                                       ↓
       [ React + TypeScript + Tailwind + Recharts Command Center UI ]
```

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Lucide Icons.
- **Backend**: Python 3.11/3.12, FastAPI, Uvicorn, Pandas, NumPy, Scikit-learn (IsolationForest), SciPy.
- **Serverless Runtime**: Vercel Python Function (`api/index.py`).
- **Environment & Package Management**: `uv`, `npm`.

---

## 📂 Project Structure

```
skyguard-ai/
├── api/
│   └── index.py                 # Vercel serverless Python ASGI entrypoint
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI router & API endpoints
│   │   ├── data_ingestion.py    # NOAA GHCNh dataset fetcher & cache
│   │   ├── stream_engine.py     # Simulation stream engine
│   │   ├── fault_injector.py    # Synthetic fault & genuine front generator
│   │   ├── anomaly_engine.py    # Multi-layer explainable ensemble
│   │   ├── classifier.py        # Fault classification & evidence builder
│   │   ├── reconstructor.py     # Self-healing value estimator
│   │   ├── health_monitor.py    # Dynamic 0-100 station health metrics
│   │   ├── demo_runner.py       # Deterministic Demo Mode controller
│   │   └── evaluator.py         # Ground-truth ML benchmark generator
│   ├── start_backend.py         # Backend startup script
│   ├── test_backend.py          # Automated verification script
│   ├── verify_api.py            # API integration test suite
│   └── verify_drift.py          # Drift & weather scenario test suite
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── MetricCards.tsx
│   │   │   ├── TelemetryCharts.tsx
│   │   │   ├── AIDiagnosisPanel.tsx
│   │   │   ├── AnomalyTimeline.tsx
│   │   │   ├── FaultLab.tsx
│   │   │   ├── StationHealthPanel.tsx
│   │   │   ├── EvaluationModal.tsx
│   │   │   └── DemoBanner.tsx
│   │   ├── types/skyguard.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
├── data/
│   └── noaa_station_data.csv    # Local cached NOAA station hourly data
├── vercel.json                  # Vercel deployment rewrites & static config
├── requirements.txt             # Root requirements for Vercel Python runtime
├── .gitignore
└── README.md
```

---

## 💻 Local Setup & Running Locally

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.11+) or `uv` package manager

### 1. Launch FastAPI Backend Server
```bash
cd backend
# Using uv (recommended)
uv venv .venv --python 3.11
.venv\Scripts\activate
uv pip install fastapi uvicorn pandas numpy scikit-learn requests pydantic
python start_backend.py
```
*Backend runs locally on http://127.0.0.1:8000*

### 2. Launch React Command Center Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs locally on http://localhost:3000*

---

## ☁️ Deploying to Vercel

SkyGuard AI is configured for instant Vercel deployment out of the box:

```bash
npx vercel --prod
```

Vercel reads `vercel.json` and routes `/api/*` requests to `api/index.py` (FastAPI backend) while building the React Vite frontend static assets to `frontend/dist`.

---

## 📡 API Specification

- `GET  /api/health`: Operational status & station metadata.
- `GET  /api/station`: Composite station health scores & active fault state.
- `GET  /api/timeseries`: Telemetry history for charts (observed, expected, corrected, anomaly scores).
- `GET  /api/anomalies`: Active anomaly classification, confidence, evidence list, and recommendation.
- `GET  /api/metrics`: Ground-truth benchmark evaluation metrics (Precision, Recall, F1, FPR).
- `POST /api/inject-fault`: Inject custom synthetic fault (Spike, Drop, Drift, Bias, Stuck, Noise, Missing).
- `POST /api/reset`: Reset station baseline.
- `POST /api/demo`: Trigger automated 9-step walkthrough.
- `POST /api/tick`: Advance weather simulation by 1 tick.

---

## 📈 ML Evaluation Benchmark

Calculated on 150 ground-truth synthetic fault injection ticks + genuine weather scenarios:

| Metric | Result | Description |
| :--- | :--- | :--- |
| **Precision** | **100.0%** | True Positives / (True Positives + False Positives) |
| **Genuine Weather Discrimination** | **100.0%** | 0 False Alarms during real physical warm fronts |
| **False Positive Rate (FPR)** | **0.0%** | FP / (FP + True Negatives) |
| **Detection Latency** | **< 1 tick** | Instantaneous single-step classification |

---

## 📝 Prototype Scope & Limitations

1. **Station Scope**: Prototype monitors high-resolution station USW00014739 (Boston Logan Airport). Multi-station spatial kriging and regional consensus can be added for multi-node networks.
2. **Offline Replay Stream**: Uses cached NOAA GHCNh observations replayed deterministically to ensure 100% offline demo reliability without external API rate-limit risk.
