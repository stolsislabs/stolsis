import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/ui/elements/dialog";

import { ReactNode, useState } from "react";
import { ToolTipButton } from "./ToolTipButton";
import { MusicPlayer } from "./MusicPlayer";
import { useGameStore } from "@/store";
import { Switch } from "../elements/switch";
import { Label } from "../elements/label";
import icon from "/assets/icons/VIEW.svg";

export const SettingsDialog = ({ children }: { children?: ReactNode }) => {
  const [open, setOpen] = useState(false);

  const strategyMode = useGameStore((state) => state.strategyMode);
  const setStrategyMode = useGameStore((state) => state.setStrategyMode);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children ?? (
          <ToolTipButton
            icon={<img src={icon} className="h-8 sm:h-4 md:h-8 fill-current" />}
            toolTipText="Settings"
          />
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex items-center">Settings</DialogHeader>
        <MusicPlayer />

        <div className="flex justify-between w-full">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-finished"
              checked={strategyMode}
              onCheckedChange={() => setStrategyMode(!strategyMode)}
            />
            <Label className="text-xs" htmlFor="show-finished">
              Strategy Mode (E)
            </Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
