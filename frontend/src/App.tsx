import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { TelemetryCharts } from './components/TelemetryCharts';
import { AIDiagnosisPanel } from './components/AIDiagnosisPanel';
import { AnomalyTimeline } from './components/AnomalyTimeline';
import { FaultLab } from './components/FaultLab';
import { StationHealthPanel } from './components/StationHealthPanel';
import { EvaluationModal } from './components/EvaluationModal';
import { DemoBanner } from './components/DemoBanner';
import type { TelemetryPoint, EvaluationMetrics } from './types/skyguard';

const API_BASE = import.meta.env.VITE_API_BASE || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://127.0.0.1:8000/api' : '/api');

export function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [latestTelemetry, setLatestTelemetry] = useState<TelemetryPoint | null>(null);
  const [history, setHistory] = useState<TelemetryPoint[]>([]);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoStepMsg, setDemoStepMsg] = useState<string>('');
  const [isMetricsOpen, setIsMetricsOpen] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<EvaluationMetrics | null>(null);

  // Fetch initial telemetry history & status
  const fetchTelemetryHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/timeseries`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
        if (data.length > 0) {
          setLatestTelemetry(data[data.length - 1]);
        }
      }
    } catch (err) {
      console.warn('Backend connecting...', err);
    }
  };

  // Tick simulation forward
  const handleTick = async () => {
    try {
      const res = await fetch(`${API_BASE}/tick`, { method: 'POST' });
      if (res.ok) {
        const data: TelemetryPoint = await res.json();
        setLatestTelemetry(data);
        setHistory((prev) => [...prev.slice(-99), data]);
      }
    } catch (err) {
      console.warn('Backend stream error:', err);
    }
  };

  // Stream Interval Loop
  useEffect(() => {
    fetchTelemetryHistory();

    const interval = setInterval(() => {
      if (isPlaying && !isDemoActive) {
        handleTick();
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying, isDemoActive]);

  // Inject Fault
  const handleInjectFault = async (faultType: string, sensor: string, severity: number, duration: number) => {
    try {
      const res = await fetch(`${API_BASE}/inject-fault`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fault_type: faultType,
          affected_sensor: sensor,
          severity,
          duration
        })
      });
      if (res.ok) {
        const result = await res.json();
        if (result.latest_telemetry) {
          setLatestTelemetry(result.latest_telemetry);
          setHistory((prev) => [...prev.slice(-99), result.latest_telemetry]);
        }
      }
    } catch (err) {
      console.error('Failed to inject fault:', err);
    }
  };

  // Reset Station
  const handleReset = async () => {
    try {
      const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
      if (res.ok) {
        const result = await res.json();
        if (result.latest_telemetry) {
          setLatestTelemetry(result.latest_telemetry);
          setHistory((prev) => [...prev.slice(-99), result.latest_telemetry]);
        }
      }
    } catch (err) {
      console.error('Failed to reset station:', err);
    }
  };

  // Run Automated Demo Sequence
  const handleRunDemo = async () => {
    setIsDemoActive(true);
    setDemoStepMsg('Initializing automated 9-step physical fault & genuine weather demonstration...');

    try {
      const res = await fetch(`${API_BASE}/demo`, { method: 'POST' });
      if (res.ok) {
        const result = await res.json();
        const steps = result.step_descriptions || [];

        for (let i = 0; i < steps.length; i++) {
          setDemoStepMsg(`[Step ${i + 1}/${steps.length}] ${steps[i]}`);
          await handleTick();
          await new Promise((r) => setTimeout(r, 1100));
        }

        setDemoStepMsg('Demo sequence finished. Station baseline restored.');
        setTimeout(() => setIsDemoActive(false), 3000);
      }
    } catch (err) {
      console.error('Demo execution error:', err);
      setIsDemoActive(false);
    }
  };

  // Open Metrics Modal
  const handleOpenMetrics = async () => {
    setIsMetricsOpen(true);
    try {
      const res = await fetch(`${API_BASE}/metrics`);
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error('Failed to fetch ML metrics:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Navigation */}
        <Header
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onRunDemo={handleRunDemo}
          onReset={handleReset}
          onOpenMetrics={handleOpenMetrics}
          stationName={latestTelemetry?.station_name || 'NOAA GHCNh Station USW00014739'}
        />

        {/* Demo Mode Step Banner */}
        <DemoBanner isDemoActive={isDemoActive} stepMessage={demoStepMsg} />

        {/* HUD Top Metric Cards */}
        <MetricCards latest={latestTelemetry} />

        {/* AI Autonomous Diagnosis & Explainer Panel */}
        <AIDiagnosisPanel latest={latestTelemetry} />

        {/* Main Telemetry & Self-Healing Corrected Value Charts */}
        <TelemetryCharts history={history} />

        {/* Anomaly Score Temporal Timeline */}
        <AnomalyTimeline history={history} />

        {/* Interactive Synthetic Fault Injection Lab */}
        <FaultLab onInjectFault={handleInjectFault} onReset={handleReset} />

        {/* Per-Sensor Individual Health HUD */}
        <StationHealthPanel health={latestTelemetry?.station_health || null} />

        {/* ML Evaluation Metrics Modal */}
        <EvaluationModal
          isOpen={isMetricsOpen}
          onClose={() => setIsMetricsOpen(false)}
          metrics={metrics}
        />
      </div>
    </div>
  );
}

export default App;
