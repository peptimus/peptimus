import { useMemo, useRef, Component, ReactNode, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

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

interface MoleculeViewerProps {
  sequence: string;
  size?: "small" | "large";
}

function getAtomColor(aa: string): string {
  if ("RNDQE".includes(aa)) return "#00ff9f";
  if ("STKHYW".includes(aa)) return "#8b5cf6";
  return "#00f5ff";
}

interface AtomData {
  position: [number, number, number];
  color: string;
}

interface BondData {
  start: [number, number, number];
  end: [number, number, number];
}

function buildMoleculeGeometry(sequence: string, size: "small" | "large"): { atoms: AtomData[]; bonds: BondData[] } {
  const count = Math.min(sequence.length, size === "large" ? 10 : 6);
  const radius = size === "large" ? 1.2 : 0.8;
  const atoms: AtomData[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const twist = (i / count) * Math.PI * 0.8;
    atoms.push({
      position: [
        Math.cos(angle) * radius,
        Math.sin(twist) * 0.4,
        Math.sin(angle) * radius,
      ],
      color: getAtomColor(sequence[i] ?? "A"),
    });
  }
  const bonds: BondData[] = [];
  for (let i = 0; i < atoms.length; i++) {
    bonds.push({ start: atoms[i].position, end: atoms[(i + 1) % atoms.length].position });
  }
  return { atoms, bonds };
}

function Atom({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.5;
  });
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.12, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.2} metalness={0.5} />
    </mesh>
  );
}

function Bond({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const mid: [number, number, number] = [(start[0]+end[0])/2, (start[1]+end[1])/2, (start[2]+end[2])/2];
  const dir = new THREE.Vector3(end[0]-start[0], end[1]-start[1], end[2]-start[2]);
  const length = dir.length();
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
  return (
    <mesh position={mid} quaternion={quaternion}>
      <cylinderGeometry args={[0.025, 0.025, length, 6]} />
      <meshStandardMaterial color="#ffffff" opacity={0.15} transparent roughness={0.8} />
    </mesh>
  );
}

function MoleculeGroup({ sequence, size }: { sequence: string; size: "small" | "large" }) {
  const groupRef = useRef<THREE.Group>(null);
  const { atoms, bonds } = useMemo(() => buildMoleculeGeometry(sequence, size), [sequence, size]);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.rotation.x += delta * 0.08;
    }
  });
  return (
    <group ref={groupRef}>
      {bonds.map((b, i) => <Bond key={i} start={b.start} end={b.end} />)}
      {atoms.map((a, i) => <Atom key={i} position={a.position} color={a.color} />)}
    </group>
  );
}

class ThreeFallback extends Component<{ fallback: ReactNode; children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() { return this.state.error ? this.props.fallback : this.props.children; }
}

function SVGFallback({ sequence, size }: MoleculeViewerProps) {
  const height = size === "large" ? "h-52" : "h-28";
  const containerSize = size === "large" ? 180 : 100;
  const atomR = size === "large" ? 5 : 3.5;
  const cx = containerSize / 2;
  const cy = containerSize / 2;
  const radius = containerSize * 0.35;
  const count = Math.min(sequence.length, size === "large" ? 10 : 6);
  const pts = Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius, color: getAtomColor(sequence[i] ?? "A") };
  });
  return (
    <div className={`w-full ${height} rounded-xl border border-white/8 bg-black/30 flex items-center justify-center overflow-hidden`}>
      <svg width={containerSize} height={containerSize}>
        {pts.map((p, i) => { const n = pts[(i+1)%pts.length]; return <line key={i} x1={p.x} y1={p.y} x2={n.x} y2={n.y} stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />; })}
        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={atomR} fill={p.color} style={{ filter: `drop-shadow(0 0 5px ${p.color})` }} />)}
      </svg>
    </div>
  );
}

export function MoleculeViewer({ sequence, size = "large" }: MoleculeViewerProps) {
  const height = size === "large" ? "h-52" : "h-28";
  const cam = size === "large" ? 3.2 : 2.5;
  const webgl = useMemo(() => detectWebGL(), []);

  if (!webgl) {
    return <SVGFallback sequence={sequence} size={size} />;
  }

  const fallback = <SVGFallback sequence={sequence} size={size} />;

  return (
    <ThreeFallback fallback={fallback}>
      <div
        className={`w-full ${height} rounded-xl overflow-hidden border border-white/8 relative`}
        style={{ background: "rgba(0,0,0,0.3)" }}
      >
        <Suspense fallback={<div className={`w-full ${height} animate-pulse rounded-xl bg-white/5`} />}>
          <Canvas
            camera={{ position: [0, 0, cam], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={0.4} />
            <pointLight position={[3, 3, 3]} intensity={1.2} color="#00f5ff" />
            <pointLight position={[-3, -2, -3]} intensity={0.6} color="#8b5cf6" />
            <MoleculeGroup sequence={sequence} size={size} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
          </Canvas>
        </Suspense>
        {size === "large" && (
          <div className="absolute inset-0 pointer-events-none rounded-xl border border-cyan-400/8"
            style={{ background: "radial-gradient(ellipse at center,rgba(0,245,255,0.04) 0%,transparent 70%)" }} />
        )}
      </div>
    </ThreeFallback>
  );
}
