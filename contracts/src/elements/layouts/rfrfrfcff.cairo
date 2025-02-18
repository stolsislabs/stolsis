// Core imports

use core::debug::PrintTrait;

// Internal imports

use paved::elements::layouts::interface::LayoutTrait;
use paved::types::direction::Direction;
use paved::types::spot::{Spot, SpotImpl};
use paved::types::move::{Move, MoveImpl};
use paved::types::area::Area;

impl LayoutImpl of LayoutTrait {
    #[inline]
    fn starts() -> Array<Spot> {
        let mut starts: Array<Spot> = ArrayTrait::new();
        starts.append(Spot::Center);
        // starts.append(Spot::NorthWest);
        // starts.append(Spot::NorthEast);
        starts.append(Spot::South);
        starts
    }

    #[inline]
    fn moves(from: Spot) -> Array<Move> {
        let area: Area = Self::area(from);
        let mut moves: Array<Move> = ArrayTrait::new();
        match area {
            Area::A => {
                moves.append(Move { direction: Direction::North, spot: Spot::South });
                moves.append(Move { direction: Direction::East, spot: Spot::West });
            },
            Area::B => {
                moves.append(Move { direction: Direction::North, spot: Spot::SouthWest });
                moves.append(Move { direction: Direction::East, spot: Spot::SouthWest });
                moves.append(Move { direction: Direction::West, spot: Spot::East });
            },
            Area::C => {
                moves.append(Move { direction: Direction::North, spot: Spot::SouthEast });
                moves.append(Move { direction: Direction::East, spot: Spot::NorthWest });
            },
            Area::D => { moves.append(Move { direction: Direction::South, spot: Spot::North }); },
            _ => {},
        };
        moves
    }

    #[inline]
    fn area(from: Spot) -> Area {
        match from {
            Spot::None => Area::None,
            Spot::Center => Area::A,
            Spot::NorthWest => Area::B,
            Spot::North => Area::A,
            Spot::NorthEast => Area::C,
            Spot::East => Area::A,
            Spot::SouthEast => Area::B,
            Spot::South => Area::D,
            Spot::SouthWest => Area::B,
            Spot::West => Area::B,
        }
    }

    #[inline]
    fn adjacent_roads(from: Spot) -> Array<Spot> {
        let mut roads: Array<Spot> = ArrayTrait::new();
        match from {
            Spot::None => {},
            Spot::Center => {},
            Spot::NorthWest => roads.append(Spot::Center),
            Spot::North => {},
            Spot::NorthEast => roads.append(Spot::Center),
            Spot::East => {},
            Spot::SouthEast => roads.append(Spot::Center),
            Spot::South => {},
            Spot::SouthWest => roads.append(Spot::Center),
            Spot::West => roads.append(Spot::Center),
        };
        roads
    }

    #[inline]
    fn adjacent_cities(from: Spot) -> Array<Spot> {
        let mut cities: Array<Spot> = ArrayTrait::new();
        match from {
            Spot::None => {},
            Spot::Center => {},
            Spot::NorthWest => cities.append(Spot::South),
            Spot::North => {},
            Spot::NorthEast => {},
            Spot::East => {},
            Spot::SouthEast => cities.append(Spot::South),
            Spot::South => {},
            Spot::SouthWest => cities.append(Spot::South),
            Spot::West => cities.append(Spot::South),
        };
        cities
    }
}

#[cfg(test)]
mod tests {
    // Core imports

    use core::debug::PrintTrait;

    // Local imports

    use super::{LayoutImpl, Direction, Spot, Move};

    #[test]
    fn test_layouts_moves_from_north() {
        let mut moves = LayoutImpl::moves(Spot::North);
        assert(moves.len() == 2, 'Layout: wrong moves len');

        let move = moves.pop_front().unwrap();
        let expected = Move { direction: Direction::North, spot: Spot::South };
        assert(move.direction == expected.direction, 'Layout: wrong move direction');
        assert(move.spot == expected.spot, 'Layout: wrong move spot');

        let move = moves.pop_front().unwrap();
        let expected = Move { direction: Direction::East, spot: Spot::West };
        assert(move.direction == expected.direction, 'Layout: wrong move direction');
        assert(move.spot == expected.spot, 'Layout: wrong move spot');
    }
}
