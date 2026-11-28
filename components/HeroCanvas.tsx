"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import gsap from "gsap";

/* -------------------------------------------------------------------------- */
/*  Deterministic randomness, so the weathering looks the same on every load  */
/* -------------------------------------------------------------------------- */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* -------------------------------------------------------------------------- */
/*  Procedural weathered-metal textures (no image downloads needed)           */
/* -------------------------------------------------------------------------- */

type SurfaceOptions = {
  base: string; // main surface color
  rust: number; // 0 → clean, 1 → heavily rusted
  paint?: boolean; // painted surface with chips showing bare metal
  seed: number;
};

function makeSurface({ base, rust, paint = false, seed }: SurfaceOptions) {
  const size = 512;
  const rand = mulberry32(seed);
  const color = document.createElement("canvas");
  const rough = document.createElement("canvas");
  color.width = color.height = rough.width = rough.height = size;
  const c = color.getContext("2d")!;
  const r = rough.getContext("2d")!;

  c.fillStyle = base;
  c.fillRect(0, 0, size, size);
  r.fillStyle = paint ? "rgb(150,150,150)" : "rgb(105,105,105)";
  r.fillRect(0, 0, size, size);

  // Draw a shape at (x, y) and its wrapped copies so the texture tiles seamlessly.
  const wrapped = (
    x: number,
    y: number,
    radius: number,
    draw: (x: number, y: number) => void,
  ) => {
    for (const dx of [-size, 0, size]) {
      for (const dy of [-size, 0, size]) {
        const px = x + dx;
        const py = y + dy;
        if (
          px + radius < 0 ||
          px - radius > size ||
          py + radius < 0 ||
          py - radius > size
        )
          continue;
        draw(px, py);
      }
    }
  };

  // Fine grain
  for (let i = 0; i < 6000; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const v = rand() > 0.5 ? 255 : 0;
    c.fillStyle = `rgba(${v},${v},${v},${0.03 + rand() * 0.04})`;
    c.fillRect(x, y, 1 + rand() * 2, 1 + rand() * 2);
  }

  // Blotches: rust on bare metal, chips on painted metal
  // Paint wears in small, irregular clusters; rust spreads in big soft patches.
  const blotches = paint
    ? Math.round(6 + rust * 22)
    : Math.round(10 + rust * 70);
  for (let i = 0; i < blotches; i++) {
    const cluster = paint ? 3 + Math.floor(rand() * 4) : 1;
    const cx = rand() * size;
    const cy = rand() * size;
    for (let j = 0; j < cluster; j++) {
      const x = cx + (paint ? (rand() - 0.5) * 18 : 0);
      const y = cy + (paint ? (rand() - 0.5) * 10 : 0);
      const radius = paint ? 2 + rand() * 7 : 8 + rand() * 70;
      const strength = 0.35 + rand() * 0.5;
      wrapped(x, y, radius, (px, py) => {
        const g = c.createRadialGradient(px, py, 0, px, py, radius);
        if (paint) {
          g.addColorStop(0, `rgba(48,44,40,${strength + 0.3})`);
          g.addColorStop(0.55, `rgba(92,52,28,${strength})`);
          g.addColorStop(1, "rgba(92,52,28,0)");
        } else {
          g.addColorStop(0, `rgba(78,38,18,${strength})`);
          g.addColorStop(0.5, `rgba(122,62,28,${strength * 0.8})`);
          g.addColorStop(1, "rgba(122,62,28,0)");
        }
        c.fillStyle = g;
        c.beginPath();
        c.arc(px, py, radius, 0, Math.PI * 2);
        c.fill();

        const rg = r.createRadialGradient(px, py, 0, px, py, radius);
        rg.addColorStop(0, `rgba(235,235,235,${strength})`);
        rg.addColorStop(1, "rgba(235,235,235,0)");
        r.fillStyle = rg;
        r.beginPath();
        r.arc(px, py, radius, 0, Math.PI * 2);
        r.fill();
      });
    }
  }

  // Rust streaks running along the pipe
  const streaks = Math.round(rust * 40);
  for (let i = 0; i < streaks; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const len = 30 + rand() * 140;
    const w = 1 + rand() * 3;
    const g = c.createLinearGradient(x, y, x, y + len);
    g.addColorStop(0, `rgba(120,58,24,${0.25 + rand() * 0.3})`);
    g.addColorStop(1, "rgba(120,58,24,0)");
    c.fillStyle = g;
    c.fillRect(x, y, w, len);
  }

  // Bright scratches where the metal is polished by wear
  for (let i = 0; i < 60; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const a = rand() * Math.PI;
    const len = 6 + rand() * 30;
    c.strokeStyle = `rgba(220,215,205,${0.08 + rand() * 0.15})`;
    c.lineWidth = 0.6;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    c.stroke();
    r.strokeStyle = "rgba(40,40,40,0.5)";
    r.lineWidth = 0.8;
    r.beginPath();
    r.moveTo(x, y);
    r.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    r.stroke();
  }

  const map = new THREE.CanvasTexture(color);
  map.colorSpace = THREE.SRGBColorSpace;
  const roughnessMap = new THREE.CanvasTexture(rough);
  for (const t of [map, roughnessMap]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
  }
  return { map, roughnessMap };
}

