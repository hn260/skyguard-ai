import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Thermometer, Droplets, Gauge } from 'lucide-react';
import type { TelemetryPoint } from '../types/skyguard';

interface TelemetryChartsProps {
  history: TelemetryPoint[];
}

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({ history }) => {
  const chartData = history.map((item) => ({
    time: item.timestamp ? item.timestamp.split(' ')[1] || item.timestamp : '',
    observed: item.temperature,
    expected: item.expected_temperature,
    corrected: item.corrected_temperature,
    humidity: item.humidity,
    pressure: item.pressure,
    isAnomaly: item.is_anomaly,
    faultType: item.fault_type
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Main Temperature & Self-Healing Reconstructed Chart (Takes 2 Columns) */}
      <div className="glass-panel p-5 rounded-2xl lg:col-span-2 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-rose-400" />
              TEMPERATURE TELEMETRY & RECONSTRUCTION (°C)
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Observed Raw Signal vs Self-Healing AI Corrected & Expected Baseline
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Observed
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Expected
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Corrected
            </span>
          </div>
        </div>

        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={['dataMin - 3', 'dataMax + 3']} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                  fontSize: '12px',
                  color: '#f8fafc'
                }}
              />
              <Line
                type="monotone"
                dataKey="observed"
                name="Observed Temp (°C)"
                stroke="#f43f5e"
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: '#f43f5e' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="expected"
                name="Expected Temp (°C)"
                stroke="#06b6d4"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="corrected"
                name="Corrected Temp (°C)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 2, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Telemetry: Humidity & Pressure (1 Column) */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              HUMIDITY & PRESSURE
            </h3>
            <span className="text-[10px] font-mono text-slate-400">PHYSICAL CROSS-LOOKUP</span>
          </div>
          <p className="text-xs text-slate-400 font-medium mb-4">
            Relative Humidity (%) & Barometric Pressure (hPa)
          </p>
        </div>

        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" domain={[10, 100]} stroke="#06b6d4" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" domain={['dataMin - 5', 'dataMax + 5']} stroke="#8b5cf6" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Line yAxisId="left" type="monotone" dataKey="humidity" name="RH (%)" stroke="#06b6d4" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="pressure" name="Pressure (hPa)" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold pt-3 border-t border-slate-800">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Droplets className="w-3.5 h-3.5" /> Relative Humidity
          </span>
          <span className="flex items-center gap-1.5 text-violet-400">
            <Gauge className="w-3.5 h-3.5" /> Pressure (hPa)
          </span>
        </div>
      </div>
    </div>
  );
};
