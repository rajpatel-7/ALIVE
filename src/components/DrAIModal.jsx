import { useState, useEffect } from 'react';
import { X, Mic, MicOff, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DrAIVisualizer from './DrAIVisualizer';
import { doctorLogic } from '../utils/doctorLogic';
import useVoiceAssistant from '../hooks/useVoiceAssistant';

export default function DrAIModal({ isOpen, onClose, result }) {
    const { isListening, isSpeaking, assistantMessage, transcript, speak, listen, stop, setTranscript } = useVoiceAssistant();
    const [messages, setMessages] = useState([]);
    const [processing, setProcessing] = useState(false);

    // Auto-start when opened
    useEffect(() => {
        if (isOpen) {
            const intro = `Hello ${result.name.split(' ')[0]}. I am Doctor AI. I've analyzed your report. Ask me anything about your results.`;
            setMessages([{ role: 'ai', text: intro }]);
            speak(intro, () => listen());
        } else {
            stop();
            setMessages([]);
        }
    }, [isOpen]);

    // Handle User Input (Transcript)
    useEffect(() => {
        if (transcript && !isSpeaking && !processing) {
            // Debounce slightly to ensure sentence completion? 
            // For now, let's assume short commands or manual trigger if needed.
            // Actually, useVoiceAssistant might keep listening. 
            // We'll set a simple timeout to "commit" the voice input or wait for a pause.

            const timer = setTimeout(() => {
                handleUserMessage(transcript);
            }, 1500); // 1.5s silence to trigger sending

            return () => clearTimeout(timer);
        }
    }, [transcript, isSpeaking, processing]);


    const handleUserMessage = async (text) => {
        setProcessing(true);
        stop(); // Stop listening while processing

        // Add User Message
        setMessages(prev => [...prev, { role: 'user', text }]);

        // AI Logic
        // Fake "thinking" delay for realism
        await new Promise(r => setTimeout(r, 1000));

        const response = doctorLogic.analyze(text, result);

        // Add AI Message
        setMessages(prev => [...prev, { role: 'ai', text: response }]);
        setTranscript(''); // Clear buffer

        // Speak response then Listen again
        speak(response, () => {
            setProcessing(false);
            listen();
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]"
            >
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-indigo-600 to-violet-600 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-full">
                            <Volume2 size={24} className="animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Dr. AI Agent</h2>
                            <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider">Virtual Cardiologist</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 min-h-[300px]">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-4 rounded-2xl max-w-[80%] text-sm font-medium shadow-sm 
                    ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {/* Typing Indicator */}
                    {processing && (
                        <div className="flex justify-start">
                            <div className="p-4 bg-white rounded-2xl rounded-tl-none border border-slate-100 flex gap-1">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Visualizer / Controls */}
                <div className="p-6 bg-white border-t border-slate-100 flex flex-col items-center gap-4">

                    {/* The Waveform */}
                    <div className="w-full relative h-24 bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                        <DrAIVisualizer state={isSpeaking ? 'speaking' : (isListening ? 'listening' : 'idle')} />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {/* Status Text Overlay */}
                            {!isListening && !isSpeaking && !processing && (
                                <p className="text-slate-400 font-bold text-sm">Tap mic to speak</p>
                            )}
                        </div>
                    </div>

                    {/* Mic Button */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                if (isListening) stop();
                                else listen();
                            }}
                            className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95
                   ${isListening
                                    ? 'bg-rose-500 text-white shadow-rose-500/40 animate-pulse'
                                    : 'bg-indigo-600 text-white shadow-indigo-600/40'
                                }`}
                        >
                            {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                        </button>
                    </div>

                    <p className="text-xs text-slate-400 font-medium">
                        {isListening ? "Listening..." : isSpeaking ? "Dr. AI is speaking..." : "Ready"}
                    </p>

                </div>
            </motion.div>
        </div>
    );
}
