import { Tile } from "@/dojo/game/models/tile";
import { PlanType } from "@/dojo/game/types/plan"
import { useTiles } from "@/hooks/useTiles"
import { useCallback, useMemo } from "react"

export const useTileWonder = (tile: Tile | null) => {
    const { wonderRoadedTileIds, wonderUnroadedTileIds } = useTiles();

    const isRoadedWonder = useMemo(() => tile?.plan.value === PlanType.WFFFFFFFR, [tile]);
    const isUnroadedWonder = useMemo(() => tile?.plan.value === PlanType.WFFFFFFFF, [tile]);

    const getWonderIndex = useCallback((isRoaded: boolean) => {
        if (!tile) return -1;
        if (!isRoaded ? !isUnroadedWonder : !isRoadedWonder) return -1;
        const tiles = (isRoaded ? wonderRoadedTileIds : wonderUnroadedTileIds)[tile.playerId];
        // If there are no entries for any player, this must be the first wonder
        if (Object.keys(isRoaded ? wonderRoadedTileIds : wonderUnroadedTileIds).length === 0) {
            return 0;
        }
        return tiles?.indexOf(tile.id) ?? -1;
    }, [isRoadedWonder, isUnroadedWonder, tile, wonderRoadedTileIds, wonderUnroadedTileIds]);

    const wonderRoadedIndex = useMemo(() => getWonderIndex(true), [getWonderIndex]);
    const wonderUnroadedIndex = useMemo(() => getWonderIndex(false), [getWonderIndex]);

    return {
        isRoadedWonder,
        isUnroadedWonder,
        wonderRoadedIndex,
        wonderUnroadedIndex
    };
};