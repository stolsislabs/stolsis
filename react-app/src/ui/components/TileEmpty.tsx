import * as THREE from "three";
import { useDojo } from "@/dojo/useDojo";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useMemo, useRef, useState, useEffect } from "react";
import { useGameStore } from "@/store";
import { getImage, offset, other_offset } from "@/utils";
import { checkCompatibility } from "@/utils/layout";
import { createSquareGeometry, getSquarePosition, loader } from "./TileTexture";
import { useQueryParams } from "@/hooks/useQueryParams";
import { defineSystem, Has, HasValue } from "@dojoengine/recs";

export const TileEmpty = ({ col, row, size }: any) => {
  const { gameId } = useQueryParams();
  const {
    setup: {
      world,
      clientComponents: { Tile },
    },
  } = useDojo();

  const squareGeometry = useMemo(() => createSquareGeometry(size), [size]);
  const meshRef = useRef<any>();
  const [background, setBackground] = useState<null | string>(null);
  const [texture, setTexture] = useState<THREE.Texture | undefined>(undefined);
  const [rotation, setRotation] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [northTile, setNorthTile] = useState<Entity | undefined>();
  const [eastTile, setEastTile] = useState<Entity | undefined>();
  const [southTile, setSouthTile] = useState<Entity | undefined>();
  const [westTile, setWestTile] = useState<Entity | undefined>();
  const {
    orientation,
    selectedTile,
    setSelectedTile,
    activeEntity,
    hoveredTile,
    setHoveredTile,
    setX,
    setY,
    setValid,
  } = useGameStore();

  const activeTile = useComponentValue(Tile, activeEntity);

  useEffect(() => {
    defineSystem(
      world,
      [Has(Tile), HasValue(Tile, { game_id: gameId, x: col, y: row + 1 })],
      ({ value: [tile] }: any) => {
        if (tile.orientation === 0 || tile.x !== col || tile.y !== row + 1)
          return;
        setNorthTile(tile);
      }
    );
    defineSystem(
      world,
      [Has(Tile), HasValue(Tile, { game_id: gameId, x: col + 1, y: row })],
      ({ value: [tile] }: any) => {
        if (tile.orientation === 0 || tile.x !== col + 1 || tile.y !== row)
          return;
        setEastTile(tile);
      }
    );
    defineSystem(
      world,
      [Has(Tile), HasValue(Tile, { game_id: gameId, x: col, y: row - 1 })],
      ({ value: [tile] }: any) => {
        if (tile.orientation === 0 || tile.x !== col || tile.y !== row - 1)
          return;
        setSouthTile(tile);
      }
    );
    defineSystem(
      world,
      [Has(Tile), HasValue(Tile, { game_id: gameId, x: col - 1, y: row })],
      ({ value: [tile] }: any) => {
        if (tile.orientation === 0 || tile.x !== col - 1 || tile.y !== row)
          return;
        setWestTile(tile);
      }
    );
  }, []);

  const isSelected = useMemo(() => {
    return selectedTile && selectedTile.col === col && selectedTile.row === row;
  }, [selectedTile]);

  // This state is used to ensure hovered state is updated correctly
  const isHovered = useMemo(() => {
    return (
      hovered &&
      hoveredTile &&
      hoveredTile.col === col &&
      hoveredTile.row === row
    );
  }, [hoveredTile, hovered]);

  const isValid = useMemo(() => {
    return (
      activeTile &&
      (hovered || isSelected) &&
      orientation &&
      checkCompatibility(
        activeTile.plan,
        orientation,
        northTile,
        eastTile,
        southTile,
        westTile
      )
    );
  }, [
    activeTile,
    orientation,
    hovered,
    isSelected,
    northTile,
    eastTile,
    southTile,
    westTile,
  ]);

  useEffect(() => {
    if (background) {
      loader.load(background, (loadedTexture) => {
        loadedTexture.center.set(0.5, 0.5);
        loadedTexture.rotation = rotation;
        setTexture(loadedTexture);
      });
    } else {
      setTexture(undefined);
    }
  }, [background, rotation, orientation]);
  useEffect(() => {
    if (activeTile && isSelected) {
      setBackground(getImage(activeTile));
      setRotation(calculateRotation(orientation));
    } else {
      setBackground(null);
    }
  }, [isSelected, orientation, activeTile]);
  useEffect(() => {
    if (isSelected) {
      setRotation(calculateRotation(orientation));
    }
  }, [isSelected, orientation]);
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);
  useEffect(() => {
    if (!isHovered) {
      handlePointerLeave();
    }
  }, [isHovered]);

  useEffect(() => {
    if (isSelected && activeTile) {
      setValid(isValid || false);
    }
  }, [isSelected, isValid]);

  const handleMeshClick = () => {
    setSelectedTile({ col, row });
    setX(col);
    setY(row);
  };
  const handlePointerEnter = () => {
    setHovered(true);
    setHoveredTile({ col, row });
    if (activeTile) {
      setBackground(getImage(activeTile));
      setRotation(calculateRotation(orientation));
    } else {
      setBackground(null);
    }
  };
  const handlePointerLeave = () => {
    setHovered(false);
    if (isSelected && activeTile) {
      const image = getImage(activeTile);
      setBackground(image);
    } else {
      setBackground(null);
    }
  };
  const position = useMemo(() => {
    const position = getSquarePosition({
      row: row - offset + other_offset,
      col: col - offset + other_offset,
      squareSize: 3,
    });
    return position;
  }, []);
  return (
    <>
      {texture && (
        <mesh
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onClick={handleMeshClick}
          ref={meshRef}
          position={[position.x, position.y, 0]}
          geometry={squareGeometry}
        >
          <meshStandardMaterial
            emissive={isValid ? "green" : "red"}
            // emissive={"white"}
            emissiveIntensity={0.3}
            map={texture}
          />
        </mesh>
      )}
      {!texture && (
        <mesh
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onClick={handleMeshClick}
          ref={meshRef}
          position={[position.x, position.y, 0]}
          geometry={squareGeometry}
        >
          <meshStandardMaterial
            color={"#ADD8E6"}
            transparent={true}
            opacity={0.3}
          />
        </mesh>
      )}
    </>
  );
};

const calculateRotation = (orientation: any) =>
  (Math.PI / 2) * (1 - orientation);
