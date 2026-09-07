# PROJECT CONTEXT & PROMPT PRIMER: SKYGUARD AI

> **Purpose of this Document**: Pass this context file directly into ChatGPT, Claude, Gemini, or any AI assistant to instantly provide complete domain background, technical architecture, data structures, ML algorithms, and system contracts for **SKYGUARD AI**.

---

## 1. PROJECT IDENTIFICATION

- **Project Name**: SKYGUARD AI — Autonomous Weather Station Quality Intelligence
- **Core Thesis**: *"SKYGUARD doesn't just detect unusual weather — it determines whether the weather station itself is telling the truth."*
- **Domain**: Meteorological Telemetry Quality Control, Physical Fault Disambiguation, & Self-Healing Telemetry Reconstruction
- **Live Production URL**: [https://skyguard-ai-xi.vercel.app](https://skyguard-ai-xi.vercel.app)
- **GitHub Repository**: [https://github.com/hn260/skyguard-ai](https://github.com/hn260/skyguard-ai)
- **Primary Dataset**: NOAA GHCNh (Global Historical Climatology Network-hourly) station USW00014739 (Boston Logan International Airport)

---

## 2. PROBLEM STATEMENT & DOMAIN CHALLENGE

Automated weather stations monitor critical climate and meteorological parameters:
- **Temperature** (°C)
- **Relative Humidity** (%)
- **Atmospheric / Barometric Pressure** (hPa)

In real-world field operations, sensors experience physical degradation, thermal amplifier drift, ADC binding/freezing, zero-point offset bias, transient electrical noise spikes, and missing telemetry frames.

### The Key Technical Problem
Traditional naive thresholding systems trigger false alarms whenever weather parameters change rapidly. However, a sudden 4°C temperature rise can be caused by two very different physical phenomena:
1. **A Physical Sensor Fault**: Temperature probe thermal amplifier drift (sensor is lying).
2. **A Legitimate Extreme Weather Event**: An approaching synoptic warm front or convective thermal storm (sensor is telling the truth).

SKYGUARD AI solves this challenge by evaluating **thermodynamic cross-variable physical coherence**:
$$\Delta RH_{\text{expected}} \approx -2.2 \times \Delta Temp$$

During a legitimate meteorological warm front, as Temperature rises, water vapor pressure laws dictate that Relative Humidity MUST decrease proportionally and Atmospheric Pressure often shifts. If Temperature rises rapidly while Relative Humidity remains flat or moves erratically, SKYGUARD identifies that the physical correlation is broken and flags a **Sensor Fault** rather than an extreme weather alert.

---

## 3. FULL-STACK ARCHITECTURE

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

### Technology Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Lucide Icons.
- **Backend**: Python 3.11/3.12, FastAPI, Uvicorn, Pandas, NumPy, Scikit-learn (IsolationForest), SciPy.
- **Deployment**: Vercel Python Serverless Function (`api/index.py`) + Vite Static Asset Host.

---

## 4. CORE ENGINE MODULES & DATA CONTRACTS

### A. Data Ingestion (`backend/app/data_ingestion.py`)
Fetches and standardizes NOAA GHCNh station hourly observations into a pandas DataFrame:
- `timestamp`: Datetime
- `station_id`: String (e.g. "USW00014739")
- `station_name`: String ("Boston Logan International Airport")
- `temperature`: Float (°C)
- `humidity`: Float (%)
- `pressure`: Float (hPa)
- `latitude`: Float (42.3606)
- `longitude`: Float (-71.0097)

### B. Fault Injector Engine (`backend/app/fault_injector.py`)
Generates 11 synthetic fault injection patterns while recording pristine ground truth:
1. `TEMPERATURE_SPIKE`: +10.5°C transient pulse
2. `TEMPERATURE_DROP`: -11.0°C transient drop
3. `TEMPERATURE_DRIFT`: Cumulative +1.2°C/tick offset accumulation
4. `TEMPERATURE_BIAS`: Fixed +6.0°C offset shift
5. `STUCK_SENSOR` / `FROZEN_TEMPERATURE`: Lock value to constant without variance
6. `HUMIDITY_SPIKE`: +35.0% RH pulse
7. `HUMIDITY_BIAS`: -30.0% RH offset
8. `PRESSURE_SPIKE`: +25.0 hPa pulse
9. `PRESSURE_DRIFT`: -0.8 hPa/tick cumulative drift
10. `RANDOM_NOISE`: Gaussian noise ($\sigma = 4.5$)
11. `MISSING_DATA`: Null/NaN telemetry fields
12. `GENUINE_WEATHER_FRONT`: Coherent physical shift ($\Delta Temp > 0$, $\Delta RH < 0$, $\Delta Press < 0$)

### C. Multi-Layer Anomaly Engine (`backend/app/anomaly_engine.py`)
Evaluates 6 sub-scores per observation tick:
- **Physical Range Score**: Bounds validation (Temp: [-50, 60], RH: [0, 100], Press: [870, 1085]).
- **Rate of Change Score**: 1-step derivative limit ($\Delta Temp > 1.2^\circ\text{C}/\text{tick}$).
- **Rolling Z-Score**: Standard deviations from 15-tick moving baseline.
- **Persistence Score**: Standard deviation across 8 ticks $< 0.001$ (Frozen ADC sensor).
- **Thermodynamic Cross-Variable Coherence Score**: Verifies psychrometric relationship between Temp and RH.
- **Isolation Forest Score**: Unsupervised multivariate outlier detection.
- **Ensemble Anomaly Score**: Combined $0.0 - 1.0$ score.

### D. Fault Classifier & Dynamic Explainer (`backend/app/classifier.py`)
Classifies signal into 9 operational states:
- `NORMAL`
- `SPIKE`
- `DROP`
- `DRIFT`
- `BIAS`
- `STUCK_SENSOR`
- `NOISE`
- `MISSING_DATA`
- `GENUINE_WEATHER_EVENT`

Outputs structured evidence bullet points (Z-scores, rate-of-change, psychrometric coherence) and actionable maintenance recommendations.

### E. Self-Healing Reconstructor (`backend/app/reconstructor.py`)
Preserves raw telemetry intact in an immutable archive while publishing:
- `observed_temperature`: Raw telemetry (°C)
- `expected_temperature`: Exponential moving average baseline (°C)
- `corrected_temperature`: Self-healing reconstructed value (°C)
- `quality_flag`: `OK` | `SUSPECT` | `BAD` | `CORRECTED` | `IMPUTED`
- `reconstruction_confidence`: Percentage float (e.g. 94.5%)

### F. Station Health Monitor (`backend/app/health_monitor.py`)
Calculates dynamic 0–100 HUD scores:
- `overall_health`: Composite score (0-100)
- `temperature_health`: Temp channel score (0-100)
- `humidity_health`: Humidity channel score (0-100)
- `pressure_health`: Pressure channel score (0-100)
- `data_quality`: Feed completeness score (0-100)
- `maintenance_status`: `OPTIMAL` | `MONITOR` | `MAINTENANCE_REQUIRED` | `CRITICAL`

---

## 5. API ENDPOINTS & SCHEMAS

All endpoints are hosted at `https://skyguard-ai-xi.vercel.app/api/...`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health & station metadata |
| `GET` | `/api/station` | Composite station health scores & active fault status |
| `GET` | `/api/timeseries` | Rolling telemetry history for charts |
| `GET` | `/api/anomalies` | Active anomaly classification, confidence & evidence |
| `GET` | `/api/metrics` | Ground-truth benchmark evaluation metrics |
| `POST` | `/api/inject-fault` | Trigger synthetic fault injection |
| `POST` | `/api/reset` | Reset station baseline |
| `POST` | `/api/demo` | Trigger 9-step automated walkthrough |
| `POST` | `/api/tick` | Advance simulation by 1 tick |

---

## 6. GROUND-TRUTH ML EVALUATION RESULTS

Calculated on 150 ground-truth synthetic fault injection ticks + genuine weather scenarios:
- **Precision**: 100.0%
- **Recall**: 94.2%
- **F1 Score**: 97.0%
- **False Positive Rate (FPR)**: 0.0%
- **Genuine Weather Discrimination Accuracy**: 100.0% (0 False Alarms during physical warm fronts)

---

## 7. HOW TO PROMPT AN AI MODEL WITH THIS CONTEXT

When asking ChatGPT, Claude, or Gemini to work on SKYGUARD AI, paste this document and specify your request:

### Example Prompts for ChatGPT:
1. *"Using the SKYGUARD AI context above, write a Python extension for spatial kriging anomaly detection across a 5-station network."*
2. *"Explain how SKYGUARD AI distinguishes between sensor drift and a genuine weather front using the thermodynamic coherence equation."*
3. *"Write a unit test using pytest for `backend/app/classifier.py` verifying that `TEMPERATURE_DRIFT` is correctly classified when multivariate coherence is low."*
