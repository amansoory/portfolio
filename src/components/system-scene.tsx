"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Line, RoundedBox } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  Color,
  DirectionalLight,
  Group,
  InstancedMesh,
  MathUtils,
  Mesh,
  Object3D,
  Vector3,
} from "three";
import type { MotionValue } from "motion/react";

type SceneProps = {
  progress: MotionValue<number>;
  running: boolean;
  onReady: () => void;
  onLost: () => void;
};
const mint = "#b8e9ad";
const positions: [number, number, number][] = [
  [-2.8, 0, -1.5],
  [2.8, 0, -1.5],
  [-2.8, 0, 1.5],
  [2.8, 0, 1.5],
  [0, 0, -2.6],
  [0, 0, 2.6],
];

// Each plate's 36 pins share one geometry/material and one draw call.
function Pins({ size }: { size: number }) {
  const pins = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!pins.current) return;
    const transform = new Object3D();
    let index = 0;
    for (const side of [-1, 1])
      for (let i = 0; i < 9; i++) {
        transform.position.set((side * size) / 2, 0.02, ((i - 4) * size) / 12);
        transform.rotation.y = 0;
        transform.updateMatrix();
        pins.current.setMatrixAt(index++, transform.matrix);
        transform.position.set(((i - 4) * size) / 12, 0.02, (side * size) / 2);
        transform.rotation.y = Math.PI / 2;
        transform.updateMatrix();
        pins.current.setMatrixAt(index++, transform.matrix);
      }
    pins.current.instanceMatrix.needsUpdate = true;
    pins.current.computeBoundingSphere();
  }, [size]);
  return (
    <instancedMesh ref={pins} args={[undefined, undefined, 36]}>
      <boxGeometry args={[0.22, 0.035, 0.055]} />
      <meshStandardMaterial color="#9fba86" metalness={0.65} roughness={0.35} />
    </instancedMesh>
  );
}

function Plate({
  y,
  size,
  bright = false,
}: {
  y: number;
  size: number;
  bright?: boolean;
}) {
  return (
    <group position={[0, y, 0]}>
      <RoundedBox args={[size, 0.17, size]} radius={0.045} smoothness={2}>
        <meshStandardMaterial
          color={bright ? "#263c2b" : "#17291e"}
          roughness={0.4}
          metalness={0.55}
        />
        <Edges color={bright ? "#9dbf91" : "#526b52"} threshold={20} />
      </RoundedBox>
      <Pins size={size} />
    </group>
  );
}

function Packet({
  points,
  offset,
  running,
  progress,
}: {
  points: [number, number, number][];
  offset: number;
  running: boolean;
  progress: MotionValue<number>;
}) {
  const mesh = useRef<Mesh>(null);
  const path = useMemo(
    () => points.map((point) => new Vector3(...point)),
    [points],
  );
  useFrame(() => {
    if (!mesh.current || !running) return;
    const phase = MathUtils.clamp(progress.get() * 1.25 - offset * 0.2, 0, 1);
    const t = phase <= 0.6 ? phase / 0.6 : 1 - (phase - 0.6) / 0.4;
    mesh.current.visible = phase > 0.02 && phase < 0.98;
    const segment = t * (path.length - 1);
    const index = Math.min(path.length - 2, Math.floor(segment));
    mesh.current.position.lerpVectors(
      path[index],
      path[index + 1],
      segment - index,
    );
  });
  return (
    <mesh ref={mesh} position={points[0]}>
      <sphereGeometry args={[0.055, 8, 8]} />
      <meshBasicMaterial color="#dcffc4" />
    </mesh>
  );
}

