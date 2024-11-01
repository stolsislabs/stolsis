import { useCameraStore } from "../../store";
import { useState } from "react";
import { useEffect } from "react";
import icon from "/assets/icons/compass.svg";
import { IngameButton } from "./dom/IngameButton";

// TODO: Remove redundant component (move correct functionality to camera instead, custom hook called from NavigationMenu instead etc.)
export const Compass = () => {
  const { compassRotation, setCompassRotate } = useCameraStore();
  const [rotation, setRotation] = useState(0);
  const [rotate, setRotate] = useState(false);

  useEffect(() => {
    if (!rotate) return;
    const rad = (compassRotation + Math.PI / 4) % (Math.PI * 2);
    setCompassRotate(rad);
    setRotate(false);
  }, [rotate]);

  useEffect(() => {
    const deg = -Math.floor((compassRotation * 180) / Math.PI);
    setRotation(deg);
  }, [compassRotation]);

  return (
    <IngameButton
      icon={{
        path: icon,
        style: { transform: `rotate(${rotation}deg)` }
      }}
      name="Rotate View"
      onClick={() => setRotate(true)}
    />
  );
};