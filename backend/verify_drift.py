import requests

BASE = "http://127.0.0.1:8000/api"

print("--- TESTING DRIFT DETECTION PROGRESSION ---")
requests.post(f"{BASE}/reset")
requests.post(f"{BASE}/inject-fault", json={"fault_type": "TEMPERATURE_DRIFT", "affected_sensor": "temperature", "severity": 1.5, "duration": 20})

for tick in range(1, 10):
    res = requests.post(f"{BASE}/tick").json()
    print(f"Tick {tick}: Temp={res['temperature']}°C, AnomalyScore={res['anomaly_score']}, Fault={res['fault_type']}, Severity={res['severity']}, Corrected={res['corrected_temperature']}°C")

print("\n--- TESTING GENUINE WEATHER FRONT ---")
requests.post(f"{BASE}/reset")
requests.post(f"{BASE}/inject-fault", json={"fault_type": "GENUINE_WEATHER_FRONT", "affected_sensor": "all", "severity": 1.0, "duration": 20})

for tick in range(1, 10):
    res = requests.post(f"{BASE}/tick").json()
    print(f"Tick {tick}: Temp={res['temperature']}°C, RH={res['humidity']}%, Press={res['pressure']}hPa, Fault={res['fault_type']}, Coherence={res['anomaly_details']['multivariate_coherence']}")
