import React, { useState } from 'react';
import { Sliders, Zap, RefreshCw, AlertTriangle, CloudRain, Flame, ThermometerSnowflake } from 'lucide-react';

interface FaultLabProps {
  onInjectFault: (faultType: string, sensor: string, severity: number, duration: number) => void;
  onReset: () => void;
}

export const FaultLab: React.FC<FaultLabProps> = ({ onInjectFault, onReset }) => {
  const [selectedSensor, setSelectedSensor] = useState<string>('temperature');
  const [selectedFault, setSelectedFault] = useState<string>('TEMPERATURE_DRIFT');
  const [severity, setSeverity] = useState<number>(1.0);
  const [duration, setDuration] = useState<number>(30);

  const faultOptions = [
    { id: 'TEMPERATURE_DRIFT', label: 'Temp Drift', category: 'temperature', icon: Flame },
    { id: 'TEMPERATURE_SPIKE', label: 'Temp Spike', category: 'temperature', icon: Zap },
    { id: 'TEMPERATURE_DROP', label: 'Temp Drop', category: 'temperature', icon: ThermometerSnowflake },
    { id: 'TEMPERATURE_BIAS', label: 'Temp Bias', category: 'temperature', icon: Sliders },
    { id: 'FROZEN_TEMPERATURE', label: 'Stuck Temp Sensor', category: 'temperature', icon: AlertTriangle },
    { id: 'HUMIDITY_SPIKE', label: 'Humidity Spike', category: 'humidity', icon: Zap },
    { id: 'HUMIDITY_BIAS', label: 'Humidity Bias', category: 'humidity', icon: Sliders },
    { id: 'PRESSURE_SPIKE', label: 'Pressure Spike', category: 'pressure', icon: Zap },
    { id: 'PRESSURE_DRIFT', label: 'Pressure Drift', category: 'pressure', icon: Flame },
    { id: 'RANDOM_NOISE', label: 'Random Noise', category: 'all', icon: Sliders },
    { id: 'MISSING_DATA', label: 'Missing Data', category: 'all', icon: AlertTriangle },
  ];

  const handleInject = () => {
    onInjectFault(selectedFault, selectedSensor, severity, duration);
  };

  const handleGenuineFront = () => {
    onInjectFault('GENUINE_WEATHER_FRONT', 'all', 1.0, 30);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            SYNTHETIC FAULT INJECTION LAB
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Inject subtle & extreme sensor faults or genuine meteorological events while maintaining ground truth
          </p>
        </div>

        {/* Quick Genuine Weather Scenario Trigger */}
        <button
          onClick={handleGenuineFront}
          className="px-4 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/60 transition-all flex items-center gap-2 cursor-pointer"
        >
          <CloudRain className="w-4 h-4 text-cyan-400" />
          <span>TRIGGER GENUINE WARM FRONT</span>
        </button>
      </div>

      {/* Sensor & Fault Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Sensor selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Target Sensor Channel
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['temperature', 'humidity', 'pressure', 'all'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSensor(s)}
                className={`py-2 text-xs font-bold rounded-xl border capitalize cursor-pointer transition-all ${
                  selectedSensor === s
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Severity Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Severity Magnitude
            </label>
            <span className="text-xs font-mono font-bold text-amber-400">{severity.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={severity}
            onChange={(e) => setSeverity(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* Duration Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Fault Duration (Ticks)
            </label>
            <span className="text-xs font-mono font-bold text-amber-400">{duration} ticks</span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="5"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>
      </div>

      {/* Fault Type Options Grid */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Select Synthetic Fault Pattern
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {faultOptions.map((f) => {
            const Icon = f.icon;
            const isSelected = selectedFault === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFault(f.id)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500/20 text-rose-200 border-rose-500/60 shadow-lg shadow-rose-500/10'
                    : 'bg-slate-900/50 text-slate-300 border-slate-800 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-slate-400'}`} />
                  <span className="text-[9px] uppercase font-mono text-slate-400">{f.category}</span>
                </div>
                <span className="text-xs font-bold leading-tight">{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Execution Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
        <button
          onClick={onReset}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>RESET STATION</span>
        </button>

        <button
          onClick={handleInject}
          className="px-6 py-2.5 rounded-xl font-black text-xs text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 transition-all shadow-lg shadow-rose-600/20 flex items-center gap-2 cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>INJECT SYNTHETIC FAULT</span>
        </button>
      </div>
    </div>
  );
};
