import numpy as np
from typing import Dict, Any, List

class DataReconstructor:
    """
    Self-healing value estimator that reconstructs clean expected and corrected values
    without altering raw telemetry logs.
    """
    def __init__(self, window_size: int = 20):
        self.window_size = window_size
        self.temp_history: List[float] = []
        self.rh_history: List[float] = []
        self.press_history: List[float] = []

    def reconstruct(self, obs: Dict[str, Any], anomaly_metrics: Dict[str, Any], classification: Dict[str, Any]) -> Dict[str, Any]:
        temp_obs = obs.get("temperature")
        rh_obs = obs.get("humidity")
        press_obs = obs.get("pressure")

        is_fault = classification.get("is_fault", False)
        fault_type = classification.get("fault_type", "NORMAL")

        # Update clean history buffer (only push valid or corrected past values)
        if temp_obs is not None and not is_fault:
            self.temp_history.append(temp_obs)
        elif len(self.temp_history) > 0:
            # push expected estimate into history buffer to prevent drift cascade
            self.temp_history.append(self.temp_history[-1])

        if len(self.temp_history) > self.window_size:
            self.temp_history.pop(0)

        # 1. Calculate Expected Value (Rolling Exponential Moving Average)
        if len(self.temp_history) >= 3:
            weights = np.exp(np.linspace(-1.0, 0.0, len(self.temp_history)))
            weights /= weights.sum()
            expected_temp = float(np.sum(np.array(self.temp_history) * weights))
        elif temp_obs is not None:
            expected_temp = temp_obs
        else:
            expected_temp = 20.0

        expected_temp = round(expected_temp, 1)

        # 2. Calculate Corrected Value and Quality Flag
        if not is_fault:
            corrected_temp = temp_obs
            quality_flag = "OK"
            reconstruction_confidence = 99.0
        else:
            # Reconstruct corrected value
            if fault_type == "SPIKE" or fault_type == "DROP":
                corrected_temp = expected_temp
                quality_flag = "CORRECTED"
                reconstruction_confidence = 94.5
            elif fault_type == "DRIFT" or fault_type == "BIAS":
                # Partial blending towards rolling physical expectation
                corrected_temp = expected_temp
                quality_flag = "CORRECTED"
                reconstruction_confidence = 92.0
            elif fault_type == "STUCK_SENSOR":
                corrected_temp = expected_temp
                quality_flag = "CORRECTED"
                reconstruction_confidence = 90.0
            elif fault_type == "MISSING_DATA":
                corrected_temp = expected_temp
                quality_flag = "IMPUTED"
                reconstruction_confidence = 88.0
            else:
                corrected_temp = expected_temp
                quality_flag = "SUSPECT"
                reconstruction_confidence = 85.0

        return {
            "observed_temperature": temp_obs,
            "expected_temperature": expected_temp,
            "corrected_temperature": round(corrected_temp, 1) if corrected_temp is not None else expected_temp,
            "quality_flag": quality_flag,
            "reconstruction_confidence": reconstruction_confidence
        }
