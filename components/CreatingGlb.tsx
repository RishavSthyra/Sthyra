"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  useGLTF,
  Html,
  ContactShadows,
  PointerLockControls,
} from "@react-three/drei";
import * as THREE from "three";

type GLBModelProps = {
  url: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
};

function GLBModel({
  url,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: GLBModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

  return (
    <group
      ref={groupRef}
      scale={scale}
      position={position}
      rotation={rotation}
    >
      <primitive object={scene} />
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="rounded-full bg-black/70 px-5 py-3 text-sm text-white backdrop-blur-md">
        Click to Enter
      </div>
    </Html>
  );
}

function Movement() {
  const { camera } = useThree();

  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    shift: false, // down
    sprint: false, // fast
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "KeyW") keys.current.w = true;
      if (e.code === "KeyA") keys.current.a = true;
      if (e.code === "KeyS") keys.current.s = true;
      if (e.code === "KeyD") keys.current.d = true;
      if (e.code === "Space") keys.current.space = true;
      if (e.code === "KeyC") keys.current.shift = true;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") keys.current.sprint = true;
    };

    const up = (e: KeyboardEvent) => {
      if (e.code === "KeyW") keys.current.w = false;
      if (e.code === "KeyA") keys.current.a = false;
      if (e.code === "KeyS") keys.current.s = false;
      if (e.code === "KeyD") keys.current.d = false;
      if (e.code === "Space") keys.current.space = false;
      if (e.code === "KeyC") keys.current.shift = false;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") keys.current.sprint = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, delta) => {
   
    const baseSpeed = 22;
    const sprintMultiplier = keys.current.sprint ? 7 : 1; // CTRL = turbo
    const speed = baseSpeed * sprintMultiplier;

    // Camera directions
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward).normalize();

    const right = new THREE.Vector3()
      .crossVectors(forward, camera.up)
      .normalize();

    direction.current.set(0, 0, 0);

    if (keys.current.w) direction.current.add(forward);
    if (keys.current.s) direction.current.sub(forward);
    if (keys.current.d) direction.current.add(right);
    if (keys.current.a) direction.current.sub(right);

    if (keys.current.space) direction.current.y += 1;
    if (keys.current.shift) direction.current.y -= 1;

    if (direction.current.lengthSq() > 0) {
      direction.current.normalize();

      // Smooth acceleration (feels premium)
      velocity.current.lerp(direction.current.multiplyScalar(speed), 0.15);

      camera.position.addScaledVector(velocity.current, delta);
    } else {
      // slow down smoothly
      velocity.current.lerp(new THREE.Vector3(0, 0, 0), 0.1);
    }
  });

  return null;
}

export default function GLBScene() {
  return (
    <div className="h-screen w-full bg-[#f5f1e8]">
      <Canvas
        camera={{
          position: [0, 1.6, 5], // human eye height
          fov: 75,
        }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={2} />

          <GLBModel url="/models/chicago_cityscape_wireframe_and_block_map.glb" />

          <ContactShadows position={[0, -0.01, 0]} opacity={0.3} />

          <Environment preset="city" />

          {/* FREE ROAM CONTROLS */}
          <PointerLockControls />

          {/* MOVEMENT SYSTEM */}
          <Movement />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/chicago_cityscape_wireframe_and_block_map.glb");