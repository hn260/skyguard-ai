import math
import random
from typing import Dict, Any, Optional

class FaultInjector:
    def __init__(self):
        self.active_fault: Optional[Dict[str, Any]] = None
        self.tick_counter = 0

    def inject_fault(self, fault_type: str, affected_sensor: str = "temperature", severity: float = 1.0, duration: int = 30):
        """
        Injects a synthetic fault into the stream.
        """
        self.active_fault = {
            "fault_type": fault_type.upper(),
            "affected_sensor": affected_sensor.lower(),
            "severity": severity,
            "duration": duration,
            "elapsed_ticks": 0,
            "start_tick": self.tick_counter,
            "frozen_value": None,
            "ground_truth_flag": fault_type.upper()
        }
        print(f"[FAULT INJECTOR] Injected {fault_type} on {affected_sensor} (severity={severity}, duration={duration})")

    def clear_fault(self):
        self.active_fault = None
        print("[FAULT INJECTOR] Active fault cleared. Returning to clean baseline.")

    def apply_fault(self, observation: Dict[str, Any]) -> Dict[str, Any]:
        """
        Applies active fault or genuine event onto raw clean observation tick.
        Returns modified observation dictionary containing ground truth tags.
        """
        self.tick_counter += 1
        modified = dict(observation)

        # Store clean ground truth
        modified["clean_temperature"] = float(observation["temperature"])
        modified["clean_humidity"] = float(observation["humidity"])
        modified["clean_pressure"] = float(observation["pressure"])
        modified["ground_truth_fault"] = "NORMAL"
        modified["fault_injected"] = False

        if not self.active_fault:
            return modified

        fault = self.active_fault
        fault["elapsed_ticks"] += 1

        # Check if duration expired
        if fault["elapsed_ticks"] > fault["duration"]:
            self.clear_fault()
            return modified

        ftype = fault["fault_type"]
        sensor = fault["affected_sensor"]
        sev = fault["severity"]
        elapsed = fault["elapsed_ticks"]

        modified["ground_truth_fault"] = ftype
        modified["fault_injected"] = True

        if ftype == "TEMPERATURE_SPIKE":
            if sensor in ["temperature", "all"]:
                modified["temperature"] = round(modified["temperature"] + 10.5 * sev, 1)

        elif ftype == "TEMPERATURE_DROP":
            if sensor in ["temperature", "all"]:
                modified["temperature"] = round(modified["temperature"] - 11.0 * sev, 1)

        elif ftype == "TEMPERATURE_DRIFT":
            if sensor in ["temperature", "all"]:
                # Strong accumulative drift (e.g. +1.2°C per tick * severity)
                drift_amount = 1.2 * elapsed * sev
                modified["temperature"] = round(modified["temperature"] + drift_amount, 1)

        elif ftype == "TEMPERATURE_BIAS":
            if sensor in ["temperature", "all"]:
                modified["temperature"] = round(modified["temperature"] + 6.0 * sev, 1)

        elif ftype in ["FROZEN_TEMPERATURE", "STUCK_SENSOR"]:
            if sensor in ["temperature", "all"]:
                if fault["frozen_value"] is None:
                    fault["frozen_value"] = float(observation["temperature"])
                modified["temperature"] = fault["frozen_value"]

        elif ftype == "HUMIDITY_SPIKE":
            if sensor in ["humidity", "all"]:
                modified["humidity"] = min(100.0, round(modified["humidity"] + 35.0 * sev, 1))

        elif ftype == "HUMIDITY_BIAS":
            if sensor in ["humidity", "all"]:
                modified["humidity"] = max(0.0, round(modified["humidity"] - 30.0 * sev, 1))

        elif ftype == "FROZEN_HUMIDITY":
            if sensor in ["humidity", "all"]:
                if fault["frozen_value"] is None:
                    fault["frozen_value"] = float(observation["humidity"])
                modified["humidity"] = fault["frozen_value"]

        elif ftype == "PRESSURE_SPIKE":
            if sensor in ["pressure", "all"]:
                modified["pressure"] = round(modified["pressure"] + 25.0 * sev, 1)

        elif ftype == "PRESSURE_DRIFT":
            if sensor in ["pressure", "all"]:
                modified["pressure"] = round(modified["pressure"] - 0.8 * elapsed * sev, 1)

        elif ftype == "RANDOM_NOISE":
            noise_val = random.gauss(0, 4.5 * sev)
            if sensor == "temperature":
                modified["temperature"] = round(modified["temperature"] + noise_val, 1)
            elif sensor == "humidity":
                modified["humidity"] = max(0.0, min(100.0, round(modified["humidity"] + noise_val * 2.5, 1)))
            elif sensor == "pressure":
                modified["pressure"] = round(modified["pressure"] + noise_val * 2.0, 1)

        elif ftype == "MISSING_DATA":
            if sensor == "temperature":
                modified["temperature"] = None
            elif sensor == "humidity":
                modified["humidity"] = None
            elif sensor == "pressure":
                modified["pressure"] = None

        elif ftype == "GENUINE_WEATHER_FRONT":
            # Coherent physical shift (legitimate extreme weather front)
            # Temp rises rapidly, RH drops in physical inverse coupling, Pressure drops
            temp_shift = 0.7 * elapsed * sev
            modified["temperature"] = round(observation["temperature"] + temp_shift, 1)
            modified["humidity"] = max(12.0, round(observation["humidity"] - 2.8 * temp_shift, 1))
            modified["pressure"] = round(observation["pressure"] - 0.45 * elapsed * sev, 1)
            modified["ground_truth_fault"] = "GENUINE_WEATHER_FRONT"

        return modified
