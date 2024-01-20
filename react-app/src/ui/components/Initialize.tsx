import { useDojo } from "../../dojo/useDojo";
import { Event, InvokeTransactionReceiptResponse, shortString } from "starknet";
import { Button } from "@/components/ui/button";
import { useGameStore } from "../../store";
import { getEntityComponents } from "@dojoengine/recs";

export const Initialize = () => {
  const {
    account,
    setup: {
      client: { play },
    },
  } = useDojo();

  const handleClick = () => {
    play.initialize({
      account: account.account,
    });
  };

  return (
    <div className="flex space-x-3 justify-between p-2 flex-wrap">
      <Button variant={"default"} onClick={handleClick}>
        Initialize
      </Button>
    </div>
  );
};
