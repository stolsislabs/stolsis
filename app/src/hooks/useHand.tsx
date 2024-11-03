import { useGameStore } from "@/store";
import RotationSound from "/sounds/effects/rotation.wav";
import useSound from "use-sound";
import { useShallow } from 'zustand/react/shallow'

export const useHand = () => {
  const [play] = useSound(RotationSound);

  const { orientation, setOrientation, strategyMode, setStrategyMode } =
    useGameStore(
      useShallow((state) => ({
        orientation: state.orientation,
        setOrientation: state.setOrientation,
        strategyMode: state.strategyMode,
        setStrategyMode: state.setStrategyMode,
      }))
    );

  const rotateHand = () => {
    play();
    setOrientation(orientation + 1);
  };
  const counterRotateHand = () => {
    play();
    setOrientation(orientation - 1);
  };
  const toggleStrategyMode = () => {
    setStrategyMode(!strategyMode);
  };

  return { rotateHand, counterRotateHand, toggleStrategyMode };
};