function makeMaterial(
  opts: SurfaceOptions & { metalness: number; emissive?: string },
) {
  const { map, roughnessMap } = makeSurface(opts);
  return new THREE.MeshStandardMaterial({
    map,
    roughnessMap,
    bumpMap: roughnessMap,
    bumpScale: 1.2,
    roughness: 1,
    metalness: opts.metalness,
    emissive: new THREE.Color(opts.emissive ?? "#000000"),
    emissiveIntensity: 0,
  });
}

/* -------------------------------------------------------------------------- */
/*  Geometry: pipe joints with bolted flanges                                 */
/* -------------------------------------------------------------------------- */

const UP = new THREE.Vector3(0, 1, 0);

// A bolted flange joint, built along the Y axis.
function makeJointGeometry(r: number, cap = false) {
  const parts: THREE.BufferGeometry[] = [];
  const flangeR = r * 1.6;
  const disk = (y: number, h: number, radius: number) =>
    new THREE.CylinderGeometry(radius, radius, h, 48).translate(0, y, 0);

  parts.push(new THREE.CylinderGeometry(r * 1.14, r * 1.14, 0.34, 40)); // weld necks
  parts.push(disk(-0.05, 0.08, flangeR));
  parts.push(disk(0.05, 0.08, flangeR));
  parts.push(disk(0, 0.03, flangeR * 0.93)); // gasket line between the two flanges
  if (cap) parts.push(disk(0.15, 0.08, flangeR)); // blind flange closing the end

  const bolts = 8;
  const boltRing = flangeR * 0.82;
  for (let i = 0; i < bolts; i++) {
    const a = (i / bolts) * Math.PI * 2 + Math.PI / bolts;
    const x = Math.cos(a) * boltRing;
    const z = Math.sin(a) * boltRing;
    parts.push(
      new THREE.CylinderGeometry(0.028, 0.028, cap ? 0.36 : 0.26, 8).translate(
        x,
        cap ? 0.05 : 0,
        z,
      ),
    );
    parts.push(
      new THREE.CylinderGeometry(0.062, 0.062, 0.05, 6).translate(
        x,
        cap ? 0.21 : 0.115,
        z,
      ),
    );
    parts.push(
      new THREE.CylinderGeometry(0.062, 0.062, 0.05, 6).translate(x, -0.115, z),
    );
  }
  const merged = mergeGeometries(parts)!;
  parts.forEach((p) => p.dispose());
  return merged;
}

/* -------------------------------------------------------------------------- */
/*  Pipe network layout                                                       */
/* -------------------------------------------------------------------------- */

type MaterialKey = "steel" | "painted" | "flange" | "paintedFlange";

type Piece =
  | {
      kind: "straight";
      position: THREE.Vector3;
      quaternion: THREE.Quaternion;
      length: number;
      r: number;
      mat: MaterialKey;
    }
  | {
      kind: "elbow";
      position: THREE.Vector3;
      geometry: THREE.BufferGeometry;
      mat: MaterialKey;
    }
  | {
      kind: "joint";
      position: THREE.Vector3;
      quaternion: THREE.Quaternion;
      r: number;
      cap: boolean;
      mat: MaterialKey;
    }
  | { kind: "valve"; position: THREE.Vector3; r: number };

type RunOptions = {
  r: number;
  mat: MaterialKey;
  flangeMat: MaterialKey;
  capStart?: boolean;
  capEnd?: boolean;
  maxSegment?: number;
};

