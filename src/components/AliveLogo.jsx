import React from 'react';

export default function AliveLogo({ className = "w-8 h-8", color = "currentColor" }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* The "A" Shape */}
            <path
                d="M20 90 L50 15 L80 90"
                stroke={color}
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* The Pulse Crossbar */}
            <path
                d="M35 65 L45 65 L50 50 L55 75 L60 65 L70 65"
                stroke="#4f46e5" // Indigo-600 to trigger 'Alive' feeling
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Defibrillator Spark (Optional accent) */}
            <circle cx="50" cy="15" r="4" fill="#4f46e5" className="animate-pulse" />
        </svg>
    );
}
