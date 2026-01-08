import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, TorusKnot } from "@react-three/drei";

export default function HeartModel() {
    const ref = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (ref.current) {
            // Heartbeat animation
            ref.current.scale.setScalar(1 + Math.sin(t * 3) * 0.05);
            // Rotation
            ref.current.rotation.x = Math.sin(t * 0.2) * 0.1;
            ref.current.rotation.y += 0.005;
        }
    });

    return (
        <group dispose={null}>
            {/* Abstract "Heart" Representation: A complex knot with organic distortion */}
            <mesh ref={ref} position={[0, 0, 0]}>
                <TorusKnot args={[1, 0.3, 128, 16]} >
                    <MeshDistortMaterial
                        color="#ef4444"
                        attach="material"
                        distort={0.4}
                        speed={2}
                        roughness={0.2}
                        metalness={0.8}
                        emissive="#7f1d1d"
                        emissiveIntensity={0.5}
                    />
                </TorusKnot>
            </mesh>

            {/* Surrounding Energy Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.5, 0.02, 16, 100]} />
                <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} toneMapped={false} />
            </mesh>
        </group>
    );
}
