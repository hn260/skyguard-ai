import React from 'react';
import { AlertCircle, CheckCircle, Lightbulb, FileText, ShieldCheck, Zap } from 'lucide-react';
import type { TelemetryPoint } from '../types/skyguard';

interface AIDiagnosisPanelProps {
  latest: TelemetryPoint | null;
}

export const AIDiagnosisPanel: React.FC<AIDiagnosisPanelProps> = ({ latest }) => {
  if (!latest) return null;

  const isFault = latest.is_fault;
  const faultType = latest.fault_type;
  const confidence = latest.confidence;
  const severity = latest.severity;
  const evidence = latest.evidence || [];
  const recommendation = latest.recommendation;
  const isGenuineWeather = faultType === 'GENUINE_WEATHER_FRONT' || faultType === 'GENUINE_WEATHER_EVENT';

  return (
    <div className="glass-panel p-6 rounded-2xl mb-6 relative overflow-hidden">
      {/* Top Header & Classification Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl border ${isFault ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : isGenuineWeather ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
            {isFault ? <AlertCircle className="w-6 h-6" /> : isGenuineWeather ? <Zap className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              AI AUTONOMOUS DIAGNOSIS & EXPLAINER
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              {faultType.replace(/_/g, ' ')}
            </h2>
          </div>
        </div>

        {/* Severity & Confidence Pills */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">AI Confidence</div>
            <div className="text-lg font-black text-violet-400">{confidence}%</div>
          </div>

          <div className={`px-3 py-1.5 rounded-xl font-extrabold text-xs border ${
            severity === 'HIGH' || severity === 'CRITICAL'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : severity === 'MEDIUM'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            SEVERITY: {severity}
          </div>
        </div>
      </div>

      {/* Main Grid: Evidence Breakdown & Self-Healing Value Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Evidence Breakdown (2 Cols) */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              PHYSICAL EVIDENCE & CROSS-VARIABLE REASONING
            </h4>
            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800/80 space-y-2">
              {evidence.length > 0 ? (
                evidence.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic">No anomaly evidence detected. System operating normally.</div>
              )}
            </div>
          </div>

          {/* AI Recommendation Box */}
          <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900/60 p-4 rounded-xl border border-cyan-800/40">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              RECOMMENDED OPERATIONAL ACTION
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              {recommendation}
            </p>
          </div>
        </div>

        {/* Self-Healing Value Estimator Card (1 Col) */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              SELF-HEALING RECONSTRUCTION
            </h4>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Observed Raw:</span>
                <span className="font-bold text-rose-400 text-sm">
                  {latest.temperature !== null ? `${latest.temperature}°C` : 'N/A (NULL)'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Expected Baseline:</span>
                <span className="font-bold text-cyan-400 text-sm">
                  {latest.expected_temperature}°C
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Corrected Value:</span>
                <span className="font-bold text-emerald-400 text-base glow-emerald">
                  {latest.corrected_temperature}°C
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400">Quality Tag:</span>
                <span className="font-bold text-violet-300 px-2 py-0.5 rounded bg-violet-950/60 border border-violet-800/40 text-[10px]">
                  {latest.quality_flag} ({latest.reconstruction_confidence}%)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 italic">
            * Raw telemetry preserved in immutable archive. Corrected values published to climate stream.
          </div>
        </div>
      </div>
    </div>
  );
};
