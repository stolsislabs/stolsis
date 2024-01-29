import { useDojo } from "../../dojo/useDojo";
import { shortString } from "starknet";
import { Button } from "@/components/ui/button";
import { useGameStore } from "../../store";

export const Create = () => {
  const { gameId } = useGameStore();
  const {
    account,
    setup: {
      client: { play },
    },
  } = useDojo();

  const handleClick = () => {
    play.create({
      account: account.account,
      game_id: gameId,
      name: shortString.encodeShortString(name),
      order: order,
    });
  };

  const name = "OHAYO";
  const order = 1;

  return (
    <div className="flex space-x-3 justify-between p-2 flex-wrap">
      <Button variant={"default"} onClick={handleClick}>
        Create
      </Button>
    </div>
  );
};
