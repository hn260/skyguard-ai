from typing import Dict, Any, List

class StationHealthMonitor:
    def __init__(self, history_len: int = 50):
        self.history_len = history_len
        self.anomaly_records: List[Dict[str, Any]] = []

    def update(self, anomaly_metrics: Dict[str, Any], classification: Dict[str, Any]):
        self.anomaly_records.append({
            "is_fault": classification.get("is_fault", False),
            "fault_type": classification.get("fault_type", "NORMAL"),
            "affected_sensor": classification.get("affected_sensor", "none"),
            "severity": classification.get("severity", "NONE"),
            "anomaly_score": anomaly_metrics.get("anomaly_score", 0.0),
            "missing_data": anomaly_metrics.get("missing_data", False)
        })
        if len(self.anomaly_records) > self.history_len:
            self.anomaly_records.pop(0)

    def get_health_metrics(self) -> Dict[str, Any]:
        if not self.anomaly_records:
            return {
                "overall_health": 100,
                "temperature_health": 100,
                "humidity_health": 100,
                "pressure_health": 100,
                "data_quality": 100,
                "maintenance_status": "OPTIMAL",
                "active_alerts_count": 0,
                "drift_risk": "LOW"
            }

        recent = self.anomaly_records[-20:] # Evaluate last 20 ticks
        n_recent = len(recent)

        # Count faults by sensor
        temp_faults = sum(1 for r in recent if r["is_fault"] and r["affected_sensor"] in ["temperature", "all", "multiple"])
        rh_faults = sum(1 for r in recent if r["is_fault"] and r["affected_sensor"] in ["humidity", "all", "multiple"])
        press_faults = sum(1 for r in recent if r["is_fault"] and r["affected_sensor"] in ["pressure", "all", "multiple"])
        missing_count = sum(1 for r in recent if r["missing_data"])

        # Health Scores (0 - 100)
        temp_health = max(10, int(100 - (temp_faults / n_recent) * 85))
        rh_health = max(10, int(100 - (rh_faults / n_recent) * 85))
        press_health = max(10, int(100 - (press_faults / n_recent) * 85))
        data_quality = max(0, int(100 - (missing_count / n_recent) * 100))

        # Overall composite health
        overall_health = int(0.40 * temp_health + 0.20 * rh_health + 0.20 * press_health + 0.20 * data_quality)

        # Maintenance Status
        if overall_health >= 90:
            status = "OPTIMAL"
            drift_risk = "LOW"
        elif overall_health >= 70:
            status = "MONITOR"
            drift_risk = "MODERATE"
        elif overall_health >= 45:
            status = "MAINTENANCE_REQUIRED"
            drift_risk = "HIGH"
        else:
            status = "CRITICAL"
            drift_risk = "CRITICAL"

        active_alerts_count = sum(1 for r in recent if r["is_fault"])

        return {
            "overall_health": overall_health,
            "temperature_health": temp_health,
            "humidity_health": rh_health,
            "pressure_health": press_health,
            "data_quality": data_quality,
            "maintenance_status": status,
            "active_alerts_count": active_alerts_count,
            "drift_risk": drift_risk
        }