function Architecture({ progress, running, onReady, onLost }: SceneProps) {
  const root = useRef<Group>(null);
  const top = useRef<Group>(null);
  const middle = useRef<Group>(null);
  const keyLight = useRef<DirectionalLight>(null);
  const fillLight = useRef<DirectionalLight>(null);
  const { gl, invalidate, camera } = useThree();
  useEffect(() => {
    if (!running) return;
    const unsubscribe = progress.on("change", () => invalidate());
    invalidate();
    return unsubscribe;
  }, [progress, running, invalidate]);
  const callbacks = useRef({ onReady, onLost });
  useEffect(() => {
    callbacks.current = { onReady, onLost };
  });
  useEffect(() => {
    callbacks.current.onReady();
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      callbacks.current.onLost();
    };
    const restored = () => callbacks.current.onReady();
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    return () => {
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      callbacks.current.onLost();
    };
  }, [gl]);
  const paths = useMemo(
    () =>
      positions.map(
        ([x, , z]) =>
          [
            [x, -0.45, z],
            [x * 0.65, -0.45, z],
            [x * 0.65, -0.45, z * 0.4],
            [0, -0.45, z * 0.4],
          ] as [number, number, number][],
      ),
    [],
  );
  useFrame(() => {
    if (!running || !root.current || !top.current || !middle.current) return;
    const p = progress.get();
    const assembly = MathUtils.smoothstep(p, 0, 0.8);
    root.current.rotation.y = -0.18 + assembly * 0.32;
    root.current.rotation.x = assembly * 0.025;
    top.current.position.y = 0.55 + assembly * 0.9;
    middle.current.position.y = assembly * 0.32;
    camera.position.set(
      7.2 - assembly * 0.7,
      6.2 + assembly * 0.25,
      8 - assembly * 0.4,
    );
    camera.lookAt(0, assembly * 0.18, 0);
    if (keyLight.current) keyLight.current.intensity = 3 + assembly * 0.5;
    if (fillLight.current) fillLight.current.intensity = 2 - assembly * 0.4;
  });
  return (
    <>
      <ambientLight intensity={1.6} />
      <directionalLight
        ref={keyLight}
        position={[3, 6, 2]}
        intensity={3}
        color="#e2f0c9"
      />
      <directionalLight
        ref={fillLight}
        position={[-4, 2, -3]}
        intensity={2}
        color="#638d72"
      />
      <group ref={root} rotation={[0, -0.18, 0]}>
        <gridHelper
          args={[12, 24, "#233329", "#19251e"]}
          position={[0, -0.85, 0]}
        />
        <Plate y={-0.54} size={2.45} />
        <group ref={middle}>
          <Plate y={0} size={2.28} />
          {[-0.75, 0.75].map((x) => (
            <Line
              key={x}
              points={[
                [x, 0.1, -0.8],
                [x, 0.1, 0.8],
              ]}
              color="#779269"
              lineWidth={1}
            />
          ))}
        </group>
        <group ref={top} position={[0, 0.55, 0]}>
          <Plate y={0} size={2.15} bright />
          <RoundedBox
            position={[0, 0.23, 0]}
            args={[0.94, 0.28, 0.94]}
            radius={0.04}
            smoothness={2}
          >
            <meshStandardMaterial
              color="#b8cc9f"
              metalness={0.7}
              roughness={0.3}
            />
            <Edges color="#e0efc5" />
          </RoundedBox>
          <Line
            points={[
              [-0.17, 0.38, -0.14],
              [-0.29, 0.38, 0],
              [-0.17, 0.38, 0.14],
            ]}
            color="#243923"
            lineWidth={2}
          />
          <Line
            points={[
              [0.17, 0.38, -0.14],
              [0.29, 0.38, 0],
              [0.17, 0.38, 0.14],
            ]}
            color="#243923"
            lineWidth={2}
          />
          <Line
            points={[
              [0.06, 0.38, -0.17],
              [-0.06, 0.38, 0.17],
            ]}
            color="#243923"
            lineWidth={2}
          />
        </group>
        {positions.map(([x, , z], i) => (
          <group key={i} position={[x, -0.4, z]}>
            <RoundedBox args={[0.62, 0.22, 0.62]} radius={0.025} smoothness={2}>
              <meshStandardMaterial
                color="#263d2a"
                metalness={0.4}
                roughness={0.4}
              />
              <Edges color="#809e71" />
            </RoundedBox>
            <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.06, 16]} />
              <meshBasicMaterial color={mint} />
            </mesh>
          </group>
        ))}
        {paths.map((points, i) => (
          <group key={i}>
            <Line
              points={points}
              color="#6e8c60"
              transparent
              opacity={0.65}
              lineWidth={1}
            />
            <Packet
              points={points}
              offset={i / 6}
              running={running}
              progress={progress}
            />
          </group>
        ))}
        {[-0.88, 0.88].flatMap((x) =>
          [-0.88, 0.88].map((z) => (
            <Line
              key={`${x}-${z}`}
              points={[
                [x, -0.4, z],
                [x, 2, z],
              ]}
              color="#536a4d"
              transparent
              opacity={0.25}
              dashed
              dashSize={0.06}
              gapSize={0.08}
              lineWidth={1}
            />
          )),
        )}
      </group>
    </>
  );
}

export default function SystemScene(props: SceneProps) {
  return (
    <div
      className="webgl-layer"
      aria-hidden="true"
      data-render-mode={props.running ? "demand" : "stopped"}
    >
      <Canvas
        camera={{ position: [7.2, 6.2, 8], fov: 36 }}
        dpr={[1, 1.5]}
        frameloop={props.running ? "demand" : "never"}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(new Color("#0b100e"), 0);
          scene.background = null;
        }}
      >
        <Architecture {...props} />
      </Canvas>
    </div>
  );
}
