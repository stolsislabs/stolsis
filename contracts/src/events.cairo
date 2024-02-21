//! Events definition.

#[derive(Drop, starknet::Event)]
struct Built {
    #[key]
    game_id: u32,
    tile_id: u32,
    x: u32,
    y: u32,
    player_id: felt252,
    player_name: felt252,
}

#[derive(Drop, starknet::Event)]
struct Scored {
    #[key]
    game_id: u32,
    tile_id: u32,
    x: u32,
    y: u32,
    player_id: felt252,
    player_name: felt252,
    order_id: u8,
    points: u32,
}
