import { Heart } from "lucide-react";
import { Media, MediaFallback } from "./ui/media";
import { cn } from "@/lib/utils";

interface JobMediaProps {
    isFavorite?: boolean;
    className?: string;
    onFavoriteClick?: (e: React.MouseEvent) => void;
}

export default function JobMedia({
    isFavorite = false,
    className,
    onFavoriteClick,
}: JobMediaProps) {
    return (
        <Media className={cn("aspect-square w-full rounded-3xl", className)}>
            <Heart
                name="heart"
                onClick={onFavoriteClick}
                className={cn(
                    "absolute top-2.5 right-2.5 cursor-pointer transition",
                    isFavorite ? "fill-red-500 text-red-500" : "fill-neutral-400 text-neutral-400"
                )}
            />
            <MediaFallback className="bg-neutral-300" />
        </Media>
    );
}