import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

function Neuron({ position, color, size }) {
    return (
        <mesh position={position}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.2} />
        </mesh>
    );
}

function Connection({ start, end, pulseSpeed }) {
    const ref = useRef();

    // Create a curve for the pulse to follow
    const curve = useMemo(() => new THREE.LineCurve3(new THREE.Vector3(...start), new THREE.Vector3(...end)), [start, end]);

    useFrame((state) => {
        if (ref.current) {
            // Move texture offset or update position of a pulse object
            // Here we literally move a small mesh along the line
            const t = (state.clock.elapsedTime * pulseSpeed) % 1;
            const pos = curve.getPoint(t);
            ref.current.position.set(pos.x, pos.y, pos.z);
        }
    });

    return (
        <>
            <line>
                <bufferGeometry>
                    <float32BufferAttribute attach="attributes-position" count={2} array={new Float32Array([...start, ...end])} itemSize={3} />
                </bufferGeometry>
                <lineBasicMaterial color="#cbd5e1" transparent opacity={0.5} />
            </line>

            <mesh ref={ref}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#3b82f6" toneMapped={false} />
            </mesh>
        </>
    );
}

function Network() {
    const group = useRef();

    // Define Layout
    const layers = [
        { x: -4, count: 5, color: '#4f46e5' }, // Input (Indigo)
        { x: 0, count: 7, color: '#8b5cf6' },  // Hidden (Violet)
        { x: 4, count: 2, color: '#f43f5e' },  // Output (Rose)
    ];

    const nodes = useMemo(() => {
        let list = [];
        layers.forEach((layer, layerIdx) => {
            for (let i = 0; i < layer.count; i++) {
                // Center vertical distribution
                const y = (i - (layer.count - 1) / 2) * 1.5;
                list.push({ pos: [layer.x, y, 0], color: layer.color, layer: layerIdx });
            }
        });
        return list;
    }, []);

    const connections = useMemo(() => {
        let list = [];
        nodes.forEach((node, idx) => {
            // Connect to next layer
            const nextLayerNodes = nodes.filter(n => n.layer === node.layer + 1);
            nextLayerNodes.forEach(target => {
                // Randomly connect subset to avoid visual clutter
                if (Math.random() > 0.3) {
                    list.push({ start: node.pos, end: target.pos, speed: 0.5 + Math.random() });
                }
            });
        });
        return list;
    }, [nodes]);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
        }
    });

    return (
        <group ref={group}>
            {nodes.map((n, i) => (
                <Neuron key={i} position={n.pos} color={n.color} size={0.25} />
            ))}
            {connections.map((c, i) => (
                <Connection key={i} start={c.start} end={c.end} pulseSpeed={c.speed} />
            ))}

            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <Text position={[0, -5, 0]} color="#1e293b" fontSize={0.5} anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff">
                    PROCESSING HEALTH DATA
                </Text>
            </Float>
        </group>
    );
}

export default function NeuralNetwork3D() {
    return (
        <div className="w-full h-96 relative">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, -10, -10]} color="#4f46e5" intensity={1} />
                <Center>
                    <Network />
                </Center>
            </Canvas>
        </div>
    );
}
