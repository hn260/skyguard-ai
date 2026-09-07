import time
from typing import Dict, Any, List
from app.data_ingestion import fetch_noaa_ghcnh_data
from app.fault_injector import FaultInjector
from app.anomaly_engine import AnomalyEngine
from app.classifier import FaultClassifier
from app.reconstructor import DataReconstructor
from app.health_monitor import StationHealthMonitor

class WeatherStreamEngine:
    def __init__(self):
        self.raw_dataset = fetch_noaa_ghcnh_data(days=30)
        self.total_records = len(self.raw_dataset)
        self.current_index = 0

        self.injector = FaultInjector()
        self.anomaly_engine = AnomalyEngine()
        self.anomaly_engine.train_isolation_forest(self.raw_dataset)
        self.classifier = FaultClassifier()
        self.reconstructor = DataReconstructor()
        self.health_monitor = StationHealthMonitor()

        self.telemetry_history: List[Dict[str, Any]] = []
        self.max_history = 100
        self.is_playing = True
        self.playback_speed = 1.0 # 1.0 = normal tick

        # Seed initial history buffer with clean baseline ticks
        self.seed_baseline(count=30)

    def seed_baseline(self, count: int = 30):
        for _ in range(count):
            self.tick()

    def tick(self) -> Dict[str, Any]:
        """
        Advances the weather simulation by 1 timestep tick.
        """
        raw_obs = self.raw_dataset.iloc[self.current_index % self.total_records].to_dict()
        self.current_index += 1

        # Format timestamp
        if hasattr(raw_obs.get("timestamp"), "strftime"):
            ts_str = raw_obs["timestamp"].strftime("%Y-%m-%d %H:%M:%S")
        else:
            ts_str = str(raw_obs.get("timestamp"))

        raw_obs["timestamp"] = ts_str

        # Apply active injected fault or genuine front
        modified_obs = self.injector.apply_fault(raw_obs)

        # Process through Anomaly Engine
        anomaly_metrics = self.anomaly_engine.process_observation(modified_obs)

        # Classify Fault & Generate Explanations
        classification = self.classifier.classify(modified_obs, anomaly_metrics)

        # Reconstruct Expected & Corrected Values
        reconstruction = self.reconstructor.reconstruct(modified_obs, anomaly_metrics, classification)

        # Update Health Monitor
        self.health_monitor.update(anomaly_metrics, classification)
        health_metrics = self.health_monitor.get_health_metrics()

        # Combine into complete telemetry payload
        payload = {
            "tick_index": self.current_index,
            "timestamp": ts_str,
            "station_id": modified_obs.get("station_id", "USW00014739"),
            "station_name": modified_obs.get("station_name", "Boston Logan Airport"),
            "temperature": modified_obs.get("temperature"),
            "humidity": modified_obs.get("humidity"),
            "pressure": modified_obs.get("pressure"),
            "latitude": modified_obs.get("latitude"),
            "longitude": modified_obs.get("longitude"),

            # Anomaly & ML Outputs
            "anomaly_score": anomaly_metrics["anomaly_score"],
            "is_anomaly": anomaly_metrics["is_anomaly"],
            "anomaly_details": anomaly_metrics,

            # Fault Classification
            "fault_type": classification["fault_type"],
            "affected_sensor": classification["affected_sensor"],
            "confidence": classification["confidence"],
            "severity": classification["severity"],
            "evidence": classification["evidence"],
            "recommendation": classification["recommendation"],
            "is_fault": classification["is_fault"],

            # Self-Healing Reconstruction
            "expected_temperature": reconstruction["expected_temperature"],
            "corrected_temperature": reconstruction["corrected_temperature"],
            "quality_flag": reconstruction["quality_flag"],
            "reconstruction_confidence": reconstruction["reconstruction_confidence"],

            # Ground Truth
            "ground_truth_fault": modified_obs.get("ground_truth_fault", "NORMAL"),
            "clean_temperature": modified_obs.get("clean_temperature"),

            # Health HUD
            "station_health": health_metrics
        }

        self.telemetry_history.append(payload)
        if len(self.telemetry_history) > self.max_history:
            self.telemetry_history.pop(0)

        return payload

    def inject_fault(self, fault_type: str, sensor: str, severity: float, duration: int):
        self.injector.inject_fault(fault_type, sensor, severity, duration)

    def reset_station(self):
        self.injector.clear_fault()
        print("[STREAM ENGINE] Station reset to nominal operational baseline.")

    def get_latest_telemetry(self) -> Dict[str, Any]:
        if self.telemetry_history:
            return self.telemetry_history[-1]
        return self.tick()

    def get_history(self) -> List[Dict[str, Any]]:
        return self.telemetry_history
