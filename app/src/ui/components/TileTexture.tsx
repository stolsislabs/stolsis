import * as THREE from "three";
import { offset, other_offset } from "@/dojo/game";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "@/store";
import { useGLTF } from "@react-three/drei";

export const loader = new THREE.TextureLoader();

export const createSquareGeometry = (size: any) => {
  return new THREE.BoxGeometry(size, size, 0.1);
};

export const TileTexture = ({ tile, size, length, isTutorial }: any) => {
  const meshRef = useRef<any>();
  const [texture, setTexture] = useState<THREE.Texture | undefined>(undefined);
  const { setHoveredTile } = useGameStore();

  const squareGeometry = useMemo(() => createSquareGeometry(size), [size]);
  const position = useMemo(() => {
    const row = tile ? tile.y - offset + other_offset : 0;
    const col = tile ? tile.x - offset + other_offset : 0;
    return getSquarePosition({ row, col, squareSize: size });
  }, [tile, size]);

  useEffect(() => {
    if (tile) {
      const rotation = (Math.PI / 2) * (1 - tile.orientation.into());
      const image = tile.getImage();
      loader.load(image, (loadedTexture) => {
        loadedTexture.center.set(0.5, 0.5);
        loadedTexture.rotation = rotation;
        setTexture(loadedTexture);
      });
    } else {
      setTexture(undefined);
    }
  }, [tile]);

  const handlePointerEnter = () => {
    const col = tile ? tile?.y - offset + other_offset : 0;
    const row = tile ? tile?.x - offset + other_offset : 0;
    setHoveredTile({ col, row });
  };

  const models = useMemo(() => {
    return {
      1: useGLTF("/models/ccccccccc.glb").scene.clone(),
      2: useGLTF("/models/cccccfffc.glb").scene.clone(),
      3: useGLTF("/models/cccccfrfc.glb").scene.clone(),
      4: useGLTF("/models/cfffcfffc.glb").scene.clone(),
      5: useGLTF("/models/ffcfffcff.glb").scene.clone(),
      6: useGLTF("/models/ffcfffffc.glb").scene.clone(),
      7: useGLTF("/models/ffffcccff.glb").scene.clone(),
      8: useGLTF("/models/ffffffcff.glb").scene.clone(),
      9: useGLTF("/models/rfffrfcfr.glb").scene.clone(),
      10: useGLTF("/models/rfffrfffr.glb").scene.clone(),
      11: useGLTF("/models/rfrfcccfr.glb").scene.clone(),
      12: useGLTF("/models/rfrfffcfr.glb").scene.clone(),
      13: useGLTF("/models/rfrfffffr.glb").scene.clone(),
      14: useGLTF("/models/rfrfrfcff.glb").scene.clone(),
      15: useGLTF("/models/sfrfrfcfr.glb").scene.clone(),
      16: useGLTF("/models/sfrfrfffr.glb").scene.clone(),
      17: useGLTF("/models/sfrfrfrfr.glb").scene.clone(),
      18: useGLTF("/models/wffffffff.glb").scene.clone(),
      19: useGLTF("/models/wfffffffr.glb").scene.clone(),
    };
  }, []);

  const shadowedModel = useMemo(() => {
    const model = models[tile.plan.into() as keyof typeof models].clone();
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const dim = box.getSize(new THREE.Vector3());
    model.position.x -= center.x;
    model.position.y -= center.y;
    model.position.z -= center.z;
    model.position.y += dim.y * 0.5;
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Preserve original material properties
        const originalMaterial = child.material;

        // Create a new MeshPhongMaterial and copy over relevant properties
        const standardMaterial = new THREE.MeshStandardMaterial({
          color: originalMaterial.color,
          map: originalMaterial.map, // Preserve texture map if available
          roughness: 1, // Adjust roughness for realistic appearance
          emissive: originalMaterial.emissive, // Preserve emissive color if available
          emissiveIntensity: 1, // Adjust emissive intensity if emissive color is present
          side: THREE.FrontSide, // Ensure both sides of the material are visible
        });

        child.material = standardMaterial;

        child.castShadow = true; // Enable cast shadows for each mesh
        child.receiveShadow = true; // Enable receive shadows for each mesh
        child.material.side = THREE.FrontSide; // Ensure both sides of the material are visible
        if (child.material.map) child.material.map.anisotropy = 160; // Enhance texture quality

        // Add first set of edge detection (toon shading) using EdgesGeometry
        const edges1 = new THREE.EdgesGeometry(child.geometry);
        const lineMaterial1 = new THREE.LineBasicMaterial({
          color: 0x000000,
          linewidth: 2,
        });
        const lineSegments1 = new THREE.LineSegments(edges1, lineMaterial1);
        lineSegments1.scale.set(1.0, 1.0, 1.0); // Adjust scale for thicker lines
        lineSegments1.position.z += 0.001; // Offset in the z-axis by 1 unit
        child.add(lineSegments1);
      }
    });
    return model;
  }, []);

  const scale = useMemo(() => {
    if (!shadowedModel) return 1;
    const box = new THREE.Box3().setFromObject(shadowedModel);
    const dim = box.getSize(new THREE.Vector3());
    return (2 * size) / (dim.x + dim.z);
  }, [shadowedModel]);

  const strategyMode = useGameStore((state) => state.strategyMode);
  const visibilityCondition = isTutorial ? !strategyMode : strategyMode;

  const strategyMesh = useMemo(() => {
    if (!texture) return null;
    return (
      <mesh
        visible={visibilityCondition}
        ref={meshRef}
        onPointerEnter={handlePointerEnter}
        position={[position.x, position.y, 0]}
        geometry={squareGeometry}
      >
        <meshBasicMaterial attach="material-0" color={"#503A23"} />
        <meshBasicMaterial attach="material-1" color={"#503A23"} />
        <meshBasicMaterial attach="material-2" color={"#503A23"} />
        <meshBasicMaterial attach="material-3" color={"#503A23"} />
        <meshBasicMaterial attach="material-4" map={texture} />
        <meshBasicMaterial attach="material-5" color={"#503A23"} />
      </mesh>
    );
  }, [strategyMode, position, handlePointerEnter, squareGeometry, texture]);

  return (
    <>
      <group
        visible={!visibilityCondition}
        key={`tile-${tile.id}`}
        scale={scale}
        rotation={[
          Math.PI / 2,
          (Math.PI / 2) * (1 - tile.orientation.into()),
          0,
        ]}
        position={[position.x, position.y, 0]}
      >
        <primitive castShadow receiveShadow object={shadowedModel} />
      </group>

      {strategyMesh}
    </>
  );
};

export const getSquarePosition = ({
  row,
  col,
  squareSize,
}: {
  row: number;
  col: number;
  squareSize: number;
}) => {
  const x = col * squareSize;
  const y = row * squareSize;
  return { x, y };
};
