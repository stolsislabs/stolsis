import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { useComponentValue } from "@dojoengine/react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { Entity } from "@dojoengine/recs";
import { useDojo } from "../../dojo/useDojo";
import { useQueryParams } from "@/hooks/useQueryParams";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFontAwesome } from "@fortawesome/free-solid-svg-icons";

interface TProps {}

export const Surrender = (props: TProps) => {
  const { gameId } = useQueryParams();
  const {
    account: { account },
    setup: {
      clientComponents: { Game, Builder },
      systemCalls: { surrender },
    },
  } = useDojo();

  const gameKey = useMemo(() => {
    return getEntityIdFromKeys([BigInt(gameId)]) as Entity;
  }, [gameId]);
  const game = useComponentValue(Game, gameKey);

  const builderKey = useMemo(() => {
    return getEntityIdFromKeys([
      BigInt(gameId),
      BigInt(account.address),
    ]) as Entity;
  }, [gameId, account]);
  const builder = useComponentValue(Builder, builderKey);

  const disabled = useMemo(() => {
    return !!game?.over;
  }, [game]);

  if (!account || !game || !builder || game.mode !== 1) return <></>;

  return (
    <AlertDialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AlertDialogTrigger asChild>
              <Button disabled={disabled} variant={"command"} size={"command"}>
                <FontAwesomeIcon className="h-12" icon={faFontAwesome} />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p className="select-none">Surrender</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Surrender?</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col gap-4">
              <p>You are about to surrender, this action cannot be undone.</p>
              <p>Your score will be submitted and the game will be over.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              surrender({
                account: account,
                game_id: gameId,
              });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
