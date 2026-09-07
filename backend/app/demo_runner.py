import time
from typing import Dict, Any, List

class DemoRunner:
    """
    Coordinates the deterministic 9-step interactive demo sequence.
    """
    def __init__(self, stream_engine):
        self.stream_engine = stream_engine
        self.is_demo_active = False
        self.current_step = 0
        self.step_descriptions = [
            "Initializing Healthy Weather Station Baseline...",
            "Monitoring Normal Atmospheric Variation...",
            "INJECTING: Temperature Sensor Thermal Drift Fault (+0.35°C/tick)...",
            "ANOMALY ENGINE DETECTS DEVIATION: Anomaly Score spikes > 0.85...",
            "AI CLASSIFIER DIAGNOSIS: Temperature Sensor Drift (Confidence 96%)...",
            "SELF-HEALING RECONSTRUCTION: Calculated Corrected Value = Expected Baseline...",
            "STATION AUTOMATED RESET & SANITIZATION...",
            "METEOROLOGICAL EVENT: Approaching Synoptic Warm Front (Coherent Temp/RH/Press Shift)...",
            "AI VERIFICATION COMPLETE: Identifies Genuine Weather Front (NO SENSOR FAULT DETECTED)."
        ]

    def start_demo_sequence(self) -> Dict[str, Any]:
        """
        Executes the full automated demo sequence on the stream engine.
        """
        self.is_demo_active = True
        results: List[Dict[str, Any]] = []

        # 1. Reset baseline
        self.stream_engine.reset_station()
        for _ in range(5):
            results.append(self.stream_engine.tick())

        # 2. Inject Temperature Sensor Drift
        self.stream_engine.inject_fault("TEMPERATURE_DRIFT", sensor="temperature", severity=1.2, duration=15)
        for _ in range(8):
            results.append(self.stream_engine.tick())

        drift_telemetry = self.stream_engine.get_latest_telemetry()

        # 3. Reset station
        self.stream_engine.reset_station()
        for _ in range(5):
            results.append(self.stream_engine.tick())

        # 4. Inject Genuine Weather Front
        self.stream_engine.inject_fault("GENUINE_WEATHER_FRONT", sensor="all", severity=1.0, duration=12)
        for _ in range(8):
            results.append(self.stream_engine.tick())

        weather_telemetry = self.stream_engine.get_latest_telemetry()

        # Clean up
        self.stream_engine.reset_station()
        self.is_demo_active = False

        return {
            "demo_status": "COMPLETED_SUCCESSFULLY",
            "steps_count": len(self.step_descriptions),
            "step_descriptions": self.step_descriptions,
            "drift_detection_result": {
                "fault_type": drift_telemetry.get("fault_type"),
                "confidence": drift_telemetry.get("confidence"),
                "is_fault": drift_telemetry.get("is_fault"),
                "evidence": drift_telemetry.get("evidence"),
                "corrected_temp": drift_telemetry.get("corrected_temperature")
            },
            "genuine_weather_result": {
                "fault_type": weather_telemetry.get("fault_type"),
                "confidence": weather_telemetry.get("confidence"),
                "is_fault": weather_telemetry.get("is_fault"),
                "evidence": weather_telemetry.get("evidence")
            }
        }
