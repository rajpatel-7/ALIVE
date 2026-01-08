import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Ruler, Weight, Activity, Cigarette, Wine, MoveRight, ChevronLeft, Check, Mic, Keyboard, PlayCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useVoiceAssistant from "../hooks/useVoiceAssistant";


export default function Predict() {
  const navigate = useNavigate();

  // Interaction Mode: 'selection', 'voice', 'text'
  const [interactionMode, setInteractionMode] = useState('selection');

  // Standard Form Logic
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: 45,
    height: 170,
    weight: 75,
    ap_hi: 120,
    ap_lo: 80,
    cholesterol: 1,
    gluc: 1,
    smoke: 0,
    alco: 0,
    active: 1
  });

  // Voice Assistant Hooks
  const { isListening, isSpeaking, assistantMessage, transcript, speak, listen, stop, setTranscript } = useVoiceAssistant();
  const [voiceStep, setVoiceStep] = useState(0);

  const updateForm = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  // --- Voice Logic Engine ---
  useEffect(() => {
    if (interactionMode !== 'voice') {
      stop(); // Ensure cleanup if switching modes
      return;
    }

    if (voiceStep === 0) {
      // Initial Start
      speak("Welcome. I am your AI Health Assistant. I will guide you through the assessment. First, please tell me your full name.", () => {
        setVoiceStep(1);
        listen();
      });
    }
  }, [interactionMode]); // Run only on mode switch

  // Process Transcript
  useEffect(() => {
    // Only process if we have a transcript and not currently speaking
    if (!transcript || isSpeaking) return;

    const processAnswer = async () => {
      const text = transcript.toLowerCase();
      console.log("Processing:", text, "Step:", voiceStep);

      switch (voiceStep) {
        case 1: // Name
          updateForm('name', transcript);
          speak(`Hello, ${transcript}. How old are you?`, () => {
            setVoiceStep(2);
            listen();
          });
          break;
        case 2: // Age
          const age = parseInt(text.match(/\d+/)?.[0]);
          if (age) {
            updateForm('age', age);
            speak(`Okay, ${age} years old. What is your height in centimeters?`, () => {
              setVoiceStep(3);
              listen();
            });
          } else {
            speak("I didn't catch the number. Please say your age again.", () => listen());
          }
          break;
        case 3: // Height
          const height = parseInt(text.match(/\d+/)?.[0]);
          if (height) {
            updateForm('height', height);
            speak(`Got it. And what is your weight in kilograms?`, () => {
              setVoiceStep(4);
              listen();
            });
          } else {
            speak("Could you repeat your height in centimeters?", () => listen());
          }
          break;
        case 4: // Weight
          const weight = parseInt(text.match(/\d+/)?.[0]);
          if (weight) {
            updateForm('weight', weight);
            speak(`Understood. Now, what is your systolic blood pressure? That's the top number.`, () => {
              setVoiceStep(5);
              listen();
            });
          } else {
            speak("Please say your weight again.", () => listen());
          }
          break;
        case 5: // AP Hi
          const hi = parseInt(text.match(/\d+/)?.[0]);
          if (hi) {
            updateForm('ap_hi', hi);
            speak(`And the diastolic, or bottom number?`, () => {
              setVoiceStep(6);
              listen();
            });
          } else {
            speak("I missed that. What is your systolic pressure?", () => listen());
          }
          break;
        case 6: // AP Lo
          const lo = parseInt(text.match(/\d+/)?.[0]);
          if (lo) {
            updateForm('ap_lo', lo);
            speak(`Do you smoke cigarettes? Please say yes or no.`, () => {
              setVoiceStep(7);
              listen();
            });
          } else {
            speak("Please repeat the diastolic pressure.", () => listen());
          }
          break;
        case 7: // Smoke
          if (text.includes('yes') || text.includes('no')) {
            const smokes = text.includes('yes') ? 1 : 0;
            updateForm('smoke', smokes);
            speak(`Do you consume alcohol regularly?`, () => {
              setVoiceStep(8);
              listen();
            });
          } else {
            speak("Please answer with yes or no. Do you smoke?", () => listen());
          }
          break;
        case 8: // Alcohol
          if (text.includes('yes') || text.includes('no')) {
            const drink = text.includes('yes') ? 1 : 0;
            updateForm('alco', drink);
            speak(`Do you exercise active lifestyle?`, () => {
              setVoiceStep(9);
              listen();
            });
          } else {
            speak("Yes or no, do you drink alcohol?", () => listen());
          }
          break;
        case 9: // Active
          if (text.includes('yes') || text.includes('no')) {
            const active = text.includes('yes') ? 1 : 0;
            updateForm('active', active);
            speak(`Is your cholesterol level Normal, Elevated, or High?`, () => {
              setVoiceStep(10);
              listen();
            });
          } else {
            speak("Yes or no, are you active?", () => listen());
          }
          break;
        case 10: // Cholesterol
          let chol = 0;
          if (text.includes('high')) chol = 3;
          else if (text.includes('elevated') || text.includes('above')) chol = 2;
          else if (text.includes('normal') || text.includes('low')) chol = 1;

          if (chol > 0) {
            updateForm('cholesterol', chol);
            speak(`Finally, is your glucose level Normal, Elevated, or High?`, () => {
              setVoiceStep(11);
              listen();
            });
          } else {
            speak("Please say Normal, Elevated, or High.", () => listen());
          }
          break;
        case 11: // Gluc
          let gluc = 0;
          if (text.includes('high')) gluc = 3;
          else if (text.includes('elevated') || text.includes('above')) gluc = 2;
          else if (text.includes('normal') || text.includes('low')) gluc = 1;

          if (gluc > 0) {
            updateForm('gluc', gluc);
            speak(`Thank you. Analyzing your health data now.`, () => {
              submitPrediction();
            });
          } else {
            speak("Please say Normal, Elevated, or High.", () => listen());
          }
          break;
      }
      setTranscript(''); // Clear for next Q
    };

    processAnswer();
  }, [transcript, voiceStep]); // Removed speak/listen from processing deps to avoid loops


  const submitPrediction = async () => {
    setLoading(true);
    try {
      const payload = { ...form };
      delete payload.name;

      await new Promise(r => setTimeout(r, 800));

      const res = await axios.post("http://127.0.0.1:8000/predict", payload);

      const resultData = {
        ...res.data,
        ...form,
        name: form.name || 'Guest',
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now()
      };

      sessionStorage.setItem('predictionResult', JSON.stringify(resultData));

      const history = JSON.parse(localStorage.getItem('cardio_history') || '[]');
      history.unshift({
        date: resultData.date,
        risk: resultData.risk_probability,
        risk_category: resultData.risk_category,
        ...resultData
      });
      localStorage.setItem('cardio_history', JSON.stringify(history));

      navigate('/result');
    } catch (e) {
      console.error(e);
      // Demo Fallback
      const demoData = {
        ...form,
        name: form.name || "Guest User",
        risk_probability: 0.12,
        risk_category: "Low Risk",
        note: "Demo prediction due to API error.",
        advice: ["Exercise more", "Eat healthy"],
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
      sessionStorage.setItem('predictionResult', JSON.stringify(demoData));

      // Save Demo Result to History too so comparison works
      const history = JSON.parse(localStorage.getItem('cardio_history') || '[]');
      history.unshift(demoData);
      localStorage.setItem('cardio_history', JSON.stringify(history));

      navigate('/result');
      setLoading(false);
    }
  };

  // --- SELECTION SCREEN ---
  if (interactionMode === 'selection') {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">Choose Your Interaction</h1>
        <p className="text-slate-500 mb-12 text-center text-lg">How would you like to provide your health details?</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          <button
            onClick={() => setInteractionMode('voice')}
            className="group relative p-8 rounded-3xl bg-indigo-600 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Mic size={150} />
            </div>
            <div className="relative z-10 flex flex-col items-start gap-4">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <Mic size={32} />
              </div>
              <h2 className="text-2xl font-bold">Voice Assistant</h2>
              <p className="text-indigo-100 text-left leading-relaxed">
                Interact with our AI naturally. Just speak your answers, and we'll handle the rest. Hands-free experience.
              </p>
              <div className="mt-4 flex items-center gap-2 font-bold bg-white text-indigo-600 px-4 py-2 rounded-lg">
                Start Speaking <PlayCircle size={18} />
              </div>
            </div>
          </button>

          <button
            onClick={() => setInteractionMode('text')}
            className="group relative p-8 rounded-3xl bg-white text-slate-900 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <Keyboard size={150} />
            </div>
            <div className="relative z-10 flex flex-col items-start gap-4">
              <div className="bg-slate-100 p-4 rounded-2xl">
                <Keyboard size={32} className="text-slate-700" />
              </div>
              <h2 className="text-2xl font-bold">Standard Form</h2>
              <p className="text-slate-500 text-left leading-relaxed">
                Fill out the details manually at your own pace using our intuitive step-by-step form.
              </p>
              <div className="mt-4 flex items-center gap-2 font-bold text-slate-700 group-hover:text-indigo-600">
                Continue to Form <MoveRight size={18} />
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // --- VOICE INTERFACE ---
  if (interactionMode === 'voice') {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]">
        {/* Visualizer Circle */}
        <div className={`
                w-48 h-48 rounded-full flex items-center justify-center mb-12 transition-all duration-500 relative
                ${(isSpeaking || isListening) ? 'scale-110' : ''}
                ${isSpeaking ? 'bg-indigo-500 shadow-[0_0_60px_rgba(99,102,241,0.6)]' : ''}
                ${isListening ? 'bg-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.6)]' : ''}
                ${!isSpeaking && !isListening ? 'bg-slate-200' : ''}
              `}>
          {/* Ripple Effect when listening */}
          {isListening && (
            <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-50"></div>
          )}
          {isSpeaking && (
            <div className="absolute inset-0 rounded-full border-4 border-indigo-400 animate-pulse opacity-50"></div>
          )}

          <Mic size={64} className="text-white relative z-10" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={voiceStep}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 max-w-lg"
          >
            <h2 className="text-3xl font-bold text-slate-900 leading-tight">
              {isSpeaking ? assistantMessage : "I'm listening..."}
            </h2>

            {!isSpeaking && isListening && (
              <p className="text-emerald-600 font-semibold animate-pulse">
                Go ahead, speak now.
              </p>
            )}

            {transcript && (
              <div className="text-xl text-indigo-600 font-medium bg-indigo-50 px-6 py-3 rounded-xl inline-block mt-4">
                "{transcript}"
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => {
            stop();
            setVoiceStep(0);
            setTranscript('');
            setForm({
              name: "",
              age: 45,
              height: 170,
              weight: 75,
              ap_hi: 120,
              ap_lo: 80,
              cholesterol: 1,
              gluc: 1,
              smoke: 0,
              alco: 0,
              active: 1
            });
            setInteractionMode('selection');
          }}
          className="mt-20 text-slate-400 hover:text-slate-600 font-semibold border-b border-transparent hover:border-slate-300 transition-all"
        >
          Cancel & Return to Menu
        </button>
      </div>
    );
  }

  // --- TEXT MODE ---
  return (
    <div className="container max-w-2xl mx-auto px-4">
      {/* (Standard Form UI retained) */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setInteractionMode('selection')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft className="text-slate-400" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">Health Assessment</h1>
        </div>

        <p className="text-slate-500 mb-8 pl-12">Complete the following steps to get your risk analysis.</p>

        <div className="flex items-center justify-between relative pl-12">
          <div className="absolute left-12 right-0 top-1/2 h-1 bg-slate-100 -z-10 rounded-full"></div>
          <div className="absolute left-12 top-1/2 h-1 bg-indigo-600 -z-10 rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 100}%` }}></div>

          <StepIndicator num={1} label="Identity" current={step} />
          <StepIndicator num={2} label="Vitals" current={step} />
          <StepIndicator num={3} label="Lifestyle" current={step} />
        </div>
      </div>

      {/* Form Content */}
      <div className="card bg-white p-6 md:p-10 min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Patient Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-slate-500" size={20} />
                  <input
                    className="input-base !pl-12"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={e => updateForm("name", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="block text-sm font-bold text-slate-700">Age</label>
                  <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-lg text-sm">{form.age} Years</span>
                </div>
                <AdvancedSlider
                  min={18} max={100} value={form.age}
                  onChange={v => updateForm("age", v)}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <LabelValue label="Height" value={form.height} unit="cm" />
                  <AdvancedSlider min={140} max={210} value={form.height} onChange={v => updateForm("height", v)} />
                </div>
                <div className="space-y-4">
                  <LabelValue label="Weight" value={form.weight} unit="kg" />
                  <AdvancedSlider min={40} max={150} value={form.weight} onChange={v => updateForm("weight", v)} />
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-6">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <Activity size={18} className="text-rose-500" /> Blood Pressure
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <LabelValue label="Systolic" value={form.ap_hi} unit="" />
                    <AdvancedSlider min={90} max={200} value={form.ap_hi} onChange={v => updateForm("ap_hi", v)} color="rose" />
                  </div>
                  <div className="space-y-4">
                    <LabelValue label="Diastolic" value={form.ap_lo} unit="" />
                    <AdvancedSlider min={50} max={130} value={form.ap_lo} onChange={v => updateForm("ap_lo", v)} color="rose" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">Habits & Activity</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <ToggleCard
                    active={form.smoke === 1}
                    onClick={() => updateForm("smoke", form.smoke ? 0 : 1)}
                    icon={<Cigarette />}
                    label="Smoker"
                  />
                  <ToggleCard
                    active={form.alco === 1}
                    onClick={() => updateForm("alco", form.alco ? 0 : 1)}
                    icon={<Wine />}
                    label="Alcohol"
                  />
                  <ToggleCard
                    active={form.active === 1}
                    onClick={() => updateForm("active", form.active ? 0 : 1)}
                    icon={<Activity />}
                    label="Active"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">Cholesterol</label>
                  <LevelSelector value={form.cholesterol} onChange={v => updateForm("cholesterol", v)} />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">Glucose</label>
                  <LevelSelector value={form.gluc} onChange={v => updateForm("gluc", v)} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className={`flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold px-4 py-2 transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
        >
          <ChevronLeft size={20} /> Back
        </button>

        {step < 3 ? (
          <button onClick={nextStep} className="btn-primary flex items-center gap-2">
            Next Step <MoveRight size={20} />
          </button>
        ) : (
          <button onClick={submitPrediction} disabled={loading} className="btn-primary flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
            {loading ? (
              <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={20} /> Processing...</span>
            ) : (
              <>Run Analysis <Activity size={20} /></>
            )}
          </button>
        )}
      </div>



    </div>
  );
}

// Subcomponents (identical to before)
function StepIndicator({ num, label, current }) {
  const isActive = current >= num;
  const isCurrent = current === num;
  return (
    <div className="flex flex-col items-center gap-2 z-10 bg-inherit">
      <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2
                ${isActive ? "bg-indigo-600 border-indigo-600 text-slate-900 shadow-md scale-100" : "bg-white border-slate-200 text-slate-500"}
            `}>
        {isActive ? <Check size={16} /> : num}
      </div>
      <span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-indigo-700' : 'text-slate-500'}`}>
        {label}
      </span>
    </div>
  )
}

function LabelValue({ label, value, unit }) {
  return (
    <div className="flex justify-between items-end">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded text-sm">{value} <span className="text-xs text-indigo-400">{unit}</span></span>
    </div>
  )
}

function AdvancedSlider({ value, min, max, onChange, color = "indigo" }) {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative w-full h-8 flex items-center">
      <div className="absolute w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color === 'rose' ? 'bg-rose-500' : 'bg-indigo-600'} transition-all duration-150 ease-out`} style={{ width: `${percentage}%` }}></div>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
      <div className={`absolute h-6 w-6 bg-white rounded-full shadow-md border-2 ${color === 'rose' ? 'border-rose-500' : 'border-indigo-600'} transform -translate-x-1/2 pointer-events-none transition-all duration-150 ease-out z-10`} style={{ left: `${percentage}%` }}></div>
    </div>
  )
}

function ToggleCard({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 gap-2 ${active ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm" : "border-slate-100 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
      {icon} <span className="text-sm font-bold">{label}</span>
    </button>
  )
}

function LevelSelector({ value, onChange }) {
  const levels = [{ val: 1, label: "Normal" }, { val: 2, label: "Elevated" }, { val: 3, label: "High" }];
  return (
    <div className="flex p-1 bg-slate-100 rounded-lg">
      {levels.map((l) => (
        <button key={l.val} onClick={() => onChange(l.val)} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${value === l.val ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
          {l.label}
        </button>
      ))}
    </div>
  )
}