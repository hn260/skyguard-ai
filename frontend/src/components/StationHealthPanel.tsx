import React from 'react';
import { HeartPulse, Thermometer, Droplets, Gauge, ShieldCheck } from 'lucide-react';
import type { StationHealth } from '../types/skyguard';

interface StationHealthPanelProps {
  health: StationHealth | null;
}

export const StationHealthPanel: React.FC<StationHealthPanelProps> = ({ health }) => {
  if (!health) return null;

  const tempH = health.temperature_health ?? 100;
  const rhH = health.humidity_health ?? 100;
  const pressH = health.pressure_health ?? 100;
  const dataQ = health.data_quality ?? 100;

  const getBarColor = (val: number) => {
    if (val >= 85) return 'bg-emerald-400';
    if (val >= 60) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  return (
    <div className="glass-panel p-6 rounded-2xl mb-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-emerald-400" />
          INDIVIDUAL SENSOR HEALTH & MAINTENANCE METRICS
        </h3>
        <span className="text-xs font-mono font-bold text-slate-400">
          RISK STATUS: <span className="text-emerald-400">{health.drift_risk}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Temp Health */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Temp Sensor
            </span>
            <span className="text-xs font-mono font-bold text-white">{tempH}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(tempH)} transition-all duration-500`} style={{ width: `${tempH}%` }} />
          </div>
        </div>

        {/* Humidity Health */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Humidity Transducer
            </span>
            <span className="text-xs font-mono font-bold text-white">{rhH}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(rhH)} transition-all duration-500`} style={{ width: `${rhH}%` }} />
          </div>
        </div>

        {/* Pressure Health */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-violet-400" /> Pressure Sensor
            </span>
            <span className="text-xs font-mono font-bold text-white">{pressH}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(pressH)} transition-all duration-500`} style={{ width: `${pressH}%` }} />
          </div>
        </div>

        {/* Data Quality */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Telemetry Feed
            </span>
            <span className="text-xs font-mono font-bold text-white">{dataQ}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(dataQ)} transition-all duration-500`} style={{ width: `${dataQ}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
