import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faEye,
  faLock,
  faSackDollar,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { GameOverEvent, useGames } from "@/hooks/useGames";
import { useTournament } from "@/hooks/useTournament";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TOURNAMENT_DURATION,
  TOURNAMENT_ID_OFFSET,
} from "@/dojo/game/constants";
import { Lords } from "./Lords";
import { Tournament as TournamentClass } from "@/dojo/game/models/tournament";
import { useDojo } from "@/dojo/useDojo";
import { Account } from "starknet";

export const TournamentHeader = () => {
  const [tournamentId, setTournamentId] = useState<number>();
  const [timeLeft, setTimeLeft] = useState<string>();

  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    const id = Math.floor(now / TOURNAMENT_DURATION);
    const startTime = id * TOURNAMENT_DURATION;
    const endTime = startTime + TOURNAMENT_DURATION;
    setTournamentId(id - TOURNAMENT_ID_OFFSET);

    const interval = setInterval(() => {
      // Remaining time in seconds
      const dt = endTime - Math.floor(Date.now() / 1000);

      // Calculating hours, minutes, and seconds
      const days = Math.floor(dt / 86400);
      const hours = Math.floor((dt % 86400) / 3600);
      const minutes = Math.floor((dt % 3600) / 60);
      const seconds = dt % 60;

      // Formatting DD - HH:MM:SS
      const formattedTime = `
        ${days.toString().padStart(2, "0")}d ${hours
          .toString()
          .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
      setTimeLeft(formattedTime);

      if (dt < 0) {
        clearInterval(interval);
        setTimeLeft("00:00:00");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between items-center">
      <div className="text-xs">{`Season ${tournamentId} - ${timeLeft}`}</div>
    </div>
  );
};

export const TournamentDialog = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"secondary"} size={"default"}>
                <FontAwesomeIcon className="h-6" icon={faTrophy} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="select-none">Leaderboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex items-center">
          Tournament Leaderboard
        </DialogHeader>
        <Tournament />
      </DialogContent>
    </Dialog>
  );
};

export const Tournament = () => {
  const { games, ids } = useGames();
  const [page, setPage] = useState<number | undefined>();
  const [pages, setPages] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  useEffect(() => {
    if (!page) return setPage(ids.length);
    const pages = [page];
    if (page > 1) {
      pages.unshift(page - 1);
    }
    if (page < ids.length) {
      pages.push(page + 1);
    }
    if (page === 1 && ids.length > 2) {
      pages.push(page + 2);
    }
    if (page === ids.length && ids.length > 2) {
      pages.unshift(page - 2);
    }
    setPages(pages);
  }, [page, ids]);

  useEffect(() => {
    if (!page) return;
    const startTime = (page + TOURNAMENT_ID_OFFSET) * TOURNAMENT_DURATION;
    const endTime = startTime + TOURNAMENT_DURATION;
    const start = new Date(startTime * 1000);
    const end = new Date(endTime * 1000);
    setStartDate(start.toLocaleDateString());
    setStartTime(start.toLocaleTimeString());
    setEndDate(end.toLocaleDateString());
    setEndTime(end.toLocaleTimeString());
  }, [page]);

  const balckilist = useMemo(() => {
    return [""];
  }, []);

  const allGames = useMemo(() => {
    return games
      .filter(
        (game) =>
          game.tournamentId === page && !balckilist.includes(game.playerMaster),
      )
      .sort((a, b) => b.gameScore - a.gameScore)
      .slice(0, 10);
  }, [games, page, balckilist]);

  return (
    <div className="relative flex flex-col gap-4">
      <div className="flex justify-center text-xs">Seasons</div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          {pages.map((id: number, index: number) => {
            return (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={id === (page ? page : ids.length)}
                  onClick={() => setPage(id)}
                >
                  {id}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="flex justify-center items-center text-xs gap-4">
        <div className="flex flex-col items-center">
          <p>{startDate}</p>
          <p>{startTime}</p>
        </div>
        <FontAwesomeIcon className="mx-2 h-6" icon={faCalendarDays} />
        <div className="flex flex-col items-center">
          <p>{endDate}</p>
          <p>{endTime}</p>
        </div>
      </div>

      {page && <Prize tournamentId={page} />}

      <Table className="text-xs">
        <ScrollArea className="h-[570px] w-full pr-2">
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead className="max-w-[100px]">Name</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="flex justify-center items-center">
                <Lords fill={"black"} width={4} height={4} />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allGames.map((game: GameOverEvent, index: number) => {
              return (
                <GameRow
                  key={index}
                  game={game}
                  tournamentId={page ? page : 0}
                  rank={index + 1}
                />
              );
            })}
          </TableBody>
        </ScrollArea>
      </Table>
    </div>
  );
};

export const GameRow = ({
  game,
  tournamentId,
  rank,
}: {
  game: GameOverEvent;
  tournamentId: number;
  rank: number;
}) => {
  const { tournament } = useTournament({
    tournamentId: tournamentId + TOURNAMENT_ID_OFFSET,
  });

  const duration = useMemo(() => {
    const startTime = game.gameStartTime;
    const endTime = game.gameEndTime;
    const dt = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(dt / 1000 / 60 / 60);
    const minutes = Math.floor((dt / 1000 / 60) % 60);
    const seconds = Math.floor((dt / 1000) % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [game]);

  const winnings = useMemo(() => {
    if (!tournament) return Number(0).toFixed(4);
    const value = (tournament.reward(rank) / 1e18).toFixed(4);
    if (value.length > 6) {
      return value.slice(0, 6);
    }
    return value;
  }, [tournament, rank]);

  const playerName = useMemo(() => {
    // Name on 10 characters max
    return game.playerName.length > 8
      ? game.playerName.slice(0, 8) + "…"
      : game.playerName;
  }, [game]);

  const playerRank = useMemo(() => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  }, [rank]);

  return (
    <TableRow>
      <TableCell className="font-medium">{playerRank}</TableCell>
      <TableCell className="text-left">{playerName}</TableCell>
      <TableCell className="text-right">{game.gameScore}</TableCell>
      <TableCell className="text-right">{duration}</TableCell>
      <TableCell className="text-right">{rank > 3 ? "" : winnings}</TableCell>
      <TableCell className="text-right">
        {tournament && tournament.isClaimable(rank) && (
          <Claim tournament={tournament} rank={rank} />
        )}
        {(!tournament || !tournament.isClaimable(rank)) && (
          <Spectate gameId={game.gameId} />
        )}
      </TableCell>
    </TableRow>
  );
};

export const Prize = ({ tournamentId }: { tournamentId: number }) => {
  const [prize, setPrize] = useState<number>();
  const { tournament } = useTournament({
    tournamentId: tournamentId + TOURNAMENT_ID_OFFSET,
  });

  useEffect(() => {
    if (tournament) {
      setPrize(Number(tournament.prize) / 1e18);
    } else {
      setPrize(0);
    }
  }, [tournament]);

  const backgroundColor = useMemo(() => {
    return "#111827";
  }, []);

  return (
    <div
      className="flex justify-between items-center gap-4 text-white rounded-xl py-2 px-16"
      style={{ backgroundColor }}
    >
      <Lords fill={"white"} />
      <div className="flex flex-col justify-center items-center text-xl gap-1">
        <p className="text-xs">Prize Pool</p>
        <p className="text-xl">{`${prize}`}</p>
      </div>
      <Lords fill={"white"} />
    </div>
  );
};

export const Spectate = ({ gameId }: { gameId: number }) => {
  const navigate = useNavigate();

  const setGameQueryParam = useMemo(() => {
    return (id: string) => {
      if (!id) return;
      navigate("?id=" + id, { replace: true });
    };
  }, [navigate]);

  return (
    <Button
      disabled={!gameId}
      variant={"secondary"}
      size={"icon"}
      onClick={() => {
        if (!gameId) return;
        return setGameQueryParam(`${gameId}`);
      }}
    >
      <FontAwesomeIcon icon={gameId ? faEye : faLock} />
    </Button>
  );
};

export const Claim = ({
  tournament,
  rank,
}: {
  tournament: TournamentClass;
  rank: number;
}) => {
  const {
    account: { account },
    setup: {
      systemCalls: { claim_tournament },
    },
  } = useDojo();

  const disabled = useMemo(() => {
    if (!tournament) return true;
    return !tournament.isOver() || tournament.isClaimed(rank);
  }, [tournament]);

  const handleClick = useCallback(() => {
    if (account) {
      claim_tournament({
        account: account as Account,
        tournament_id: tournament.id,
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
