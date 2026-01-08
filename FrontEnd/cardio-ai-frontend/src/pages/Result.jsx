import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RefreshCw, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PDFDownloadLink } from '@react-pdf/renderer';
import MedicalReportPDF from "../components/MedicalReportPDF";
import PageTransition from "../components/PageTransition";

export default function Result() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [comparison, setComparison] = useState(null);

  // Time Machine State
  const [simAge, setSimAge] = useState(0); // Will initialize after result loads
  const [simSmoke, setSimSmoke] = useState(false);
  const [simActive, setSimActive] = useState(false);
  const [simRisk, setSimRisk] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("predictionResult");
    if (stored) {
      const data = JSON.parse(stored);
      setResult(data);

      // Initialize Sim state
      setSimAge(data.age);
      setSimSmoke(Boolean(data.smoke));
      setSimActive(Boolean(data.active));
      setSimRisk(data.risk_probability);

      // Find previous history for comparison
      const history = JSON.parse(localStorage.getItem('cardio_history') || '[]');
      const previous = history.find(h =>
        h.name.toLowerCase() === data.name.toLowerCase() &&
        h.timestamp !== data.timestamp
      );
      // ... existing comparison logic (kept from previous code) ...
      if (previous) {
        const riskDiff = (previous.risk_probability * 100) - (data.risk_probability * 100);
        setComparison({
          prevDate: previous.date,
          prevRisk: (previous.risk_probability * 100).toFixed(1),
          diff: riskDiff.toFixed(1),
          isImprovement: riskDiff > 0
        });
      }

      if (data.risk_category === "Low Risk") {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#818cf8', '#ffffff'] // Indigo Theme
        });
      }
    }
  }, [navigate]);

  // Real-time Simulation Logic
  useEffect(() => {
    if (!result) return;

    // Calculate Delta
    let risk = result.risk_probability;

    // Age Impact: Risk increases ~1% per year
    const ageDiff = simAge - result.age;
    risk += (ageDiff * 0.008);

    // Smoke Impact: Quitting reduces risk significantly
    if (result.smoke && !simSmoke) risk -= 0.15; // Quit
    if (!result.smoke && simSmoke) risk += 0.15; // Started

    // Active Impact
    if (result.active && !simActive) risk += 0.10; // Stopped
    if (!result.active && simActive) risk -= 0.10; // Started

    // Clamp
    risk = Math.max(0.01, Math.min(0.99, risk));
    setSimRisk(risk);

  }, [simAge, simSmoke, simActive, result]);

  if (!result) return null;

  const isHighRisk = result.risk_probability > 0.5;
  const riskPercent = (result.risk_probability * 100).toFixed(1);
  const colorTheme = isHighRisk ? "rose" : "emerald";

  return (
    <div className="container max-w-4xl mx-auto px-4">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Analysis Report</h1>
        <p className="text-slate-500">Patient: <span className="font-semibold text-slate-800">{result.name}</span></p>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="card p-8 md:p-12 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-12 items-center">

          {/* Visual Gauge */}
          <div className="w-64 h-64 relative shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="128" cy="128" r="110" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
              <circle
                cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="12" fill="transparent"
                className={`${isHighRisk ? 'text-rose-500' : 'text-emerald-500'} transition-all duration-1000 ease-out`}
                strokeDasharray={2 * Math.PI * 110}
                strokeDashoffset={2 * Math.PI * 110 * (1 - result.risk_probability)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-extrabold text-slate-900">{riskPercent}%</span>
              <span className={`text-sm font-bold uppercase tracking-wide mt-2 px-3 py-1 rounded-full ${isHighRisk ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {result.risk_category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 flex-1 text-center md:text-left">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Clinical Assessment</h2>
              <p className="text-slate-500 leading-relaxed">{result.note}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Key Recommendations</h3>
              <ul className="space-y-3">
                {(result.advice || []).map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600 items-start">
                    {isHighRisk
                      ? <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                      : <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    }
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* History Comparison */}
      {/* History Comparison */}
      {comparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-8 bg-indigo-50/80 text-slate-900 border border-indigo-100 overflow-hidden relative"
        >
          {/* ... existing comparison code ... */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <RefreshCw size={120} className="text-indigo-900" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Progress Tracker</h3>
              <p className="text-slate-500 text-sm">Compared to your last visit on {comparison.prevDate}</p>
            </div>

            <div className="flex items-center gap-4 bg-white/60 p-4 rounded-xl border border-white/50 shadow-sm backdrop-blur-sm">
              <div className={`p-3 rounded-lg ${comparison.isImprovement ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {comparison.isImprovement ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {comparison.diff > 0 ? '-' : '+'}{Math.abs(comparison.diff)}%
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Risk {comparison.isImprovement ? 'Decreased' : 'Increased'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ⏳ HEALTH TIME MACHINE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="card p-8 mb-8 bg-white/80 border border-indigo-100 backdrop-blur-sm relative overflow-hidden ring-4 ring-indigo-50/50"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <RefreshCw className="text-indigo-600 animate-spin-slow" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Health Time Machine</h2>
              <p className="text-slate-500 text-sm">Simulate your future. See how lifestyle changes impact your risk.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Controls */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="font-bold text-slate-700">Future Age Simulator</label>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-indigo-600">+{simAge - result.age}</span>
                    <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Years</span>
                  </div>
                </div>

                <div className="relative w-full h-8 flex items-center select-none group">
                  <div className="absolute w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-150 ease-out"
                      style={{ width: `${((simAge - result.age) / 20) * 100}%` }}
                    ></div>
                  </div>
                  <input
                    type="range" min={result.age} max={result.age + 20}
                    value={simAge} onChange={(e) => setSimAge(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                  />
                  <div
                    className="absolute h-6 w-6 bg-white rounded-full shadow-md border-2 border-indigo-600 pointer-events-none transition-all duration-150 ease-out z-20"
                    style={{ left: `calc(${((simAge - result.age) / 20) * 100}% - 12px)` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">
                  <span>Current Age: {result.age}</span>
                  <span>Max: {result.age + 20}</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="font-bold text-slate-700 block">Lifestyle Adjustments</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSimSmoke(!simSmoke)}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-bold
                                  ${!simSmoke ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-600'}
                                  `}
                  >
                    {simSmoke ? 'Smoking' : 'Smoke-Free'}
                  </button>
                  <button
                    onClick={() => setSimActive(!simActive)}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-bold
                                  ${simActive ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'}
                                  `}
                  >
                    {simActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Result */}
            <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <span className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-4">Projected Risk</span>
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="#cbd5e1" strokeWidth="12" fill="transparent" />
                  <circle
                    cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                    className={`${simRisk > 0.5 ? 'text-rose-500' : 'text-emerald-500'} transition-all duration-500`}
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={2 * Math.PI * 88 * (1 - simRisk)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-slate-900">{(simRisk * 100).toFixed(1)}%</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded mt-1 
                                  ${simRisk < result.risk_probability ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}
                              `}>
                    {simRisk < result.risk_probability ? 'IMPROVING' : simRisk > result.risk_probability ? 'WORSENING' : 'NO CHANGE'}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-slate-500 max-w-[200px]">
                {simRisk < result.risk_probability
                  ? "Great job! These changes could significantly lower your long-term risk."
                  : "Caution: Maintaining these habits over time may increase your cardiovascular risk."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {result && (
          <PDFDownloadLink
            document={<MedicalReportPDF data={result} />}
            fileName={`CardioAI_Report_${result.name.replace(/\s+/g, '_')}.pdf`}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            {({ blob, url, loading, error }) => (
              loading ? 'Generating PDF...' : <><FileText size={18} /> Download Report</>
            )}
          </PDFDownloadLink>
        )}

        <button onClick={() => navigate('/predict')} className="btn-primary flex items-center justify-center gap-2">
          <RefreshCw size={18} /> New Analysis
        </button>
      </div>



    </PageTransition >
  );
}