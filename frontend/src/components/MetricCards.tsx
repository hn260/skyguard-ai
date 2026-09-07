import React from 'react';
import { HeartPulse, CheckCircle2, Cpu, ShieldAlert } from 'lucide-react';
import type { TelemetryPoint } from '../types/skyguard';

interface MetricCardsProps {
  latest: TelemetryPoint | null;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ latest }) => {
  if (!latest) return null;

  const health = latest.station_health;
  const overall = health?.overall_health ?? 100;
  const dataQuality = health?.data_quality ?? 100;
  const faultType = latest.fault_type;
  const isFault = latest.is_fault;
  const confidence = latest.confidence ?? 95;

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Station Health Score */}
      <div className="glass-panel p-5 rounded-2xl glass-card-glow relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-emerald-400" /> STATION HEALTH
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getHealthColor(overall)}`}>
            {health?.maintenance_status ?? 'OPTIMAL'}
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className={`text-4xl font-black tracking-tight ${overall >= 80 ? 'text-emerald-400 glow-emerald' : overall >= 60 ? 'text-amber-400' : 'text-rose-400 glow-rose'}`}>
            {overall}%
          </span>
          <span className="text-xs text-slate-400 font-medium">Composite Index</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${overall >= 80 ? 'bg-emerald-400' : overall >= 60 ? 'bg-amber-400' : 'bg-rose-400'}`}
            style={{ width: `${overall}%` }}
          />
        </div>
      </div>

      {/* 2. Data Quality Score */}
      <div className="glass-panel p-5 rounded-2xl glass-card-glow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" /> DATA INTEGRITY
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            FLAG: {latest.quality_flag}
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black text-cyan-400 tracking-tight glow-cyan">
            {dataQuality}%
          </span>
          <span className="text-xs text-slate-400 font-medium">Completeness</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-500 rounded-full"
            style={{ width: `${dataQuality}%` }}
          />
        </div>
      </div>

      {/* 3. Active AI Alerts */}
      <div className="glass-panel p-5 rounded-2xl glass-card-glow relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className={`w-4 h-4 ${isFault ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`} /> ACTIVE AI ALERTS
          </span>
          {isFault ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
              FAULT DETECTED
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              NOMINAL
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-3">
          <span className={`text-4xl font-black tracking-tight ${isFault ? 'text-rose-400 glow-rose' : 'text-slate-200'}`}>
            {isFault ? 1 : 0}
          </span>
          <span className="text-xs text-slate-400 font-medium truncate max-w-[140px]">
            {faultType.replace('_', ' ')}
          </span>
        </div>
        <div className="mt-3 text-xs text-slate-400 font-mono truncate">
          Severity: <span className={latest.severity === 'HIGH' || latest.severity === 'CRITICAL' ? 'text-rose-400 font-bold' : 'text-slate-300'}>{latest.severity}</span>
        </div>
      </div>

      {/* 4. AI Confidence & Physical Coherence */}
      <div className="glass-panel p-5 rounded-2xl glass-card-glow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-violet-400" /> AI CONFIDENCE
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/30">
            ENSEMBLE
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black text-violet-400 tracking-tight">
            {confidence}%
          </span>
          <span className="text-xs text-slate-400 font-medium">Certainty</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-violet-400 transition-all duration-500 rounded-full"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
};
