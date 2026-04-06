'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera, useGLTF, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// A simple procedural pipe geometry generator
const PipePart = React.forwardRef<THREE.Group, { position: [number, number, number], rotation?: [number, number, number], type: 'straight' | 'elbow', material: THREE.Material }>(
  ({ position, rotation = [0, 0, 0], type, material }, ref) => {
    const geometry = useMemo(() => {
      if (type === 'straight') {
        return new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
      } else {
        // Elbow
        const path = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(1, 0, 0)
        );
        return new THREE.TubeGeometry(path, 20, 0.5, 16, false);
      }
    }, [type]);

    return (
      <group ref={ref} position={position} rotation={rotation}>
        <mesh geometry={geometry} material={material} castShadow receiveShadow />
        {/* Flanges */}
        {type === 'straight' && (
          <>
            <mesh position={[0, 1, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.6, 0.6, 0.2, 32]} />
              <primitive object={material} />
            </mesh>
            <mesh position={[0, -1, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.6, 0.6, 0.2, 32]} />
              <primitive object={material} />
            </mesh>
          </>
        )}
        {type === 'elbow' && (
          <>
            <mesh position={[0, 1, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.6, 0.6, 0.2, 32]} />
              <primitive object={material} />
            </mesh>
            <mesh position={[1, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
              <cylinderGeometry args={[0.6, 0.6, 0.2, 32]} />
              <primitive object={material} />
            </mesh>
          </>
        )}
      </group>
    );
  }
);
PipePart.displayName = 'PipePart';

const WaterParticles = ({ active }: { active: boolean }) => {
  const count = 2000;
  const positions = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // eslint-disable-next-line react-hooks/purity
      pos[i * 3] = (Math.random() - 0.5) * 0.8;
      // eslint-disable-next-line react-hooks/purity
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      // eslint-disable-next-line react-hooks/purity
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  useFrame((state, delta) => {
    if (!active) return;
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        // Move particles along the U-shape
        // Simplified: just moving them down, across, and up
        let y = positions[i * 3 + 1];
        let x = positions[i * 3];
        
        // Rough simulation of flow
        if (x < -0.5 && y > -1.5) {
          y -= delta * 5; // Flow down left pipe
        } else if (y <= -1.5 && x < 1.5) {
          x += delta * 5; // Flow across bottom
          y = -1.5 + (Math.random() - 0.5) * 0.2;
        } else if (x >= 1.5 && y < 2) {
          y += delta * 5; // Flow up right pipe
        } else {
          // Reset
          x = -1.5 + (Math.random() - 0.5) * 0.4;
          y = 2;
        }

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 0.6, delta * 2);
    }
  });

  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.05}
        color="#4db8ff"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const Scene = () => {
  const leftPipeRef = useRef<THREE.Group>(null);
  const rightPipeRef = useRef<THREE.Group>(null);
  const bottomPipeRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const copperMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#b87333',
    roughness: 0.6,
    metalness: 0.8,
  }), []);

  const chromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#cccccc',
    roughness: 0.3,
    metalness: 0.9,
  }), []);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsConnected(true);
        // Camera shake
        if (cameraRef.current) {
          gsap.to(cameraRef.current.position, {
            x: "+=0.1",
            y: "+=0.1",
            yoyo: true,
            repeat: 5,
            duration: 0.05,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.to(cameraRef.current.position, {
                x: 0,
                y: 0,
                z: 8,
                duration: 0.2
              });
            }
          });
        }
      }
    });

    // Initial state setup
    if (leftPipeRef.current) leftPipeRef.current.position.set(-4, 2, 0);
    if (rightPipeRef.current) rightPipeRef.current.position.set(4, 2, 0);
    if (bottomPipeRef.current) bottomPipeRef.current.position.set(0, -4, 0);

    // Animation
    tl.to([leftPipeRef.current?.position, rightPipeRef.current?.position, bottomPipeRef.current?.position], {
      x: (i) => i === 0 ? -1.5 : i === 1 ? 1.5 : 0,
      y: (i) => i === 0 ? 0 : i === 1 ? 0 : -1.5,
      duration: 1.5,
      ease: "power4.out",
      stagger: 0.1
    }, "+=0.5");

  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 8]} fov={45} />
      
      <Environment preset="city" environmentIntensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
      <spotLight position={[-5, 5, 5]} intensity={1.5} angle={0.3} penumbra={1} castShadow />
      <ambientLight intensity={0.1} />

      <group rotation={[0.2, -0.2, 0]}>
        {/* Left Pipe (Vertical) */}
        <group ref={leftPipeRef}>
          <PipePart type="straight" material={copperMaterial} position={[0, 0, 0]} />
        </group>

        {/* Right Pipe (Vertical) */}
        <group ref={rightPipeRef}>
          <PipePart type="straight" material={copperMaterial} position={[0, 0, 0]} />
        </group>

        {/* Bottom Pipe (Horizontal with elbows) */}
        <group ref={bottomPipeRef}>
          <PipePart type="elbow" material={chromeMaterial} position={[-1.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]} />
          <PipePart type="straight" material={copperMaterial} position={[0, -1, 0]} rotation={[0, 0, Math.PI / 2]} />
          <PipePart type="elbow" material={chromeMaterial} position={[1.5, -1, 0]} rotation={[0, 0, Math.PI]} />
        </group>

        <WaterParticles active={isConnected} />
      </group>
    </>
  );
};

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas shadows dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  );
}
