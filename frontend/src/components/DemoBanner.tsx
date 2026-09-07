import React from 'react';
import { Play, Cpu } from 'lucide-react';

interface DemoBannerProps {
  isDemoActive: boolean;
  stepMessage?: string;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ isDemoActive, stepMessage }) => {
  if (!isDemoActive) return null;

  return (
    <div className="glass-panel border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-teal-950/60 p-4 rounded-2xl mb-6 shadow-xl shadow-cyan-500/10 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
          <Play className="w-5 h-5 fill-cyan-400 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
              AUTOMATED DEMO SEQUENCE IN PROGRESS
            </span>
            <span className="animate-ping inline-flex h-2 w-2 rounded-full bg-cyan-400 opacity-75"></span>
          </div>
          <p className="text-sm font-bold text-white mt-0.5">
            {stepMessage || "Executing end-to-end physical fault disambiguation & self-healing walkthrough..."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
        <Cpu className="w-4 h-4 text-emerald-400" />
        <span>DETERMINISTIC VERIFICATION MODE</span>
      </div>
    </div>
  );
};
