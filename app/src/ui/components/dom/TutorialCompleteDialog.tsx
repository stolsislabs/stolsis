import { getColor } from "@/dojo/game";
import { ModeType } from "@/dojo/game/types/mode";
import { useDojo } from "@/dojo/useDojo";
import { useBuilders } from "@/hooks/useBuilders";
import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useTutorial } from "@/hooks/useTutorial";
import { useUIStore } from "@/store";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/ui/elements/alert-dialog";
import { Button } from "@/ui/elements/button";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/ui/elements/table";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Game as GameClass } from "@/dojo/game/models/game";
import { TwitterShareButton } from "react-share";

export const GameCompletedDialog = () => {
  const { gameId } = useQueryParams();
  const { game } = useGame({ gameId });

  return game?.mode.value === ModeType.Tutorial ? (
    <TutorialDialog />
  )
    : (
      <RegularDialog />
    )

}

const TutorialDialog = () => {
  const { step, maxSteps } = useTutorial();

  const navigate = useNavigate();

  const handleClick = () => navigate("/", { replace: true });

  return (
    <AlertDialog open={step === maxSteps}>
      <AlertDialogContent className="bg-primary">
        <AlertDialogHeader>
          <AlertDialogTitle>Tutorial Complete!</AlertDialogTitle>
          <AlertDialogDescription>
            Congratulations on completing the Paved tutorial!
            <br />
            You are now ready to play a full game of Paved!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClick} className="bg-secondary">
            Return to Lobby
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const RegularDialog = () => {
  const { gameId } = useQueryParams();
  const {
    account: { account },
  } = useDojo();
  const { game } = useGame({ gameId });
  const { builders } = useBuilders({ gameId });
  const [open, setOpen] = useState(true);

  const isSelf = useMemo(() => account?.address === (builders.length > 0 ? builders[0].player_id : "0x0"), [account, builders, game]);

  if (!game || !builders || !builders.length) return null;

  return (
    <AlertDialog open={open && game.isOver() && isSelf} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-primary">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl">Leaderboard</AlertDialogTitle>
        </AlertDialogHeader>
        <Description game={game} />
        <Leaderboard game={game} builders={builders} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const Description = ({ game }: { game: GameClass }) => {
  const takeScreenshot = useUIStore((state) => state.takeScreenshot);
  const [screenshotMessage, setScreenshotMessage] = useState("");

  const handleScreenshot = () => {
    takeScreenshot?.();
    setScreenshotMessage("Shot taken!");
    setTimeout(() => setScreenshotMessage(""), 5000);
  };

  return (
    <AlertDialogDescription className="flex justify-center items-center gap-3 text-xs flex-wrap">
      <div className="w-full text-center text-3xl">PUZZLE COMPLETE!</div>
      <div className="w-full text-center">
        Well paved, adventurer ⚒️ <br />
        Care to flex your score on X? <br /> Tip: paste your screenshot into the
        post for maximum impact.
      </div>

      <Button
        variant={"default"}
        size={"icon"}
        className="flex gap-2 w-auto p-2 text-xs"
        onClick={handleScreenshot}
      >
        {screenshotMessage ? screenshotMessage : "Take Screenshot!"}
      </Button>

      <Share score={game.score} />
    </AlertDialogDescription>
  );
};

export const Share = ({ score }: { score: number }) => {
  return (
    <TwitterShareButton
      url="https://sepolia.paved.gg/"
      title={`I just conquered today’s @pavedgame puzzle 🧩

Score: ${score}

Think you can do better? Join the fun at https://sepolia.paved.gg/ and #paveyourwaytovictory in an onchain strategy game like no other ⚒️ 

Play now 👇
`}
    >
      <Button
        className="flex gap-2 w-auto p-2 text-xs"
        variant={"default"}
        size={"icon"}
      >
        <FontAwesomeIcon icon={faXTwitter} />
        <p>Share</p>
      </Button>
    </TwitterShareButton>
  );
};

export const Leaderboard = ({
  game,
  builders,
}: {
  game: any;
  builders: any[];
}) => {
  return (
    <Table className="text-xs">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead className="w-[100px]">Score</TableHead>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <PlayerRow rank={1} score={game?.score || 0} builder={builders[0]} />
      </TableBody>
    </Table>
  );
};

export const PlayerRow = ({
  rank,
  score,
  builder,
}: {
  rank: number;
  score: number;
  builder: any;
}) => {
  const { player } = usePlayer({ playerId: builder.player_id });
  const name = player?.name || "";
  const backgroundColor = useMemo(
    () => getColor(`0x${builder.player_id.toString(16)}`),
    [builder],
  );

  return (
    <TableRow>
      <TableCell className="">{rank}</TableCell>
      <TableCell>{score}</TableCell>
      <TableCell className="flex gap-2 text-ellipsis">
        <div className="rounded-full w-4 h-4" style={{ backgroundColor }} />
        {name}
      </TableCell>
    </TableRow>
  );
};