// Turns a list of corner points into straight sections, elbows and flanged joints
// that are guaranteed to line up.
function buildRun(
  points: THREE.Vector3[],
  { r, mat, flangeMat, capStart, capEnd, maxSegment = 2.6 }: RunOptions,
) {
  const pieces: Piece[] = [];
  const bend = r * 2.4;
  const n = points.length;

  const joint = (p: THREE.Vector3, dir: THREE.Vector3, cap = false) =>
    pieces.push({
      kind: "joint",
      position: p.clone(),
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        UP,
        dir.clone().normalize(),
      ),
      r,
      cap,
      mat: flangeMat,
    });

  for (let i = 0; i < n - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const dir = b.clone().sub(a).normalize();
    const start = i === 0 ? a.clone() : a.clone().addScaledVector(dir, bend);
    const end = i === n - 2 ? b.clone() : b.clone().addScaledVector(dir, -bend);

    if (i === 0 && capStart) joint(start, dir.clone().negate(), true);

    const total = start.distanceTo(end);
    const count = Math.max(1, Math.ceil(total / maxSegment));
    const step = total / count;
    for (let k = 0; k < count; k++) {
      const s = start.clone().addScaledVector(dir, step * k);
      const e = start.clone().addScaledVector(dir, step * (k + 1));
      pieces.push({
        kind: "straight",
        position: s.clone().add(e).multiplyScalar(0.5),
        quaternion: new THREE.Quaternion().setFromUnitVectors(UP, dir),
        length: step,
        r,
        mat,
      });
      if (k < count - 1) joint(e, dir);
    }

    if (i === n - 2 && capEnd) joint(end, dir, true);

    // Elbow at the next corner
    if (i < n - 2) {
      const c = points[i + 1];
      const nextDir = points[i + 2].clone().sub(c).normalize();
      const p0 = c.clone().addScaledVector(dir, -bend).sub(c);
      const p2 = c.clone().addScaledVector(nextDir, bend).sub(c);
      const curve = new THREE.QuadraticBezierCurve3(
        p0,
        new THREE.Vector3(0, 0, 0),
        p2,
      );
      pieces.push({
        kind: "elbow",
        position: c.clone(),
        geometry: new THREE.TubeGeometry(curve, 28, r, 40, false),
        mat,
      });
      joint(c.clone().add(p0), dir);
      joint(c.clone().add(p2), nextDir);
    }
  }
  return pieces;
}

function buildNetwork(): Piece[] {
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

  // Main steel line: an inverted U that the system "flows" through
  const main = buildRun(
    [v(-1.9, -7, 0), v(-1.9, 1.35, 0), v(1.7, 1.35, 0), v(1.7, -7, 0)],
    {
      r: 0.3,
      mat: "steel",
      flangeMat: "flange",
    },
  );

  // Painted yellow utility line running behind it
  const painted = buildRun(
    [v(-3.4, 2.55, -1.4), v(2.9, 2.55, -1.4), v(2.9, -7, -1.4)],
    {
      r: 0.2,
      mat: "painted",
      flangeMat: "paintedFlange",
      capStart: true,
    },
  );

  // Steel line entering from the right and turning back into the depth of the scene
  const cross = buildRun(
    [v(9, -1.9, 1.1), v(0.1, -1.9, 1.1), v(0.1, -1.9, -4.5)],
    {
      r: 0.25,
      mat: "steel",
      flangeMat: "flange",
    },
  );

  const valve: Piece = { kind: "valve", position: v(-1.9, -0.55, 0), r: 0.3 };

  return [...main, valve, ...painted, ...cross];
}

/* -------------------------------------------------------------------------- */
/*  Valve with brand-gold handwheel                                           */
/* -------------------------------------------------------------------------- */

