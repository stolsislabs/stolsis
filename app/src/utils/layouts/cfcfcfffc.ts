// Source: contracts/src/layouts/cfcfcfffc.cairo

import { AreaType } from "../types/area";
import { Move } from "../types/move";
import { Direction, DirectionType } from "../types/direction";
import { Spot, SpotType } from "../types/spot";

export class Configuration {
  public static starts(): Array<SpotType> {
    return [
      SpotType.Center,
      SpotType.NorthWest,
      SpotType.North,
      SpotType.South,
    ];
  }

  public static moves(from: SpotType): Array<Move> {
    switch (from) {
      case SpotType.Center:
      case SpotType.East:
      case SpotType.West:
        return [
          new Move(new Direction(DirectionType.East), new Spot(SpotType.West)),
          new Move(new Direction(DirectionType.West), new Spot(SpotType.East)),
        ];
      case SpotType.North:
        return [
          new Move(
            new Direction(DirectionType.North),
            new Spot(SpotType.South)
          ),
        ];
      case SpotType.SouthEast:
      case SpotType.South:
      case SpotType.SouthWest:
        return [
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
      case SpotType.East:
      case SpotType.West:
        return AreaType.A;
      case SpotType.NorthWest:
      case SpotType.NorthEast:
        return AreaType.B;
      case SpotType.North:
        return AreaType.C;
      case SpotType.SouthEast:
      case SpotType.South:
      case SpotType.SouthWest:
        return AreaType.D;
      default:
        return AreaType.None;
    }
  }

  public static adjacentRoads(from: SpotType): Array<SpotType> {
    switch (from) {
      default:
        return [];
    }
  }

  public static adjacentCities(from: SpotType): Array<SpotType> {
    switch (from) {
      case SpotType.NorthWest:
      case SpotType.NorthEast:
        return [SpotType.Center, SpotType.North];
      case SpotType.SouthEast:
      case SpotType.South:
      case SpotType.SouthWest:
        return [SpotType.Center];
      default:
        return [];
    }
  }
}
