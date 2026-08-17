import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

function AnimatedSphere({ color = '#06b6d4' }) {
  const sphereRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    sphereRef.current.rotation.x = t * 0.3;
    sphereRef.current.rotation.y = t * 0.4;
  });

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={sphereRef}>
        <icosahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color={color}
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

export default function StatCard3D({ title, value, change, color = '#06b6d4', icon: Icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, rotateX: 5, rotateY: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden border border-cyan-500/30 shadow-neon group"
    >
      <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-20 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 3] }}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} />
          <AnimatedSphere color={color} />
        </Canvas>
      </div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-neon">
          {Icon && <Icon size={24} />}
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {change}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
        <div className="text-3xl font-extrabold text-white tracking-tight glow-text">{value}</div>
      </div>
    </motion.div>
  );
}
