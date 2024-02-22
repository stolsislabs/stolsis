import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";

import { useDojo } from "@/dojo/useDojo";
import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import { Entity, Has, HasValue, NotValue } from "@dojoengine/recs";
import { useNavigate } from "react-router-dom";

import { CreateGame } from "@/ui/components/CreateGame";
import { shortString } from "starknet";

export const Games = () => {
  const {
    setup: {
      clientComponents: { Game },
    },
  } = useDojo();

  const games = useEntityQuery([Has(Game)]);

  const backgroundColor = useMemo(() => "#FCF7E7", []);

  return (
    <div className="bg-yellow-100 h-screen grow" style={{ backgroundColor }}>
      <div className="flex flex-col gap-8 items-start w-full p-10">
        <h1>Game lobby</h1>
        <CreateGame />

        <h4>Games</h4>
        <Table>
          <TableHeader>
            <TableRow className="text-sm">
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Current players</TableHead>
              <TableHead>Endtime</TableHead>
              <TableHead>Time left</TableHead>
              <TableHead>Tiles played</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map((game, index) => {
              return <GameRow key={index} entity={game} />;
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export const GameRow = ({ entity }: { entity: Entity }) => {
  const [gameId, setGameId] = useState<number>();
  const [gameName, setGameName] = useState<string>();
  const [playerCount, setPlayerCount] = useState<number>();
  const [endtime, setEndtime] = useState<Date>();
  const [timeLeft, setTimeLeft] = useState<string>();
  const [tilesPlayed, setTilesPlayed] = useState<number>();
  const [display, setDisplay] = useState<boolean>(true);
  const {
    setup: {
      clientComponents: { Game, Builder },
    },
  } = useDojo();

  const game = useComponentValue(Game, entity);
  const builders = useEntityQuery([
    Has(Builder),
    HasValue(Builder, { game_id: game?.id }),
    NotValue(Builder, { order: 0 }),
  ]);

  useEffect(() => {
    if (game) {
      if (game.endtime < Math.floor(Date.now() / 1000)) {
        setDisplay(false);
      } else {
        setGameId(game.id);
        setGameName(shortString.decodeShortString(game.name));
        setEndtime(new Date(game.endtime * 1000));
        setTilesPlayed(game.tile_count);
      }
    }
    setPlayerCount(builders?.length || 0);
  }, [game, builders]);

  // Calculating time left
  useEffect(() => {
    if (endtime) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const difference = endtime.getTime() - now;

        // Calculating hours, minutes, and seconds
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Formatting HH:MM:SS
        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        setTimeLeft(formattedTime);

        if (difference < 0) {
          clearInterval(interval);
          setTimeLeft("00:00:00");
          setDisplay(false);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [endtime]);

  const navigate = useNavigate();

  const setGameQueryParam = useMemo(() => {
    return (id: string) => {
      navigate("?game=" + id, { replace: true });
    };
  }, [navigate]);

  if (!game || !display) return null;

  return (
    <TableRow className="text-xs">
      <TableCell>{gameId}</TableCell>
      <TableCell>{gameName}</TableCell>
      <TableCell>{playerCount}</TableCell>
      <TableCell>{endtime?.toLocaleString()}</TableCell>
      <TableCell>{timeLeft}</TableCell>
      <TableCell>{tilesPlayed}</TableCell>

      <TableCell>
        <Button
          className={`align-right}`}
          onClick={() => setGameQueryParam(game.id || 0)}
        >
          <FontAwesomeIcon icon={faRightToBracket} />
        </Button>
      </TableCell>
    </TableRow>
  );
};
