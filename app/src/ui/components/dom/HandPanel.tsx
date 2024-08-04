import { IngameButton } from "./IngameButton";
import rotateIcon from "/assets/icons/rotate.svg";
import confirmIcon from "/assets/icons/confirm.svg";
import { Tile } from "../Tile";
import { useActions } from "@/hooks/useActions";
import RotationSound from "/sounds/effects/rotation.wav";
import { useGameStore } from "@/store";
import useSound from "use-sound";

export const HandPanel = () => {
    const [play] = useSound(RotationSound);
    const { enabled } = useActions();

    const { handleConfirm, disabled } = useActions();

    const { orientation, setOrientation } = useGameStore();

    const handleRotate = () => {
        play();
        setOrientation(orientation + 1);
    };

    return (
        <div className="col-start-3 row-start-4 flex flex-row justify-end gap-2 pointer-events-auto">
            <div className="flex flex-col gap-2 self-center">
                <IngameButton name="Rotate" icon={rotateIcon} side="left" onClick={handleRotate} disabled={!enabled} />
                <IngameButton name="Confirm" icon={confirmIcon} side="left" onClick={handleConfirm} disabled={disabled} />
            </div>
            <Tile />
        </div>
    );
}
