import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

function HologramCar() {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Car chassis frame */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[3.2, 0.4, 1.4]} />
        <meshStandardMaterial color="#06b6d4" wireframe transparent opacity={0.65} emissive="#06b6d4" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Car cockpit/cabin */}
      <mesh position={[-0.2, 0.7, 0]}>
        <boxGeometry args={[1.6, 0.5, 1.2]} />
        <meshStandardMaterial color="#3b82f6" wireframe transparent opacity={0.5} emissive="#3b82f6" emissiveIntensity={0.5} />
      </mesh>

      {/* Front spoiler/skirt */}
      <mesh position={[1.7, 0.2, 0]}>
        <boxGeometry args={[0.3, 0.2, 1.3]} />
        <meshStandardMaterial color="#0891b2" wireframe />
      </mesh>

      {/* Wheels */}
      {/* Front Left */}
      <mesh position={[1, 0.1, 0.75]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#64748b" wireframe />
      </mesh>
      {/* Front Right */}
      <mesh position={[1, 0.1, -0.75]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#64748b" wireframe />
      </mesh>
      {/* Rear Left */}
      <mesh position={[-1, 0.1, 0.75]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.35, 16]} />
        <meshStandardMaterial color="#64748b" wireframe />
      </mesh>
      {/* Rear Right */}
      <mesh position={[-1, 0.1, -0.75]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.35, 16]} />
        <meshStandardMaterial color="#64748b" wireframe />
      </mesh>

      {/* Glowing headlight accents */}
      <mesh position={[1.6, 0.4, 0.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>
      {/* Glowing headlight accents */}
      <mesh position={[1.6, 0.4, -0.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>
    </group>
  );
}

export default function ThreeCarShowcase() {
  // Guard WebGL/Canvas context in testing environments (Vitest + JSDOM) to avoid canvas exceptions
  const isTest = typeof window !== "undefined" && (
    window.vitest || 
    window.__vitest_environment__ || 
    (window.process && window.process.env?.NODE_ENV === "test")
  );

  if (isTest) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center bg-slate-900 text-slate-400 md:h-[420px]" data-testid="three-showcase">
        [Interactive 3D Configurator Blueprint Loaded]
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full cursor-grab active:cursor-grabbing md:h-[420px]" data-testid="three-showcase">
      <Suspense fallback={<div className="flex h-full w-full items-center justify-center text-slate-400">Loading interactive 3D grid...</div>}>
        <Canvas camera={{ position: [3.5, 1.8, 4.5], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 10, 5]} intensity={2.5} />
          <pointLight position={[-5, 5, -5]} intensity={1.5} color="#06b6d4" />
          <HologramCar />
          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={0.5} 
            maxPolarAngle={Math.PI / 2 - 0.05} 
            minPolarAngle={Math.PI / 6} 
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
