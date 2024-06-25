import { useMusicPlayer } from "@/hooks/useMusic";
import { Play, Pause, Forward } from "lucide-react";
import { Button } from "@/ui/elements/button";
import { Slider } from "@/ui/elements/slider";

export const MusicPlayer = () => {
  const { isPlaying, volume, setIsPlaying, setVolume } = useMusicPlayer();

  return (
    <>
      <div className="flex space-x-3 rounded-md p-2  z-1  ">
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          className="self-center rounded-full"
          size={"sm"}
        >
          {isPlaying ? (
            <Pause className="fill-transparent w-4" />
          ) : (
            <Play className="fill-transparent  w-4" />
          )}
        </Button>

        <Slider
          className="w-12"
          onValueChange={(value) => setVolume(value[0])}
          defaultValue={[volume]}
          max={1}
          step={0.1}
        />
      </div>
    </>
  );
};
