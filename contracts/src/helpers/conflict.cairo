// Core imports

use debug::PrintTrait;

// Internal imports

use stolsli::store::{Store, StoreImpl};
use stolsli::types::spot::Spot;
use stolsli::types::area::Area;
use stolsli::types::plan::Plan;
use stolsli::types::move::{Move, MoveImpl};
use stolsli::models::game::Game;
use stolsli::models::tile::{Tile, TilePosition, TileImpl};

#[generate_trait]
impl Conflict of ConflictTrait {
    #[inline(always)]
    fn start(game: Game, tile: Tile, at: Spot, ref store: Store) -> bool {
        // [Compute] Setup recursion
        let mut visited: Felt252Dict<bool> = Default::default();
        // [Compute] Recursively check characters
        let mut status = false;
        Conflict::iter(game, tile, at, ref status, ref visited, ref store);
        status
    }

    fn iter(
        game: Game,
        tile: Tile,
        at: Spot,
        ref status: bool,
        ref visited: Felt252Dict<bool>,
        ref store: Store
    ) {
        // [Check] The tile area is already visited, then pass
        let area: Area = tile.area(at);
        let visited_key = tile.get_key(area);
        let is_visited = visited.get(visited_key);
        if visited.get(visited_key) {
            return;
        };
        visited.insert(visited_key, true);

        // [Check] The tile handles a character
        let spot: Spot = tile.occupied_spot.into();
        let plan: Plan = tile.plan.into();
        if 0 != spot.into() && tile.are_connected(at, spot) {
            status = true;
            return;
        }

        // [Compute] Process next tiles if exist
        let mut north_oriented_moves: Array<Move> = tile.north_oriented_moves(at);
        loop {
            match north_oriented_moves.pop_front() {
                // [Compute] Process the current move
                Option::Some(north_oriented_move) => {
                    let mut move = north_oriented_move.rotate(tile.orientation.into());

                    // [Check] A tile exists at this position, otherwise the structure is not finished
                    let (x, y) = tile.proxy_coordinates(move.direction);
                    let tile_position: TilePosition = store.tile_position(game, x, y);
                    if tile_position.is_zero() {
                        continue;
                    }

                    // [Check] If a character has been met, then stop the recursion
                    let neighbor = store.tile(game, tile_position.tile_id);
                    Conflict::iter(game, neighbor, move.spot, ref status, ref visited, ref store);
                    if status {
                        break;
                    };
                },
                // [Check] Otherwise returns the points
                Option::None => { break; },
            }
        }
    }
}

