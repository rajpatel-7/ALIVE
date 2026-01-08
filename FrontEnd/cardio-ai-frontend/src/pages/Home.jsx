import { useNavigate } from "react-router-dom";
import { ArrowRight, Activity, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 md:py-16">

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            AI-Powered Risk Assessment
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Advanced Heart Health <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">
              Predictions
            </span>
          </h1>

          <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
            Utilizing state-of-the-art machine learning algorithms to analyze clinical data and provide instant, accurate cardiovascular risk assessments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/predict")}
              className="btn-primary flex items-center justify-center gap-2 group"
            >
              Start Analysis
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/about")}
              className="btn-secondary"
            >
              Learn More
            </button>
          </div>

          <div className="pt-8 grid grid-cols-3 gap-8 border-t border-slate-100">
            <Stat value="74%" label="Accuracy" />
            <Stat value="<1s" label="Speed" />
            <Stat value="24/7" label="Access" />
          </div>
        </motion.div>

        {/* Visual / Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-indigo-100 rounded-full blur-3xl opacity-30 transform translate-y-10"></div>
          <div className="relative bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
            {/* Abstract UI Representation */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Activity size={24} />
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                SYSTEM READY
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-24 rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="h-3 w-32 bg-slate-200 rounded-full mb-2"></div>
                  <div className="h-2 w-20 bg-slate-100 rounded-full"></div>
                </div>
              </div>
              <div className="h-24 rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500">
                  <Zap size={20} />
                </div>
                <div>
                  <div className="h-3 w-28 bg-slate-200 rounded-full mb-2"></div>
                  <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
                </div>
              </div>

              {/* Fake Chart */}
              <div className="h-32 mt-6 flex items-end justify-between gap-2 px-2">
                {[40, 60, 45, 75, 55, 80, 70].map((h, i) => (
                  <div key={i} className="w-full bg-indigo-100 rounded-t-lg hover:bg-indigo-200 transition-colors" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 text-center border-t border-slate-100">
        <p className="text-slate-400 text-sm">
          &copy; 2026 ALIVE AI. All rights reserved.
        </p>
        <div className="mt-2 flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
          <span>Designed & Engineered by</span>
          <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Raj Vekariya
          </span>
        </div>
      </footer>

    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">{value}</div>
      <div className="text-sm text-slate-500 font-medium">{label}</div>
    </div>
  )
}