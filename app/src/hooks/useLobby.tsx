import { Mode, ModeType } from "@/dojo/game/types/mode";
import { useLobbyStore } from "@/store";
import { useMemo } from "react";
import { useShallow } from 'zustand/react/shallow'

export const useLobby = () => {
  const { mode, setMode: setStoreMode, games, setGames } = useLobbyStore(
    useShallow((state) => ({
      mode: state.mode,
      setMode: state.setMode,
      games: state.games,
      setGames: state.setGames,
    }))
  );

  const gameMode: Mode = useMemo(() => {
    if (mode === ModeType.Weekly) {
      return new Mode(ModeType.Weekly);
    } else if (mode === ModeType.Daily) {
      return new Mode(ModeType.Daily);
    } else if (mode === ModeType.Tutorial) {
      return new Mode(ModeType.Tutorial);
    } else if (mode === ModeType.Duel) {
      return new Mode(ModeType.Duel);
    } else {
      return new Mode(ModeType.None);
    }
  }, [mode]);

  const setMode = (modeStr: string): Mode => {
    const modeType = modeStr as ModeType;
    if (Object.values(ModeType).includes(modeType)) {
      const newMode = new Mode(modeType);
      setStoreMode(modeType);
      return newMode;
    }
    // Default to None if the string doesn't match any ModeType
    return new Mode(ModeType.None);
  };

  return {
    gameMode,
    setMode,
    games,
    setGames,
  };
};
