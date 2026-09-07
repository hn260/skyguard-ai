from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List

from app.stream_engine import WeatherStreamEngine
from app.demo_runner import DemoRunner
from app.evaluator import run_evaluation_benchmark

app = FastAPI(
    title="SKYGUARD AI — Autonomous Weather Station Quality Intelligence API",
    version="1.0.0"
)

# Enable CORS for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Stream Engine & Demo Controller
stream_engine = WeatherStreamEngine()
demo_runner = DemoRunner(stream_engine)

class InjectFaultRequest(BaseModel):
    fault_type: str
    affected_sensor: Optional[str] = "temperature"
    severity: Optional[float] = 1.0
    duration: Optional[int] = 30

@app.get("/api/health")
def get_health():
    return {
        "status": "ONLINE",
        "system": "SKYGUARD AI",
        "station_id": stream_engine.get_latest_telemetry().get("station_id"),
        "station_name": stream_engine.get_latest_telemetry().get("station_name"),
        "total_records": stream_engine.total_records
    }

@app.get("/api/station")
def get_station_status():
    latest = stream_engine.get_latest_telemetry()
    return {
        "station_id": latest.get("station_id"),
        "station_name": latest.get("station_name"),
        "latitude": latest.get("latitude"),
        "longitude": latest.get("longitude"),
        "timestamp": latest.get("timestamp"),
        "current_telemetry": {
            "temperature": latest.get("temperature"),
            "humidity": latest.get("humidity"),
            "pressure": latest.get("pressure"),
            "expected_temperature": latest.get("expected_temperature"),
            "corrected_temperature": latest.get("corrected_temperature"),
            "quality_flag": latest.get("quality_flag")
        },
        "health_scores": latest.get("station_health"),
        "anomaly_score": latest.get("anomaly_score"),
        "active_fault": stream_engine.injector.active_fault
    }

@app.get("/api/timeseries")
def get_timeseries():
    """
    Returns rolling telemetry history for charts.
    """
    return stream_engine.get_history()

@app.get("/api/anomalies")
def get_anomalies():
    latest = stream_engine.get_latest_telemetry()
    return {
        "is_anomaly": latest.get("is_anomaly"),
        "anomaly_score": latest.get("anomaly_score"),
        "fault_type": latest.get("fault_type"),
        "affected_sensor": latest.get("affected_sensor"),
        "confidence": latest.get("confidence"),
        "severity": latest.get("severity"),
        "evidence": latest.get("evidence"),
        "recommendation": latest.get("recommendation"),
        "quality_flag": latest.get("quality_flag"),
        "expected_temperature": latest.get("expected_temperature"),
        "corrected_temperature": latest.get("corrected_temperature")
    }

@app.get("/api/metrics")
def get_evaluation_metrics():
    """
    Returns actual calculated Precision, Recall, F1, FPR benchmark metrics.
    """
    return run_evaluation_benchmark(n_samples=150)

@app.post("/api/inject-fault")
def inject_fault(req: InjectFaultRequest):
    stream_engine.inject_fault(
        fault_type=req.fault_type,
        sensor=req.affected_sensor or "temperature",
        severity=req.severity or 1.0,
        duration=req.duration or 30
    )
    # Immediately tick stream to reflect fault
    latest = stream_engine.tick()
    return {
        "message": f"Injected {req.fault_type} on {req.affected_sensor}",
        "latest_telemetry": latest
    }

@app.post("/api/reset")
def reset_station():
    stream_engine.reset_station()
    latest = stream_engine.tick()
    return {
        "message": "Station reset to nominal operational baseline.",
        "latest_telemetry": latest
    }

@app.post("/api/demo")
def run_demo():
    result = demo_runner.start_demo_sequence()
    return result

@app.post("/api/tick")
def advance_tick():
    latest = stream_engine.tick()
    return latest

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
