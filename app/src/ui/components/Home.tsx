import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"command"}
            size={"command"}
            onClick={() => navigate("", { replace: true })}
          >
            <FontAwesomeIcon className="h-12" icon={faHome} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="select-none">Home page</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
