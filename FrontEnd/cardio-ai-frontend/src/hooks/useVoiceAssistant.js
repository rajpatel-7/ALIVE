import { useState, useEffect, useRef, useCallback } from 'react';

export default function useVoiceAssistant() {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [assistantMessage, setAssistantMessage] = useState('');

    const recognitionRef = useRef(null);
    const synth = window.speechSynthesis;

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false; // Stop after one sentence
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                console.log("Mic started");
                setIsListening(true);
            };

            recognition.onend = () => {
                console.log("Mic ended");
                setIsListening(false);
            };

            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                console.log("Heard:", text);
                setTranscript(text);
            };

            recognition.onerror = (event) => {
                console.error("Speech Rec Error:", event.error);
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.abort();
            if (synth) synth.cancel();
        };
    }, []);

    const speak = useCallback((text, onEndCallback) => {
        if (!synth) return;

        // Ensure clean state
        if (recognitionRef.current) recognitionRef.current.abort();
        synth.cancel();

        setIsListening(false); // Force visual update

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;

        const voices = synth.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setAssistantMessage(text);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            // Small delay before triggering next action (usually listening)
            // prevents "barge-in" self-triggering if using speakers
            setTimeout(() => {
                if (onEndCallback) onEndCallback();
            }, 300);
        };

        utterance.onerror = (e) => {
            console.error("Speech Synthesis Error:", e);
            setIsSpeaking(false);
            // Attempt to proceed anyway if it was just a playback error
            setTimeout(() => {
                if (onEndCallback) onEndCallback();
            }, 300);
        };

        synth.speak(utterance);
    }, [synth]);

    const listen = useCallback(() => {
        if (recognitionRef.current) {
            // Ensure we aren't already running
            recognitionRef.current.abort();

            // Wait slightly for abort to process
            setTimeout(() => {
                setTranscript('');
                try {
                    recognitionRef.current.start();
                } catch (e) {
                    console.error("Start error:", e);
                }
            }, 100);
        }
    }, []);

    const stop = useCallback(() => {
        if (synth) synth.cancel();
        if (recognitionRef.current) recognitionRef.current.abort();
        setIsListening(false);
        setIsSpeaking(false);
    }, [synth]);

    return {
        isListening,
        isSpeaking,
        transcript,
        assistantMessage,
        speak,
        listen,
        stop,
        setTranscript
    };
}
