import { useCameraStore } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBinoculars } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ResetCamera = () => {
  const { setReset } = useCameraStore();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"command"}
            size={"command"}
            onClick={() => setReset(true)}
          >
            <FontAwesomeIcon className="h-12" icon={faBinoculars} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="select-none">Reset view</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
