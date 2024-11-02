import { Button } from "@/ui/elements/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import viewmapIcon from "/assets/icons/viewmap.svg";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export const Spectate = ({ gameId, over = false }: { gameId: number, over?: boolean }) => {
    const navigate = useNavigate();

    const setGameQueryParam = useMemo(() => {
        return (id: string) => {
            if (!id) return;
            navigate("?id=" + id, { replace: true });
        };
    }, [navigate]);

    return (
        <Button
            size={"sm"}
            className={
                "px-3 sm:px-2 lg:px-2 flex items-center justify-center self-end size-9 hover:bg-transparent border-none"
            }
            variant={"ghost"}
            onClick={() => gameId && setGameQueryParam(gameId.toString())}
        >
            {over ? (
                <img className="size-6" src={viewmapIcon} />
            ) : (
                <FontAwesomeIcon icon={faEye} size="lg" className="w-6 h-6" />
            )}
        </Button>
    );
};