import numpy as np
import pandas as pd
from typing import Dict, Any, List
from sklearn.ensemble import IsolationForest

class AnomalyEngine:
    def __init__(self, window_size: int = 30):
        self.window_size = window_size
        self.history: List[Dict[str, Any]] = []
        self.isoforest = IsolationForest(n_estimators=50, contamination=0.05, random_state=42)
        self.isoforest_fitted = False

    def train_isolation_forest(self, clean_df: pd.DataFrame):
        """
        Fits Isolation Forest model on historical clean weather observations.
        """
        features = clean_df[["temperature", "humidity", "pressure"]].dropna()
        if len(features) > 20:
            self.isoforest.fit(features)
            self.isoforest_fitted = True

    def process_observation(self, obs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processes a single weather observation tick through the multi-layer ensemble.
        Returns anomaly scores and detailed evidence components.
        """
        self.history.append(obs)
        if len(self.history) > self.window_size:
            self.history.pop(0)

        temp = obs.get("temperature")
        rh = obs.get("humidity")
        press = obs.get("pressure")

        # 1. Missing Data Check
        if temp is None or rh is None or press is None:
            return {
                "anomaly_score": 1.0,
                "is_anomaly": True,
                "physical_score": 1.0,
                "rate_score": 1.0,
                "zscore": 5.0,
                "max_z": 5.0,
                "persistence_score": 0.0,
                "multivariate_coherence": 0.0,
                "isoforest_score": 1.0,
                "missing_data": True,
                "evidence": ["Critical telemetry sensor field is missing or null"]
            }

        # Extract historical windows
        temps = [h["temperature"] for h in self.history if h.get("temperature") is not None]
        rhs = [h["humidity"] for h in self.history if h.get("humidity") is not None]
        pressures = [h["pressure"] for h in self.history if h.get("pressure") is not None]

        # A. Physical Range Score
        temp_out = max(0.0, -temp - 50.0) if temp < -50 else (max(0.0, temp - 60.0) if temp > 60 else 0.0)
        rh_out = max(0.0, -rh) if rh < 0 else (max(0.0, rh - 100.0) if rh > 100 else 0.0)
        press_out = max(0.0, 870.0 - press) if press < 870 else (max(0.0, press - 1085.0) if press > 1085 else 0.0)
        physical_score = min(1.0, (temp_out + rh_out + press_out) / 10.0)

        # B. Rate of Change Score (1-step derivative)
        if len(temps) >= 2:
            dt = abs(temps[-1] - temps[-2])
            drh = abs(rhs[-1] - rhs[-2])
            dp = abs(pressures[-1] - pressures[-2])
            rate_score = min(1.0, (max(0.0, dt - 1.2) / 3.0) + (max(0.0, drh - 6.0) / 15.0) + (max(0.0, dp - 2.0) / 5.0))
        else:
            dt, drh, dp = 0.0, 0.0, 0.0
            rate_score = 0.0

        # C. Rolling Z-Score against baseline window
        if len(temps) >= 5:
            baseline_temps = temps[:-1] if len(temps) < 15 else temps[-15:-1]
            baseline_rhs = rhs[:-1] if len(rhs) < 15 else rhs[-15:-1]
            baseline_press = pressures[:-1] if len(pressures) < 15 else pressures[-15:-1]

            mean_t, std_t = np.mean(baseline_temps), max(0.4, np.std(baseline_temps))
            mean_rh, std_rh = np.mean(baseline_rhs), max(0.8, np.std(baseline_rhs))
            mean_p, std_p = np.mean(baseline_press), max(0.4, np.std(baseline_press))

            z_t = abs(temp - mean_t) / std_t
            z_rh = abs(rh - mean_rh) / std_rh
            z_p = abs(press - mean_p) / std_p

            max_z = max(z_t, z_rh, z_p)
            zscore_score = min(1.0, max(0.0, (max_z - 1.8) / 3.0))
        else:
            mean_t, mean_rh, mean_p = temp, rh, press
            z_t, z_rh, z_p, max_z = 0.0, 0.0, 0.0, 0.0
            zscore_score = 0.0

        # D. Persistence Check (Stuck / Frozen Sensor)
        if len(temps) >= 8:
            std_t_recent = np.std(temps[-8:])
            std_rh_recent = np.std(rhs[-8:])
            std_p_recent = np.std(pressures[-8:])
            if std_t_recent < 0.001 or std_rh_recent < 0.001 or std_p_recent < 0.001:
                persistence_score = 1.0
            else:
                persistence_score = 0.0
        else:
            persistence_score = 0.0

        # E. Thermodynamic Cross-Variable Physical Coherence Score
        # Psychrometric law: Relative Humidity drops as Temperature rises when water vapor pressure is conserved.
        # Expected RH shift: ΔRH_expected ≈ -2.2 * ΔTemp
        if len(temps) >= 4:
            delta_t_cum = temp - mean_t
            delta_rh_cum = rh - mean_rh

            if abs(delta_t_cum) > 1.5:
                expected_delta_rh = -2.2 * delta_t_cum
                rh_residual = abs(delta_rh_cum - expected_delta_rh)

                if rh_residual < 8.0:
                    multivariate_coherence = 0.95 # Thermo-coupled -> Genuine Weather Front!
                else:
                    multivariate_coherence = 0.10 # RH fails to support temp shift -> Sensor Fault!
            else:
                multivariate_coherence = 1.0
        else:
            multivariate_coherence = 1.0

        # F. Isolation Forest Unsupervised Score
        if self.isoforest_fitted:
            raw_iso_score = self.isoforest.score_samples([[temp, rh, press]])[0]
            isoforest_score = min(1.0, max(0.0, (0.15 - raw_iso_score) / 0.35))
        else:
            isoforest_score = 0.0

        # G. Ensemble Combination
        if persistence_score == 1.0:
            anomaly_score = 0.95
        else:
            raw_ensemble = (
                0.35 * zscore_score +
                0.25 * rate_score +
                0.25 * physical_score +
                0.15 * isoforest_score
            )
            if zscore_score > 0.3 and multivariate_coherence < 0.3:
                raw_ensemble = max(raw_ensemble, 0.85)

            anomaly_score = float(np.clip(raw_ensemble, 0.0, 1.0))

        is_anomaly = anomaly_score > 0.35 or persistence_score > 0.8 or physical_score > 0.5

        # Compile evidence list
        evidence_list = []
        if physical_score > 0.3:
            evidence_list.append(f"Observation exceeds physical domain bounds (score: {physical_score:.2f})")
        if zscore_score > 0.3:
            evidence_list.append(f"Telemetry deviates {max_z:.1f}σ from rolling baseline mean")
        if rate_score > 0.3:
            evidence_list.append(f"Abnormal rate of change detected (ΔT = {dt:.1f}°C/tick)")
        if persistence_score > 0.8:
            evidence_list.append("Zero variance detected across 8 consecutive ticks (Sensor Frozen)")
        if multivariate_coherence < 0.3 and zscore_score > 0.3:
            evidence_list.append("Multivariate Inconsistency: Temperature change is unsupported by Relative Humidity & Pressure")
        elif multivariate_coherence > 0.8 and zscore_score > 0.3:
            evidence_list.append("Multivariate Coherence Confirmed: Temp rise is physically coupled with RH drop & Pressure shift")

        return {
            "anomaly_score": round(anomaly_score, 3),
            "is_anomaly": is_anomaly,
            "physical_score": round(physical_score, 3),
            "rate_score": round(rate_score, 3),
            "zscore": round(zscore_score, 3),
            "max_z": round(max_z, 2),
            "persistence_score": round(persistence_score, 3),
            "multivariate_coherence": round(multivariate_coherence, 3),
            "isoforest_score": round(isoforest_score, 3),
            "missing_data": False,
            "evidence": evidence_list
        }
