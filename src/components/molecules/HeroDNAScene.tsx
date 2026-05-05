import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Suspense } from "react";
import { motion } from "framer-motion";

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const ctx =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      (canvas.getContext as (id: string) => RenderingContext | null)("experimental-webgl");
    return !!ctx;
  } catch {
    return false;
  }
}

function buildHelixPoints(turns: number, ptsPerTurn: number, radius: number, height: number, phase: number) {
  const total = turns * ptsPerTurn;
  return Array.from({ length: total }, (_, i) => {
    const t = (i / (total - 1)) * turns * Math.PI * 2;
    return new THREE.Vector3(
      Math.cos(t + phase) * radius,
      (i / (total - 1)) * height - height / 2,
      Math.sin(t + phase) * radius
    );
  });
}

function DNAStrand({ phase, color }: { phase: number; color: string }) {
  const geo = useMemo(() => {
    const pts = buildHelixPoints(4, 32, 1.4, 9, phase);
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 200, 0.055, 6, false);
  }, [phase]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55}
        roughness={0.25} metalness={0.4} transparent opacity={0.92} />
    </mesh>
  );
}

function BasePairsAndAtoms() {
  const pairs = useMemo(() => {
    const colors = ["#00f5ff", "#00ff9f", "#8b5cf6", "#60a5fa"];
    const steps = 18;
    return Array.from({ length: steps }, (_, i) => {
      const t = (i / (steps - 1)) * 4 * Math.PI * 2;
      const y = (i / (steps - 1)) * 9 - 4.5;
      const c = colors[i % colors.length];
      const a = new THREE.Vector3(Math.cos(t) * 1.4, y, Math.sin(t) * 1.4);
      const b = new THREE.Vector3(Math.cos(t + Math.PI) * 1.4, y, Math.sin(t + Math.PI) * 1.4);
      const mid = a.clone().lerp(b, 0.5);
      const dir = b.clone().sub(a);
      const len = dir.length();
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      return { a, b, mid, len, quat, c, i };
    });
  }, []);
  return (
    <>
      {pairs.map(({ mid, len, quat, c, a, b }, idx) => (
        <group key={idx}>
          <mesh position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.04, 0.04, len, 6]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.7} transparent opacity={0.7} />
          </mesh>
          <mesh position={a}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.8} roughness={0.1} metalness={0.6} />
          </mesh>
          <mesh position={b}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.8} roughness={0.1} metalness={0.6} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function HelixGroup() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.22;
  });
  return (
    <group ref={ref}>
      <DNAStrand phase={0} color="#00f5ff" />
      <DNAStrand phase={Math.PI} color="#8b5cf6" />
      <BasePairsAndAtoms />
    </group>
  );
}

function StaticBackground() {
  return (
    <div className="absolute inset-0">
      <img src="/bg-hero.png" alt="" className="w-full h-full object-cover object-center" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(0,245,255,0.06) 0%, transparent 70%)" }} />
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{
            width: 200 + i * 80, height: 200 + i * 80,
            border: `1px solid rgba(${i % 2 ? "0,245,255" : "139,92,246"},${0.04 + i * 0.015})`,
            left: "50%", top: "42%",
            transform: "translate(-50%,-50%)",
            boxShadow: `0 0 ${20 + i * 15}px rgba(${i % 2 ? "0,245,255" : "139,92,246"},0.03)`,
          }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4 + i * 1.2, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function HeroDNAScene() {
  const webgl = useMemo(() => detectWebGL(), []);

  if (!webgl) {
    return <StaticBackground />;
  }

  return (
    <Suspense fallback={<StaticBackground />}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ position: "absolute", inset: 0, background: "transparent" }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[4, 4, 4]} intensity={1.8} color="#00f5ff" />
        <pointLight position={[-4, -4, 4]} intensity={1.2} color="#8b5cf6" />
        <pointLight position={[0, 6, -3]} intensity={0.8} color="#00ff9f" />
        <HelixGroup />
      </Canvas>
    </Suspense>
  );
}
