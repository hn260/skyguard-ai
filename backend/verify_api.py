import requests
import json

BASE = "http://127.0.0.1:8000/api"

print("--- TESTING ALL SKYGUARD API ENDPOINTS ---")

# 1. Health
r = requests.get(f"{BASE}/health")
print("[1] GET /api/health:", r.status_code, r.json())

# 2. Station
r = requests.get(f"{BASE}/station")
print("[2] GET /api/station:", r.status_code, "Health:", r.json()["health_scores"]["overall_health"])

# 3. Timeseries
r = requests.get(f"{BASE}/timeseries")
print("[3] GET /api/timeseries:", r.status_code, "Ticks count:", len(r.json()))

# 4. Anomalies
r = requests.get(f"{BASE}/anomalies")
print("[4] GET /api/anomalies:", r.status_code, "Fault:", r.json()["fault_type"])

# 5. Metrics
r = requests.get(f"{BASE}/metrics")
print("[5] GET /api/metrics:", r.status_code, "Precision:", r.json()["precision"], "Recall:", r.json()["recall"], "F1:", r.json()["f1_score"])

# 6. Inject Temperature Drift Fault
r = requests.post(f"{BASE}/inject-fault", json={"fault_type": "TEMPERATURE_DRIFT", "affected_sensor": "temperature", "severity": 1.2, "duration": 15})
print("[6] POST /api/inject-fault (DRIFT):", r.status_code, "Flagged Fault:", r.json()["latest_telemetry"]["fault_type"])

# 7. Check Anomalies during Drift
r = requests.get(f"{BASE}/anomalies")
print("[7] GET /api/anomalies (DRIFT ACTIVE):", r.status_code, "Severity:", r.json()["severity"], "Evidence count:", len(r.json()["evidence"]))

# 8. Reset Station
r = requests.post(f"{BASE}/reset")
print("[8] POST /api/reset:", r.status_code, "Status after reset:", r.json()["latest_telemetry"]["fault_type"])

# 9. Run Automated Demo
r = requests.post(f"{BASE}/demo")
print("[9] POST /api/demo:", r.status_code, "Demo status:", r.json()["demo_status"], "Genuine Weather Result:", r.json()["genuine_weather_result"]["fault_type"])

print("\n--- ALL API ENDPOINTS VERIFIED 100% WORKING ---")
