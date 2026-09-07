import React from 'react';
import { ShieldCheck, Play, Pause, RefreshCw, BarChart2, Cpu } from 'lucide-react';

interface HeaderProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRunDemo: () => void;
  onReset: () => void;
  onOpenMetrics: () => void;
  stationName: string;
}

export const Header: React.FC<HeaderProps> = ({
  isPlaying,
  onTogglePlay,
  onRunDemo,
  onReset,
  onOpenMetrics,
  stationName,
}) => {
  return (
    <header className="glass-panel border-b border-slate-800/80 px-6 py-4 mb-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-4">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <ShieldCheck className="w-7 h-7 animate-radar" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              SKYGUARD <span className="text-cyan-400 font-extrabold">AI</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> AUTONOMOUS QUALITY ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Autonomous Weather Station Quality Intelligence & Physical Fault Disambiguation • <span className="text-slate-300 font-semibold">{stationName}</span>
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* RUN DEMO Button */}
        <button
          onClick={onRunDemo}
          className="relative group px-5 py-2.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>RUN DEMO</span>
        </button>

        {/* Play/Pause Stream Toggle */}
        <button
          onClick={onTogglePlay}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs border transition-all flex items-center gap-2 cursor-pointer ${
            isPlaying
              ? 'bg-slate-800/80 text-cyan-400 border-cyan-500/30 hover:bg-slate-700/80'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>LIVE TICK STREAM</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>PAUSED</span>
            </>
          )}
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-slate-800/60 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          title="Reset station to clean baseline"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>RESET</span>
        </button>

        {/* ML Benchmark Button */}
        <button
          onClick={onOpenMetrics}
          className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-cyan-950/40 text-cyan-300 border border-cyan-800/60 hover:bg-cyan-900/50 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          <span>ML METRICS</span>
        </button>
      </div>
    </header>
  );
};
