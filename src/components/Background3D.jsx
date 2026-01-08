import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function LiquidGrid() {
    const mesh = useRef();
    const lightRef = useRef();

    // High density visual plane
    const geometry = useMemo(() => new THREE.PlaneGeometry(60, 40, 90, 60), []);

    useMemo(() => {
        geometry.userData = {
            originalPositions: geometry.attributes.position.array.slice()
        };
    }, [geometry]);

    // We use two vectors: 'target' (where mouse is) and 'current' (where light is)
    const target = useRef(new THREE.Vector3(0, 0, 0));
    const current = useRef(new THREE.Vector3(0, 0, 0));

    useFrame((state) => {
        const { raycaster, pointer, camera, clock } = state;

        // 1. RAYCASTING (Find Target)
        // 'pointer' uses normalized coordinates (-1 to 1) from the eventSource
        raycaster.setFromCamera(pointer, camera);

        // Intersect plane at Z=0
        const mathPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        // Copy the intersection point to our target ref
        raycaster.ray.intersectPlane(mathPlane, target.current);

        // 2. SMOOTH INTERPOLATION (The "Slow Follow" Effect)
        // Lerp factor: Lower = Slower/Smoother. 0.05 is very fluid.
        current.current.lerp(target.current, 0.05);

        // Update Light Position using INTERPOLATED position
        if (lightRef.current) {
            // slight offset Z for visibility
            lightRef.current.position.set(current.current.x, current.current.y, 2);
        }

        // Update Grid Distortion
        if (!mesh.current) return;

        const time = clock.getElapsedTime();
        const positions = mesh.current.geometry.attributes.position;
        const original = mesh.current.geometry.userData.originalPositions;
        const count = positions.count;

        const radius = 6;

        for (let i = 0; i < count; i++) {
            const x = original[i * 3];
            const y = original[i * 3 + 1];

            // Calc distance from the SMOOTHED position
            const dist = Math.sqrt(
                Math.pow(x - current.current.x, 2) +
                Math.pow(y - current.current.y, 2)
            );

            // Ambient Wave (Very slow, organic)
            const ambient = Math.sin(x * 0.3 + time * 0.05) * Math.cos(y * 0.2 + time * 0.05) * 0.15;

            // Interactive Ripple (Slower frequency)
            let effect = 0;
            if (dist < radius) {
                const strength = 1 - (dist / radius);
                // Even slower ripple
                effect = -Math.cos(dist * 2 - time * 0.8) * strength * 2.5;
            }

            positions.setZ(i, ambient + effect);
        }

        positions.needsUpdate = true;
    });

    return (
        <>
            <points ref={mesh} geometry={geometry}>
                <pointsMaterial
                    size={0.12}
                    color="#94a3b8"
                    transparent
                    opacity={0.7}
                    sizeAttenuation={true}
                />
            </points>
            <pointLight ref={lightRef} intensity={2.5} distance={10} decay={2} color="#6366f1" />
        </>
    );
}

export default function Background3D() {
    return (
        <div className="fixed inset-0 -z-10 bg-slate-50 pointer-events-none"> {/* Disable pointer events on container to let clicks pass through to app */}
            <Canvas
                camera={{ position: [0, 0, 15], fov: 45 }}
                eventSource={document.getElementById('root')} // Key fix: Listen to root events
                eventPrefix="client" // Use client coordinates
                style={{ pointerEvents: 'none' }} // Ensure canvas doesn't block UI
            >
                <color attach="background" args={['#f8fafc']} />
                <fog attach="fog" args={['#f8fafc', 5, 40]} />
                <ambientLight intensity={0.8} />
                <LiquidGrid />
            </Canvas>
        </div>
    );
}
