import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/elements/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/ui/elements/pagination";
import { useGames } from "@/hooks/useGames";
import { useTournament } from "@/hooks/useTournament";
import { useMemo, useState } from "react";
import { useDojo } from "@/dojo/useDojo";
import { Mode, ModeType } from "@/dojo/game/types/mode";
import { useTournaments } from "@/hooks/useTournaments";
import { Game } from "@/dojo/game/models/game";
import { usePlayer } from "@/hooks/usePlayer";
import { useBuilders } from "@/hooks/useBuilders";
import calendarIcon from "/assets/icons/calendar.svg";
import { Sponsor } from "./Sponsor";
import { Claim } from "./dom/Claim";
import { Spectate } from "./dom/Spectate";
import { Builder } from "@/dojo/game/models/builder";
import { useEntityQuery } from "@dojoengine/react";
import { getComponentValue, Has, NotValue } from "@dojoengine/recs";

type DuelPlayerRowProps = {
  rank: number,
  name: string,
  wins: number,
  totalGames: number,
  wonLords: number,
  totalTiles: number
}

type SoloGameRowProps = {
  game: Game,
  tournamentId: number,
  rank: number,
  mode: Mode
}

const duelHeaders = ["#", "Player", "Won", "Played", "Lords", "Tiles"];
const soloHeaders = ["#", "Player", "Score", "Time", "Tiles"];

const getSeason = (mode: Mode) => {
  const now = Math.floor(Date.now() / 1000);
  const id = Math.floor(now / mode.duration());
  return id - mode.offset();
};

