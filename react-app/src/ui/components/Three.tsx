import * as THREE from "three";
import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  useKeyboardControls,
  OrthographicCamera,
  OrbitControls,
} from "@react-three/drei";
import { TileTextures } from "./TileTextures";
import { CharTextures } from "./CharTextures";
import { Controls } from "@/ui/screens/GameScreen";
import { useGameStore, useCameraStore } from "@/store";

export const ThreeGrid = () => {
  return (
    <Canvas className="z-1" shadows>
      <Keyboard />
      <mesh>
        <Camera>
          <ambientLight color={"white"} intensity={1} />
          <ambientLight color={"white"} intensity={1} />

          <mesh rotation={[Math.PI / -2, 0, 0]}>
            <TileTextures squareSize={3} />
            <CharTextures radius={0.3} height={1} squareSize={3} />
          </mesh>
        </Camera>
      </mesh>
    </Canvas>
  );
};

function Keyboard() {
  const [sub] = useKeyboardControls<Controls>();

  const { orientation, setOrientation } = useGameStore();

  useEffect(() => {
    return sub(
      (state) => state.clockwise,
      (pressed) => {
        if (pressed) {
          setOrientation(orientation + 1);
        }
      }
    );
  }, [orientation]);

  useEffect(() => {
    return sub(
      (state) => state.counterClockwise,
      (pressed) => {
        if (pressed) {
          setOrientation(orientation - 1);
        }
      }
    );
  }, [orientation]);

  return <></>;
}

function Camera({ children }: { children?: React.ReactNode }) {
  const { position, zoom, aspect, near, far, reset, resetAll, rotation } =
    useCameraStore();
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const controls = useRef<any>(null);

  useEffect(() => {
    if (reset) {
      controls.current.reset();
      resetAll();
    } else if (camera.current) {
      camera.current.position.set(...position);
    }
  }, [reset, position]);

  return (
    <>
      <OrbitControls
        enableRotate={true}
        zoomToCursor
        panSpeed={0.8}
        rotateSpeed={0.1}
        enablePan={true}
        enableDamping
        ref={controls}
        makeDefault
        target={[0, 0, 0]}
        minAzimuthAngle={0}
        maxAzimuthAngle={0}
        minPolarAngle={1.5} // Allow looking directly down
        maxPolarAngle={Math.PI}
        zoomSpeed={0.8}
      />
      <OrthographicCamera
        // makeDefault
        zoom={zoom}
        isOrthographicCamera
        rotation={rotation}
        // aspect={aspect}
        near={near}
        far={far}
      >
        {children}
      </OrthographicCamera>
    </>
  );
}
