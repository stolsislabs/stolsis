import { useMemo } from "react";
import { useDojo } from "../../dojo/useDojo";
import { useQueryParams } from "@/hooks/useQueryParams";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBuilder } from "@/hooks/useBuilder";
import { Account } from "starknet";

export const Discard = () => {
  const { gameId } = useQueryParams();
  const {
    account: { account },
    setup: {
      systemCalls: { discard },
    },
  } = useDojo();

  const { builder } = useBuilder({
    gameId: gameId,
    playerId: account?.address,
  });

  const disabled = useMemo(() => {
    return !builder?.tileId;
  }, [builder]);

  if (!account || !builder) return <></>;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={disabled}
            variant={"command"}
            size={"command"}
            onClick={() =>
              discard({
                account: account as Account,
                game_id: gameId,
              })
            }
          >
            <FontAwesomeIcon className="h-12" icon={faFire} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="select-none">Discard tile</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