export const Tournament = ({ mode }: { mode: Mode }) => {
  const { games } = useGames({ mode });
  const [page, setPage] = useState<number>(getSeason(mode));
  const allGames = useMemo(() =>
    mode.value === ModeType.Duel
      ? games
        .filter(game => game.getEndDate().getTime() < Date.now()) // verify if the game is over (game with duel property never have their "over" property set to true)
        .filter(game => game.start_time.getTime() !== 0)  // verify that the game is not a lobby
      : games
        .filter(game => game.tournament_id - BigInt(mode?.offset() || 0) === BigInt(page))
        .slice(0, 10),
    [games, page, mode]
  );

  const {
    setup: {
      clientModels: {
        models: { Builder },
        classes: { Builder: BuilderClass },
      },
    },
  } = useDojo();

  const builderKeys = useEntityQuery([
    Has(Builder),
    NotValue(Builder, { score: 0 }),
  ]);

  const newBuilders = useMemo(() => builderKeys.map((entity) => {
    const component = getComponentValue(Builder, entity);
    return component ? new BuilderClass(component) : undefined;
  })
    .filter(builder => builder !== undefined), [Builder, BuilderClass, builderKeys])
    .filter(builder => games.find(game => game.id === builder.game_id))

  const matchGameWithBuilders = (games: Game[], builders: Builder[]) => {
    return games.map(game => ({
      game,
      builders: builders.filter(builder => builder.game_id === game.id)
    }));
  };

  const duelAlltimeWinners = useMemo(() => mode.value === ModeType.Duel ? createPlayerStats(matchGameWithBuilders(allGames, newBuilders)).sort((a, b) => b.wins - a.wins) : [], [mode, allGames, newBuilders])

  return (
    <Tournament.Panel>
      <Tournament.Header mode={mode} page={page} setPage={setPage} />
      <Table>
        <TableHeader>
          <TableRow className="text-3xs lg: lg:text-xs sm:[&>*]:h-1 lg:[&>*]:h-10 [&>*]:text-foreground tracking-widest">
            {(mode.value === ModeType.Duel ? duelHeaders : soloHeaders).map(header => (
              <TableHead className={header.toLowerCase() === "player" ? "max-w-[100px]" : header.toLowerCase() !== "#" ? "text-end" : ""}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {mode.value !== ModeType.Duel ? allGames.map((game: Game, index: number) => (
            <SoloGameRow
              key={index}
              game={game}
              tournamentId={(page ?? 0) + mode.offset()}
              rank={index + 1}
              mode={mode}
            />
          )) :
            duelAlltimeWinners.map(({ playerId, wins, gamesPlayed, totalWinnings, totalTiles }, index) => (
              <DuelPlayerRow
                key={index}
                rank={index + 1}
                name={playerId}
                wins={wins}
                totalGames={gamesPlayed}
                wonLords={totalWinnings}
                totalTiles={totalTiles}
              />
            ))}

        </TableBody>
      </Table>
    </Tournament.Panel>
  );
};

const Panel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-grow overflow-y-auto my-4 border shadow-sm bg-white/90">
    <div className="relative flex flex-col gap-4 sm:gap-1 lg:gap-4 pt-2 lg:pt-4">
      {children}
    </div>
  </div>
)

const Header = ({ mode, page, setPage }: { mode: Mode, page: number, setPage: React.Dispatch<React.SetStateAction<number>> }) => {
  const { tournaments } = useTournaments();

  const pages = useMemo(() => {
    const currentSeason = getSeason(mode);
    const allPages = Array.from({ length: currentSeason }, (_, i) => i + 1);
    const latestPages = allPages.slice(-4); // Get only the latest 4 pages
    return latestPages;
  }, [mode]);

  const start = useMemo(() =>
    new Date((page + mode.offset()) * mode.duration() * 1000),
    [mode, page]
  );

  const end = useMemo(() =>
    new Date(((page + mode.offset() + 1) * mode.duration()) * 1000),
    [mode, page]
  );

  return mode.value !== ModeType.Duel ? (
    <>
      <div className="flex justify-center text-sm sm:text-xs lg:text-base">
        <p>{mode.value}</p>
      </div>
      <Pagination>
        <PaginationContent className="gap-1 sm:gap-2 lg:gap-4">
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          {pages.map((id: number, index: number) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={id === (page ? page : tournaments.length)}
                onClick={() => setPage(id)}
                className="size-6 text-3xs md:text-2xs lg:size-8"
              >
                {id}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="flex justify-center items-center gap-4 tracking-widest text-sm sm:text-2xs lg:text-sm">
        <div className="flex flex-col items-center">
          <p>{start.toLocaleDateString()}</p>
          <p>{start.toLocaleTimeString()}</p>
        </div>
        <img className="mx-2 w-5" src={calendarIcon} />
        <div className="flex flex-col items-center">
          <p>{end.toLocaleDateString()}</p>
          <p>{end.toLocaleTimeString()}</p>
        </div>
      </div>
      <Sponsor tournamentId={getSeason(mode)} mode={mode} />
    </>
  ) : (
    <div className="flex flex-col items-center justify-center">
      <p className="text-sm sm:text-xs lg:text-base">{mode.value}</p>
      <p className="text-muted-foreground/80 text-xs sm:text-2xs lg:text-sm">All time leaderboard</p>
    </div>
  )
}

const DuelPlayerRow = ({ rank, name, wins, totalGames, wonLords, totalTiles }: DuelPlayerRowProps) => {
  const { account: { account } } = useDojo();
  const { player } = usePlayer({ playerId: name });
  const playerRank = useMemo(() => ['🥇', '🥈', '🥉'][rank - 1] || `#${rank}`, [rank]);
  const isSelf = useMemo(() => (!!player && !!account) && (player?.id === account?.address), [player, account]);

  return (
    <TableRow
      className={`text-3xs lg:text-xs ${isSelf && "[&>*]:text-[#955142]"}`}
    >
      <TableCell>{playerRank}</TableCell>
      <TableCell className="text-left">
        {player?.getShortName()}
      </TableCell>
      <TableCell className="text-right">{wins}</TableCell>
      <TableCell className="text-right">{totalGames}</TableCell>
      <TableCell className="text-right">
        {wonLords / 1e18}
      </TableCell>
      <TableCell className="text-right">
        {totalTiles}
      </TableCell>
    </TableRow>
  );
};

const SoloGameRow = ({ game, tournamentId, rank, mode }: SoloGameRowProps) => {
  const { account: { account } } = useDojo();

  const { builders } = useBuilders({ gameId: game.id });
  const { player } = usePlayer({ playerId: builders[0]?.player_id });
  const { tournament } = useTournament({ tournamentId: tournamentId });

  const duration = useMemo(() => {
    const dt = game.end_time.getTime() - game.start_time.getTime();
    const hours = Math.floor(dt / 1000 / 60 / 60);
    const minutes = Math.floor((dt / 1000 / 60) % 60);
    const seconds = Math.floor((dt / 1000) % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [game]);

  const playerRank = useMemo(() => ['🥇', '🥈', '🥉'][rank - 1] || `#${rank}`, [rank]);
  const isSelf = useMemo(() => (!!player && !!account) && (player?.id === account?.address), [player, account]);

  return (
    <TableRow
      className={`text-3xs lg:text-xs ${isSelf && "[&>*]:text-[#955142]"}`}
    >
      <TableCell>{playerRank}</TableCell>
      <TableCell className="text-left">
        {player?.getShortName()}
      </TableCell>
      <TableCell className="text-right">{builders.reduce((sum, builder) => sum + (builder.score || 0), 0)}</TableCell>
      <TableCell className="text-right">{duration}</TableCell>
      <TableCell className="text-right">
        {game.tile_count}
      </TableCell>
      <TableCell className="text-right">
        {isSelf && tournament && tournament.isClaimable(rank, mode) ? (
          <Claim tournament={tournament} rank={rank} mode={mode} />
        ) : (
          <Spectate gameId={game.id} over />
        )}
      </TableCell>
    </TableRow>
  );
};

const createPlayerStats = (gameBuilderPairs: { game: Game, builders: Builder[] }[]) => {
  // Create a map to accumulate stats for each player
  const playerStats = new Map<string, {
    wins: number,
    gamesPlayed: number,
    totalWinnings: number,
    totalTiles: number
  }>();

  gameBuilderPairs.forEach(({ game, builders }) => {
    // Skip if no builders
    if (builders.length === 0) return;

    // Find winner (highest score)
    const winner = builders.reduce((prev, current) =>
      (current.score || 0) > (prev.score || 0) ? current : prev
    );

    // Process each builder
    builders.forEach(builder => {
      const playerId = builder.player_id;
      const currentStats = playerStats.get(playerId) || {
        wins: 0,
        gamesPlayed: 0,
        totalWinnings: 0,
        totalTiles: 0
      };

      // Update stats
      playerStats.set(playerId, {
        wins: currentStats.wins + (builder.player_id === winner.player_id ? 1 : 0),
        gamesPlayed: currentStats.gamesPlayed + 1,
        totalWinnings: currentStats.totalWinnings + Number(builder.player_id === winner.player_id ? (game.price || 0) : 0),
        totalTiles: currentStats.totalTiles + (builder.built || 0)
      });
    });
  });

  // Convert map to array
  return Array.from(playerStats.entries()).map(([playerId, stats]) => ({
    playerId,
    ...stats
  }));
};


Tournament.Header = Header;
Tournament.Panel = Panel;
