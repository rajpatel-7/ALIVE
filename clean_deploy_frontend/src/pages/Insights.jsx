import { Brain, Database, Zap, BarChart3, CheckCircle, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Insights() {
  const chartRef = useRef(null);
  const [inView, setInView] = useState(false);

  const modelAccuracy = [
    { model: "Logistic Regression", accuracy: 72.5 },
    { model: "K-Nearest Neighbors", accuracy: 71.2 },
    { model: "Gaussian Naive Bayes", accuracy: 71.4 },
    { model: "Decision Tree", accuracy: 68.8 },
    { model: "Linear SVC", accuracy: 73.0 },
    { model: "Random Forest", accuracy: 72.5 },
    { model: "XGBoost", accuracy: 73.6, production: true },
    { model: "Stacking Classifier", accuracy: 73.4 },
    { model: "Calibrated Classifier", accuracy: 73.6 },
  ];

  const sortedModels = [...modelAccuracy].sort((a, b) => b.accuracy - a.accuracy);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });

    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="container max-w-5xl mx-auto px-4">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-block p-4 rounded-2xl bg-indigo-50 mb-6">
          <Brain className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 font-['Plus_Jakarta_Sans']">Model Intelligence</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Cardio.AI is powered by an ensemble of advanced machine learning algorithms, rigorously tested against over 70,000 patient records to ensure clinical-grade reliability.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <InsightCard
          icon={<Database className="w-6 h-6 text-indigo-600" />}
          title="Extensive Training"
          description="Trained on robust clinical and lifestyle datasets comprising over 70,000+ validated patient records."
          delay={0}
        />
        <InsightCard
          icon={<Zap className="w-6 h-6 text-amber-500" />}
          title="XGBoost Core"
          description="Utilizing advanced gradient boosting with calibrated probabilities for maximum predictive precision."
          delay={0.1}
        />
        <InsightCard
          icon={<CheckCircle className="w-6 h-6 text-emerald-500" />}
          title="73.6% Precision"
          description="Validated on independent unseen test sets to ensure real-world reliability and minimize false negatives."
          delay={0.2}
        />
      </div>

      {/* Accuracy Chart */}
      <motion.div
        ref={chartRef}
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="card p-8 md:p-10"
      >
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <BarChart3 className="text-indigo-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Benchmark Performance</h2>
            <p className="text-slate-500 text-sm">Comparative accuracy across tested algorithms</p>
          </div>
        </div>

        <div className="space-y-6">
          {sortedModels.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 group">
              <span className={`w-48 text-sm font-semibold ${item.production ? 'text-indigo-700 font-bold' : 'text-slate-600'}`}>
                {item.model}
              </span>

              <div className="flex-1 h-10 bg-slate-50 rounded-lg overflow-hidden relative border border-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${item.accuracy}%` } : { width: 0 }}
                  transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
                  className={`
                    h-full flex items-center px-4 text-xs font-bold text-white shadow-sm
                    ${item.production
                      ? 'bg-indigo-600'
                      : 'bg-slate-300 opacity-60'
                    }
                  `}
                >
                  <span className="drop-shadow-md z-10">{item.accuracy}%</span>
                </motion.div>

                {/* Production Badge */}
                {item.production && (
                  <div className="absolute top-0 right-0 h-full flex items-center pr-3">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 bg-white px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                      <TrendingUp size={10} /> Active Model
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function InsightCard({ icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay, duration: 0.5 }}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
    >
      <div className="mb-4 p-3 bg-slate-50 rounded-xl inline-block">{icon}</div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm h-20">{description}</p>
    </motion.div>
  );
}
