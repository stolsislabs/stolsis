import type { IWorld } from "./bindings/contracts.gen";

import { toast } from "sonner";
import { getEntityIdFromKeys, shortenHex } from "@dojoengine/utils";
import { Entity } from "@dojoengine/recs";
import { uuid } from "@latticexyz/utils";
import { ClientModels } from "./models";
import { ModeType } from "./game/types/mode";

export type SystemCalls = ReturnType<typeof systems>;

export function systems({
  client,
  clientModels,
}: {
  client: IWorld;
  clientModels: ClientModels;
}) {
  const extractedMessage = (message: string) => {
    return message.match(/\('([^']+)'\)/)?.[1];
  };

  const getContract = (mode: ModeType): any => {
    switch (mode) {
      case ModeType.Daily:
        return client.daily;
      case ModeType.Weekly:
        return client.weekly;
      case ModeType.Tutorial:
        return client.tutorial;
      default:
        return client.daily;
    }
  };

  const notify = (message: string, transaction: any) => {
    if (transaction.execution_status != "REVERTED") {
      toast.success(message, {
        description: shortenHex(transaction.transaction_hash),
        action: {
          label: "View",
          onClick: () =>
            window.open(
              `https://worlds.dev/networks/slot/worlds/paved/txs/${transaction.transaction_hash}`,
            ),
        },
      });
    } else {
      toast.error(extractedMessage(transaction.revert_reason));
    }
  };

  const create_player = async ({ account, ...props }: any) => {
    try {
      const { transaction_hash } = await client.account.create({
        account,
        ...props,
      });

      notify(
        "Player has been created.",
        await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        }),
      );
    } catch (error: any) {
      toast.error(extractedMessage(error.message));
    }
  };

  const create_game = async ({ account, mode, ...props }: any) => {
    const contract = getContract(mode?.value as ModeType);
    try {
      const { transaction_hash } = await contract.spawn({
        account,
        ...props,
      });

      mode?.value === ModeType.Tutorial
        ? await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        })
        : notify(
          "Game has been created.",
          await account.waitForTransaction(transaction_hash, {
            retryInterval: 100,
          }),
        );
    } catch (error: any) {
      console.log(error);
      toast.error(extractedMessage(error.message));
    }
  };

  const claim = async ({ account, mode, ...props }: any) => {
    try {
      const contract = getContract(mode?.value as ModeType);
      const { transaction_hash } = await contract.claim({
        account,
        ...props,
      });
      notify(
        "Tournament has been claimed.",
        await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        }),
      );
    } catch (error: any) {
      toast.error(extractedMessage(error.message));
    }
  };

  const sponsor = async ({ account, mode, ...props }: any) => {
    try {
      const contract = getContract(mode?.value as ModeType);
      const { transaction_hash } = await contract.sponsor({
        account,
        ...props,
      });
      notify(
        "Tournament has been sponsored.",
        await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        }),
      );
    } catch (error: any) {
      toast.error(extractedMessage(error.message));
    }
  };

  const discard = async ({ account, mode, ...props }: any) => {
    try {
      const contract = getContract(mode?.value as ModeType);
      const { transaction_hash } = await contract.discard({
        account,
        ...props,
      });
      notify(
        "Tile has been discarded.",
        await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        }),
      );
    } catch (error: any) {
      toast.error(extractedMessage(error.message));
    }
  };

  const surrender = async ({ account, mode, ...props }: any) => {
    try {
      const contract = getContract(mode?.value as ModeType);
      const { transaction_hash } = await contract.surrender({
        account,
        ...props,
      });
      notify(
        "Game has been abandoned.",
        await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        }),
      );
    } catch (error: any) {
      toast.error(extractedMessage(error.message));
    }
  };

  const build = async ({ account, mode, ...props }: any) => {
    const buidlerKey = getEntityIdFromKeys([
      BigInt(props.game_id),
      BigInt(account?.address),
    ]) as Entity;

    const builderId = uuid();
    clientModels.models.Builder.addOverride(builderId, {
      entity: buidlerKey,
      value: {
        game_id: props.game_id,
        player_id: BigInt(account?.address),
        tile_id: 0,
      },
    });

    const tileKey = getEntityIdFromKeys([
      BigInt(props.game_id),
      BigInt(props.tile_id),
    ]) as Entity;

    const tileId = uuid();
    clientModels.models.Tile.addOverride(tileId, {
      entity: tileKey,
      value: {
        game_id: props.game_id,
        id: props.tile_id,
        player_id: BigInt(account?.address),
        orientation: props.orientation,
        x: props.x,
        y: props.y,
        occupied_spot: props.spot,
      },
    });

    const contractMap = {
      [ModeType.Daily]: client.daily,
      [ModeType.Weekly]: client.weekly,
      [ModeType.Tutorial]: client.tutorial,
    };

    try {
      const contract =
        contractMap[mode?.value as keyof typeof contractMap] ?? client.daily;
      const { transaction_hash } = await contract.build({
        account,
        ...props,
      });
      notify(
        "Tile has been paved.",
        await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        }),
      );
      // Sleep 5 seconds for indexer to index
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error: any) {
      clientModels.models.Tile.removeOverride(tileId);
      clientModels.models.Builder.removeOverride(builderId);
      toast.error(extractedMessage(error.message));
    } finally {
      clientModels.models.Tile.removeOverride(tileId);
      clientModels.models.Builder.removeOverride(builderId);
    }
  };

  return {
    create_player,
    create_game,
    claim,
    sponsor,
    discard,
    surrender,
    build,
  };
}
