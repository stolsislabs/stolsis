import { Button } from "@/ui/elements/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useMemo } from "react";
import { Tournament as TournamentClass } from "@/dojo/game/models/tournament";
import { useDojo } from "@/dojo/useDojo";
import { Account } from "starknet";
import { Mode } from "@/dojo/game/types/mode";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";

export const Claim = ({
    tournament,
    rank,
    mode,
}: {
    tournament: TournamentClass;
    rank: number;
    mode: Mode;
}) => {
    // const { account } = useAccount();
    const {
        account: { account },
        setup: {
            systemCalls: { claim },
        },
    } = useDojo();

    const disabled = useMemo(() => {
        if (!tournament) return true;
        return !tournament.isOver(mode) || tournament.isClaimed(rank);
    }, [tournament]);

    const handleClick = useCallback(() => {
        if (account) {
            claim({
                account: account as Account,
                mode,
                tournament_id: tournament.id,
                rank,
            });
        }
    }, [account, tournament]);

    return (
        <Button
            disabled={disabled}
            variant={"secondary"}
            size={"icon"}
            onClick={handleClick}
        >
            <FontAwesomeIcon icon={faSackDollar} />
        </Button>
    );
};