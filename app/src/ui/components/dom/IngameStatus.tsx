import { useDojo } from "@/dojo/useDojo";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useGame } from "@/hooks/useGame";
import { useBuilder } from "@/hooks/useBuilder";
import {
  IconDefinition,
  faFire,
  faHammer,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ModeType } from "@/dojo/game/types/mode";
import { ReactNode, useEffect, useState } from "react";
import { Game } from "@/dojo/game/models/game";
import { formatTimeUntil } from "@/utils/time";
import { useBuilders } from "@/hooks/useBuilders";
import { Builder } from "@/dojo/game/models/builder";
import { usePlayer } from "@/hooks/usePlayer";

export const IngameStatus = ({ hasOpenMenu }: { hasOpenMenu: boolean }) => {
  const { gameId } = useQueryParams();
  const {
    account: { account },
  } = useDojo();

  const { game } = useGame({ gameId });
  const { builder } = useBuilder({ gameId, playerId: account?.address });
  const { builders } = useBuilders({ gameId })

  if (game?.mode.value === ModeType.Duel) {
    return (
      <DuelScore builders={builders} hasOpenMenu={hasOpenMenu}>
        <DuelCountdown game={game} hasOpenMenu={hasOpenMenu} />
      </DuelScore>
    )
  }

  return (
    game &&
    builder && (
      <div
        className={`w-full text-[#686868] flex justify-center items-middle col-start-1 sm:col-start-1 row-start-1 absolute ${hasOpenMenu ? "hidden sm:flex" : "flex"}`}
      >
        <StatusSlot data={builder.score} />
        <StatusSlot
          iconData={{ def: faHammer, style: "mx-2" }}
          data={`${builder.built + 1}/${game.mode.count()}`}
        />
        <StatusSlot
          iconData={{ def: faFire, style: "text-orange-500 mx-2" }}
          data={builder.discarded}
        />
      </div>
    )
  );
};

const DuelScore = ({ builders, hasOpenMenu, children }: { builders: Array<Builder>, hasOpenMenu: boolean, children: ReactNode }) => {
  const { account: { account } } = useDojo();
  const me = builders.find(builder => builder.player_id === account?.address)
  const challenger = builders.find(builder => builder.player_id !== account?.address)

  return me && challenger && (
    <div
      className={`w-full text-[#686868] flex justify-center items-center col-start-1 sm:col-start-1 gap-8 row-start-1 absolute ${hasOpenMenu ? "hidden sm:flex" : "flex"}`}
    >
      <DuelScorePlayer builder={me} />
      {children}
      <DuelScorePlayer builder={challenger} />
    </div>
  )
}

const DuelScorePlayer = ({ builder }: { builder: Builder }) => {
  const { player } = usePlayer({ playerId: builder.player_id });

  return (
    <div className="flex gap-2 bg-black/10 py-1 px-2 rounded-lg">
      <p>{player?.name}</p>
      <p>{builder?.score}</p>
    </div>
  )
}

const DuelCountdown = ({ game }: { game: Game, hasOpenMenu: boolean }) => {
  const [timeLeft, setTimeLeft] = useState(game.getEndDate());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(game.getEndDate());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [game]); // Add game as a dependency

  return (
    <p>{formatTimeUntil(new Date(timeLeft))}</p>
  );
};

type IconData = {
  def: IconDefinition;
  style?: string;
};
type StatusSlotProps = {
  iconData?: IconData;
  data: string | number;
};

const StatusSlot = ({ iconData, data }: StatusSlotProps) => {
  return (
    <div className="flex items-center">
      {iconData && (
        <FontAwesomeIcon className={iconData.style} icon={iconData.def} />
      )}
      <p>{data}</p>
    </div>
  );
};
