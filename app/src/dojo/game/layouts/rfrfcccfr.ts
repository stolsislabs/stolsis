// Source: https://github.com/stolslilabs/paved/blob/main/contracts/src/layouts/rfrfcccfr.cairo

import { AreaType } from "../types/area";
import { Move } from "../types/move";
import { Direction, DirectionType } from "../types/direction";
import { Spot, SpotType } from "../types/spot";

export class Configuration {
  public static starts(): Array<SpotType> {
    return [
      SpotType.Center,
      SpotType.NorthWest,
      SpotType.NorthEast,
      SpotType.SouthEast,
    ];
  }

  public static moves(from: SpotType): Array<Move> {
    switch (from) {
      case SpotType.Center:
      case SpotType.North:
      case SpotType.West:
        return [
          new Move(
            new Direction(DirectionType.North),
            new Spot(SpotType.South)
          ),
          new Move(new Direction(DirectionType.West), new Spot(SpotType.East)),
        ];
      case SpotType.NorthWest:
        return [
          new Move(
            new Direction(DirectionType.North),
            new Spot(SpotType.SouthWest)
          ),
          new Move(
            new Direction(DirectionType.West),
            new Spot(SpotType.NorthEast)
          ),
        ];
      case SpotType.NorthEast:
      case SpotType.SouthWest:
        return [
          new Move(
            new Direction(DirectionType.North),
            new Spot(SpotType.SouthEast)
          ),
          new Move(
            new Direction(DirectionType.West),
            new Spot(SpotType.SouthEast)
          ),
        ];
      case SpotType.East:
      case SpotType.SouthEast:
      case SpotType.South:
        return [
          new Move(new Direction(DirectionType.East), new Spot(SpotType.West)),
          new Move(
            new Direction(DirectionType.South),
            new Spot(SpotType.North)
          ),
        ];
      default:
        return [];
    }
  }

  public static area(from: SpotType): AreaType {
    switch (from) {
      case SpotType.Center:
      case SpotType.North:
      case SpotType.West:
        return AreaType.A;
      case SpotType.NorthWest:
        return AreaType.B;
      case SpotType.NorthEast:
      case SpotType.SouthWest:
        return AreaType.C;
      case SpotType.East:
      case SpotType.SouthEast:
      case SpotType.South:
        return AreaType.D;
      default:
        return AreaType.None;
    }
  }

  public static adjacentRoads(from: SpotType): Array<SpotType> {
    switch (from) {
      case SpotType.NorthWest:
      case SpotType.NorthEast:
      case SpotType.SouthWest:
        return [SpotType.Center];
      default:
        return [];
    }
  }

  public static adjacentCities(from: SpotType): Array<SpotType> {
    switch (from) {
      case SpotType.NorthEast:
      case SpotType.SouthWest:
        return [SpotType.SouthEast];
      default:
        return [];
    }
  }
}