const Valve = ({
  r,
  bodyMat,
  wheelMat,
  wheelRef,
}: {
  r: number;
  bodyMat: THREE.Material;
  wheelMat: THREE.Material;
  wheelRef: React.RefObject<THREE.Group | null>;
}) => {
  const spokes = 5;
  return (
    <group>
      {/* Valve body */}
      <mesh material={bodyMat} scale={[1, 1.25, 1]} castShadow receiveShadow>
        <sphereGeometry args={[r * 1.55, 40, 24]} />
      </mesh>
      {/* Bonnet */}
      <mesh
        material={bodyMat}
        position={[0, 0, r * 1.7]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[r * 0.75, r * 0.9, r * 1.6, 32]} />
      </mesh>
      <mesh
        material={bodyMat}
        position={[0, 0, r * 2.5]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[r * 1.1, r * 1.1, 0.07, 32]} />
      </mesh>
      {/* Stem */}
      <mesh
        material={bodyMat}
        position={[0, 0, r * 2.5 + 0.22]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.04, 0.04, 0.44, 12]} />
      </mesh>
      {/* Handwheel */}
      <group ref={wheelRef} position={[0, 0, r * 2.5 + 0.42]}>
        <mesh material={wheelMat} castShadow>
          <torusGeometry args={[0.46, 0.045, 14, 64]} />
        </mesh>
        <mesh material={wheelMat} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 20]} />
        </mesh>
        {Array.from({ length: spokes }).map((_, i) => {
          const a = (i / spokes) * Math.PI * 2;
          return (
            <mesh
              key={i}
              material={wheelMat}
              position={[Math.cos(a) * 0.23, Math.sin(a) * 0.23, 0]}
              rotation={[0, 0, a - Math.PI / 2]}
              castShadow
            >
              <cylinderGeometry args={[0.024, 0.024, 0.46, 10]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

/* -------------------------------------------------------------------------- */
/*  Floating dust in the light                                                */
/* -------------------------------------------------------------------------- */

const Dust = () => {
  const count = 260;
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const rand = mulberry32(7);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * 12;
      arr[i * 3 + 1] = (rand() - 0.5) * 8;
      arr[i * 3 + 2] = (rand() - 0.5) * 6;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += delta * 0.08;
      if (arr[i * 3 + 1] > 4) arr[i * 3 + 1] = -4;
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#ffe2a8"
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/* -------------------------------------------------------------------------- */
/*  Scene                                                                     */
/* -------------------------------------------------------------------------- */

const Scene = () => {
  const { size, viewport } = useThree();
  const rigRef = useRef<THREE.Group>(null);
  const wheelRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const pieceRefs = useRef<(THREE.Group | null)[]>([]);
  const mouse = useRef({ x: 0, y: 0 });

  const pieces = useMemo(() => buildNetwork(), []);

  const materials = useMemo(
    () => ({
      steel: makeMaterial({
        base: "#575c61",
        rust: 0.55,
        metalness: 0.85,
        seed: 11,
      }),
      flange: makeMaterial({
        base: "#4a4440",
        rust: 0.95,
        metalness: 0.8,
        seed: 23,
        emissive: "#ffb300",
      }),
      painted: makeMaterial({
        base: "#c79a1e",
        rust: 0.35,
        paint: true,
        metalness: 0.35,
        seed: 31,
      }),
      paintedFlange: makeMaterial({
        base: "#b38a1a",
        rust: 0.6,
        paint: true,
        metalness: 0.4,
        seed: 37,
        emissive: "#ffb300",
      }),
      valveBody: makeMaterial({
        base: "#33363a",
        rust: 0.8,
        metalness: 0.8,
        seed: 41,
      }),
      wheel: makeMaterial({
        base: "#ffd700",
        rust: 0.25,
        paint: true,
        metalness: 0.3,
        seed: 53,
        emissive: "#ffb300",
      }),
    }),
    [],
  );

  const jointGeometries = useMemo(() => {
    const cache = new Map<string, THREE.BufferGeometry>();
    return (r: number, cap: boolean) => {
      const key = `${r}-${cap}`;
      if (!cache.has(key)) cache.set(key, makeJointGeometry(r, cap));
      return cache.get(key)!;
    };
  }, []);

  // Track the mouse for a subtle parallax (the canvas itself ignores pointer events).
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Assembly animation: scattered parts fly in and lock into one working system.
  useEffect(() => {
    const groups = pieceRefs.current.filter(Boolean) as THREE.Group[];
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const rand = mulberry32(99);
    groups.forEach((g, i) => {
      const final = pieces[i].position;
      const away = final.clone().setZ(0);
      if (away.length() < 0.5) away.set(0, 1, 0);
      away.normalize().multiplyScalar(2.5 + rand() * 2);
      g.position
        .copy(final)
        .add(away)
        .add(new THREE.Vector3(0, 0, 2 + rand() * 2));
      g.rotation.set(
        (rand() - 0.5) * 1.2,
        (rand() - 0.5) * 1.2,
        (rand() - 0.5) * 1.2,
      );
      g.scale.setScalar(0.001);
    });

    const flashMats = [
      materials.flange,
      materials.paintedFlange,
      materials.wheel,
    ];
    const tl = gsap.timeline({ delay: 0.35 });

    groups.forEach((g, i) => {
      const final = pieces[i].position;
      const at = i * 0.035;
      tl.to(
        g.position,
        {
          x: final.x,
          y: final.y,
          z: final.z,
          duration: 1.1,
          ease: "power4.out",
        },
        at,
      );
      tl.to(
        g.rotation,
        { x: 0, y: 0, z: 0, duration: 1.1, ease: "power3.out" },
        at,
      );
      tl.to(
        g.scale,
        { x: 1, y: 1, z: 1, duration: 0.5, ease: "power2.out" },
        at,
      );
    });

    // Lock-in: joints flash gold, the valve wheel opens, and the camera takes the hit.
    tl.addLabel("locked");
    tl.to(
      flashMats,
      { emissiveIntensity: 1.6, duration: 0.12, ease: "power2.out" },
      "locked",
    );
    tl.to(
      flashMats,
      { emissiveIntensity: 0, duration: 1.2, ease: "power2.in" },
      "locked+=0.12",
    );
    if (cameraRef.current) {
      tl.to(
        cameraRef.current.position,
        { x: "+=0.06", y: "+=0.06", yoyo: true, repeat: 5, duration: 0.05 },
        "locked",
      );
    }
    if (wheelRef.current) {
      tl.to(
        wheelRef.current.rotation,
        { z: -Math.PI * 3, duration: 1.8, ease: "power3.inOut" },
        "locked+=0.1",
      );
    }

    return () => {
      tl.kill();
    };
  }, [pieces, materials]);

  // Idle: slow breathing sway plus mouse parallax
  useFrame((state, delta) => {
    const rig = rigRef.current;
    if (!rig) return;
    const t = state.clock.elapsedTime;
    const targetY = -0.42 + mouse.current.x * 0.08 + Math.sin(t * 0.25) * 0.025;
    const targetX = 0.1 + mouse.current.y * 0.04;
    rig.rotation.y = THREE.MathUtils.damp(rig.rotation.y, targetY, 2, delta);
    rig.rotation.x = THREE.MathUtils.damp(rig.rotation.x, targetX, 2, delta);
  });

  // Keep the system on the right on wide screens, centered and smaller behind the text on phones.
  const narrow = size.width < 768;
  const scale = narrow ? 0.5 : Math.min(0.95, viewport.width / 12.5);
  const offsetX = narrow ? viewport.width * 0.5 : viewport.width * 0.3;
  const offsetY = narrow ? viewport.height * 0.27 : -0.25;

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0, 10]}
        fov={40}
      />
      <fog attach="fog" args={["#000000", 9, 19]} />

      {/* Built-in studio reflections, no downloaded image needed */}
      <Environment resolution={256} environmentIntensity={0.55}>
        <Lightformer
          form="rect"
          intensity={3}
          color="#ffd9a3"
          position={[-4, 5, 3]}
          scale={[6, 2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          color="#8fb6ff"
          position={[6, 1, -4]}
          scale={[3, 6, 1]}
        />
        <Lightformer
          form="ring"
          intensity={1}
          color="#ffffff"
          position={[0, 0, 8]}
          scale={4}
        />
      </Environment>

      <ambientLight intensity={0.06} />
      <spotLight
        position={[-5, 8, 6]}
        angle={0.55}
        penumbra={0.85}
        intensity={5}
        decay={0}
        color="#ffdcae"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[6, 2, -6]} intensity={1.6} color="#7aa8ff" />
      <pointLight
        position={[1, -3, 3]}
        intensity={0.8}
        decay={0}
        color="#ff9a3c"
      />

      <group position={[offsetX, offsetY, 0]} scale={scale}>
        <group ref={rigRef} rotation={[0.1, -0.42, 0]}>
          {pieces.map((p, i) => (
            <group
              key={i}
              ref={(el) => {
                pieceRefs.current[i] = el;
              }}
              position={p.position}
            >
              {p.kind === "straight" && (
                <mesh
                  quaternion={p.quaternion}
                  material={materials[p.mat]}
                  castShadow
                  receiveShadow
                >
                  <cylinderGeometry args={[p.r, p.r, p.length, 40, 1, true]} />
                </mesh>
              )}
              {p.kind === "elbow" && (
                <mesh
                  geometry={p.geometry}
                  material={materials[p.mat]}
                  castShadow
                  receiveShadow
                />
              )}
              {p.kind === "joint" && (
                <mesh
                  quaternion={p.quaternion}
                  geometry={jointGeometries(p.r, p.cap)}
                  material={materials[p.mat]}
                  castShadow
                  receiveShadow
                />
              )}
              {p.kind === "valve" && (
                <Valve
                  r={p.r}
                  bodyMat={materials.valveBody}
                  wheelMat={materials.wheel}
                  wheelRef={wheelRef}
                />
              )}
            </group>
          ))}
        </group>
      </group>

      <Dust />
    </>
  );
};

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <Scene />
      </Canvas>
      {/* Keeps the headline readable over the pipework */}
      <div className="absolute inset-0 bg-black/45 md:hidden" />
      <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black via-black/40 to-black/0" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
