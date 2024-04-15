import { TileTexture } from "./TileTexture";
import { TileEmpty } from "./TileEmpty";
import { useTiles } from "@/hooks/useTiles";

type Position = {
  col: number;
  row: number;
};

type Item = {
  tile: any | Position;
  empty: boolean;
};

type Items = {
  [key: string]: Item;
};

export const TileTextures = ({ squareSize }: { squareSize: number }) => {
  const { items } = useTiles();

  return (
    <>
      {Object.keys(items).map((key: string) => {
        const item = items[key];
        if (item.empty) {
          return (
            <TileEmpty
              key={key}
              col={item.tile.col}
              row={item.tile.row}
              size={squareSize}
            />
          );
        } else {
          return <TileTexture key={key} tile={item.tile} size={squareSize} />;
        }
      })}
    </>
  );
};
