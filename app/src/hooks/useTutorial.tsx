import { useQueryParams } from "./useQueryParams";
import { useMemo } from "react";
import { TUTORIAL_STAGES } from "@/dojo/game/types/tutorial-stage";
import { useBuilder } from "./useBuilder";
import { useDojo } from "@/dojo/useDojo";

export const useTutorial = () => {
  const { gameId } = useQueryParams();
  const {
    account: { account },
  } = useDojo();

  const { builder } = useBuilder({ gameId, playerId: account?.address });

  const step = useMemo(
    () => (builder?.built ?? 0) + (builder?.discarded ?? 0),
    [builder?.built, builder?.discarded],
  );
  const maxSteps = 9;

  const currentTutorialStage = useMemo(() => TUTORIAL_STAGES[step], [step]);

  return {
    currentTutorialStage,
    step,
    maxSteps,
  };
};
