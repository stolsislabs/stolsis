import { useGameStore } from "@/store";
import { Connection } from "../Connection";
import banner from "/assets/banner.svg";
import { ReactNode, useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { cn } from "@/ui/utils";

type OverlayProps = { children: ReactNode };

export const Overlay = ({ children }: OverlayProps) => {
  const resetHoveredTile = useGameStore(state => state.resetHoveredTile);

  return (
    <div className="z-20 pointer-events-none" onMouseEnter={resetHoveredTile}>
      {children}
    </div>
  );
};

const Header = () => (
  <div className="absolute right-0 h-12 flex justify-center w-full gap-4 p-2">
    <Connection />
  </div>
);

const Banner = () => (
  <div className="absolute top-0 left-0 flex justify-center items-center w-full h-12 md:h-40 opacity-5">
    <img src={banner} alt="banner" className="w-full h-full" />
  </div>
);

const Content = ({ children }: { children: ReactNode }) => {
  const { isConnected } = useAccount();
  const [orientation, setOrientation] = useState(window.screen.orientation.type);

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.screen.orientation.type);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return (
    !isConnected && (
      <div className={cn("w-full h-full grid absolute py-4 select-none grid-cols-4 grid-rows-8 sm:grid-cols-3 sm:grid-rows-4",
        orientation === "landscape-primary"
          ? "pl-safe-left pr-8"
          : orientation === "landscape-secondary"
            ? "pr-safe-right pl-8"
            : "px-4"
      )}
      >
        {children}
      </div>
    )
  );
};

Overlay.Header = Header;
Overlay.Banner = Banner;
Overlay.Content = Content;
