import { useDojo } from "../../dojo/useDojo";
import { Account, shortString } from "starknet";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { Entity } from "@dojoengine/recs";
import { useComponentValue } from "@dojoengine/react";
import { useMemo, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import {
  getDarkOrders,
  getLightOrders,
  getOrder,
  getOrderFromName,
} from "@/dojo/game";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { usePlayer } from "@/hooks/usePlayer";

export const Spawn = () => {
  const { address } = useAccount();
  const [playerName, setPlayerName] = useState("");
  const [orderName, setOrderName] = useState("");
  const [order, setOrder] = useState(1);

  const {
    account: { account },
    setup: {
      config: { masterAddress },
      systemCalls: { create_player },
    },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });

  const lightOrders = useMemo(() => {
    return getLightOrders();
  }, []);

  const darkOrders = useMemo(() => {
    return getDarkOrders();
  }, []);

  const disabled = useMemo(() => {
    return !!player || !account || account.address === masterAddress;
  }, [player, address, account, masterAddress]);

  useEffect(() => {
    if (player) {
      setPlayerName(player.name);
      setOrderName(getOrder(player.order));
    } else {
      setPlayerName("");
      setOrderName("");
    }
  }, [player]);

  useEffect(() => {
    if (orderName) {
      setOrder(getOrderFromName(orderName));
    }
  }, [orderName]);

  const handleClick = () => {
    if (address && account) {
      create_player({
        account: account as Account,
        name: shortString.encodeShortString(playerName),
        order: order,
        master: address,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} variant={"secondary"}>
          Spawn
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a player</DialogTitle>
          <DialogDescription>
            Choose a name and a default order.
          </DialogDescription>
        </DialogHeader>

        <Input
          className="`w-20"
          disabled={!!player}
          placeholder="Player Name"
          type="text"
          value={playerName}
          onChange={(e) => {
            setPlayerName(e.target.value);
          }}
        />

        <Select
          onValueChange={(value) => setOrderName(value)}
          value={orderName}
        >
          <SelectTrigger disabled={!!player}>
            <SelectValue placeholder="Select default order" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {lightOrders.map((name) => {
                return (
                  <SelectItem key={name} value={name}>
                    <FontAwesomeIcon className="pr-4" icon={faSun} />
                    {name}
                  </SelectItem>
                );
              })}
              {darkOrders.map((name) => {
                return (
                  <SelectItem key={name} value={name}>
                    <FontAwesomeIcon className="pr-4" icon={faMoon} />
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <DialogClose asChild>
          <Button
            disabled={!!player || !playerName || !orderName}
            variant={"default"}
            onClick={handleClick}
          >
            Spawn
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
