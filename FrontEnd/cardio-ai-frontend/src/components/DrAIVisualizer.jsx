import { useRef, useEffect } from 'react';

export default function DrAIVisualizer({ state }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let phase = 0;

        const render = () => {
            // Resize
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            // Config based on state
            // IDLE: Low amplitude, slow speed
            // LISTENING: Med amplitude, fast speed
            // SPEAKING: High amplitude, smooth speed
            let amplitude = 10;
            let speed = 0.05;
            let color = 'rgba(99, 102, 241, 0.5)'; // Indigo

            if (state === 'listening') {
                amplitude = 30; // varied by mocked volume
                speed = 0.2;
                color = 'rgba(16, 185, 129, 0.5)'; // Emerald
            } else if (state === 'speaking') {
                amplitude = 50;
                speed = 0.1;
                color = 'rgba(244, 63, 94, 0.5)'; // Rose
            }

            ctx.lineWidth = 4;
            ctx.strokeStyle = color;
            ctx.beginPath();

            // Draw 3 sine waves for "Siri" effect
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                for (let x = 0; x < width; x++) {
                    const y = height / 2 +
                        Math.sin(x * 0.01 + phase + i) * amplitude * Math.sin(x / width * Math.PI); // Window function
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            phase += speed;
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [state]);

    return <canvas ref={canvasRef} className="w-full h-32" />;
}
