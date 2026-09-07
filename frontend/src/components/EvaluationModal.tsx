import React from 'react';
import { X, CheckCircle2, Award } from 'lucide-react';
import type { EvaluationMetrics } from '../types/skyguard';

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: EvaluationMetrics | null;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({ isOpen, onClose, metrics }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700/80 p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              AI MODEL EVALUATION & BENCHMARK
            </h2>
            <p className="text-xs text-slate-400">
              Evaluated on 150 ground-truth synthetic fault injection ticks + genuine weather scenarios
            </p>
          </div>
        </div>

        {metrics ? (
          <div className="space-y-6">
            {/* 4 Core ML Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">PRECISION</span>
                <div className="text-2xl font-black text-cyan-400 mt-1">{(metrics.precision * 100).toFixed(1)}%</div>
                <span className="text-[10px] text-slate-400">TP / (TP + FP)</span>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">RECALL</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">{(metrics.recall * 100).toFixed(1)}%</div>
                <span className="text-[10px] text-slate-400">TP / (TP + FN)</span>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">F1 SCORE</span>
                <div className="text-2xl font-black text-violet-400 mt-1">{(metrics.f1_score * 100).toFixed(1)}%</div>
                <span className="text-[10px] text-slate-400">Harmonic Mean</span>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">FALSE POSITIVE RATE</span>
                <div className="text-2xl font-black text-rose-400 mt-1">{(metrics.false_positive_rate * 100).toFixed(1)}%</div>
                <span className="text-[10px] text-slate-400">FP / (FP + TN)</span>
              </div>
            </div>

            {/* Genuine Weather Discrimination Card */}
            <div className="bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 p-4 rounded-xl border border-emerald-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-300 uppercase">
                    GENUINE WEATHER DISCRIMINATION ACCURACY
                  </h4>
                  <p className="text-xs text-slate-300">
                    Distinguishes real warm fronts from sensor drift using physical multivariate correlation
                  </p>
                </div>
              </div>
              <span className="text-xl font-black text-emerald-400">
                {metrics.genuine_weather_discrimination_accuracy}
              </span>
            </div>

            {/* Confusion Matrix Breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">
                CONFUSION MATRIX BREAKDOWN ({metrics.total_evaluated_samples} EVALUATED TICKS)
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between">
                  <span className="text-emerald-400">True Positives (TP):</span>
                  <span className="font-bold text-white">{metrics.true_positives}</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between">
                  <span className="text-rose-400">False Positives (FP):</span>
                  <span className="font-bold text-white">{metrics.false_positives}</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between">
                  <span className="text-cyan-400">True Negatives (TN):</span>
                  <span className="font-bold text-white">{metrics.true_negatives}</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between">
                  <span className="text-amber-400">False Negatives (FN):</span>
                  <span className="font-bold text-white">{metrics.false_negatives}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400">Loading benchmark evaluation metrics...</div>
        )}
      </div>
    </div>
  );
};
