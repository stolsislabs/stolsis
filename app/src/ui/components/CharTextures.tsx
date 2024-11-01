import { useMemo } from "react";
import { CharTexture } from "./CharTexture";
import { useCharacters } from "@/hooks/useCharacters";
import { useQueryParams } from "@/hooks/useQueryParams";

export const CharTextures = ({
  radius,
  height,
  squareSize,
}: {
  radius: number;
  height: number;
  squareSize: number;
}) => {
  const { gameId } = useQueryParams();
  const { characters } = useCharacters({ gameId });

  const renderedItems = useMemo(() => {
    return characters.map((character) => {
      return (
        <CharTexture
          key={`${character.index}-${character.player_id}`}
          character={character}
          radius={radius}
          height={height}
          size={squareSize}
        />
      );
    });
  }, [characters, radius, height, squareSize]);

  return <>{renderedItems}</>;
};
