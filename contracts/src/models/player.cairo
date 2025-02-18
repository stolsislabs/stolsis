// Internal imports

use paved::constants;
use paved::models::index::Player;

mod errors {
    const PLAYER_NOT_EXIST: felt252 = 'Player: Does not exist';
    const PLAYER_ALREADY_EXIST: felt252 = 'Player: Already exist';
    const INVALID_NAME: felt252 = 'Player: Invalid name';
    const INVALID_MASTER: felt252 = 'Player: Invalid master';
    const INVALID_ORDER: felt252 = 'Player: Invalid order';
    const NO_TILES_LEFT: felt252 = 'Player: No tiles left';
    const TOO_MUCH_TILES: felt252 = 'Player: Too much tiles';
}

#[generate_trait]
impl PlayerImpl of PlayerTrait {
    #[inline]
    fn new(id: felt252, name: felt252, master: felt252) -> Player {
        // [Check] Name is valid
        assert(name != 0, errors::INVALID_NAME);

        // [Check] Master is valid
        assert(master != 0, errors::INVALID_MASTER);

        // [Return] Player
        Player { id, name, master: master }
    }

    #[inline]
    fn rename(ref self: Player, name: felt252) {
        // [Check] Name is valid
        assert(name != 0, errors::INVALID_NAME);
        // [Effect] Change the name
        self.name = name;
    }
}

#[generate_trait]
impl PlayerAssert of AssertTrait {
    #[inline]
    fn assert_exists(self: Player) {
        assert(self.is_non_zero(), errors::PLAYER_NOT_EXIST);
    }

    #[inline]
    fn assert_not_exists(self: Player) {
        assert(self.is_zero(), errors::PLAYER_ALREADY_EXIST);
    }
}

impl ZeroablePlayerImpl of core::Zeroable<Player> {
    #[inline]
    fn zero() -> Player {
        Player { id: 0, name: 0, master: 0 }
    }

    #[inline]
    fn is_zero(self: Player) -> bool {
        0 == self.name
    }

    #[inline]
    fn is_non_zero(self: Player) -> bool {
        !self.is_zero()
    }
}
