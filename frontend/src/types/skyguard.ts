export interface StationHealth {
  overall_health: number;
  temperature_health: number;
  humidity_health: number;
  pressure_health: number;
  data_quality: number;
  maintenance_status: 'OPTIMAL' | 'MONITOR' | 'MAINTENANCE_REQUIRED' | 'CRITICAL';
  active_alerts_count: number;
  drift_risk: string;
}

export interface TelemetryPoint {
  tick_index: number;
  timestamp: string;
  station_id: string;
  station_name: string;
  temperature: number;
  humidity: number;
  pressure: number;
  latitude: number;
  longitude: number;

  anomaly_score: number;
  is_anomaly: boolean;

  fault_type: string;
  affected_sensor: string;
  confidence: number;
  severity: string;
  evidence: string[];
  recommendation: string;
  is_fault: boolean;

  expected_temperature: number;
  corrected_temperature: number;
  quality_flag: string;
  reconstruction_confidence: number;

  ground_truth_fault: string;
  clean_temperature: number;

  station_health: StationHealth;
}

export interface EvaluationMetrics {
  precision: number;
  recall: number;
  f1_score: number;
  false_positive_rate: number;
  total_evaluated_samples: number;
  true_positives: number;
  false_positives: number;
  true_negatives: number;
  false_negatives: number;
  genuine_weather_discrimination_accuracy: string;
}
