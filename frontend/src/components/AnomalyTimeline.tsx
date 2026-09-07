import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { Activity } from 'lucide-react';
import type { TelemetryPoint } from '../types/skyguard';

interface AnomalyTimelineProps {
  history: TelemetryPoint[];
}

export const AnomalyTimeline: React.FC<AnomalyTimelineProps> = ({ history }) => {
  const chartData = history.map((item) => ({
    time: item.timestamp ? item.timestamp.split(' ')[1] || item.timestamp : '',
    score: item.anomaly_score,
    isFault: item.is_fault
  }));

  return (
    <div className="glass-panel p-5 rounded-2xl mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            ANOMALY SCORE TEMPORAL TIMELINE (0.0 - 1.0)
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Multi-layer ensemble score evaluated per observation tick
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-amber-400 flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-amber-400" /> Warning (0.45)
          </span>
          <span className="text-rose-400 flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-rose-500" /> Critical (0.75)
          </span>
        </div>
      </div>

      <div className="w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 1.0]} stroke="#64748b" tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: '#334155',
                borderRadius: '12px',
                fontSize: '12px'
              }}
            />
            <ReferenceLine y={0.45} stroke="#f59e0b" strokeDasharray="3 3" />
            <ReferenceLine y={0.75} stroke="#f43f5e" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="score"
              name="Anomaly Score"
              stroke="#f43f5e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#scoreGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
