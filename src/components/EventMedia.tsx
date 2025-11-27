import { Heart } from "lucide-react";
import { Media, MediaFallback } from "./ui/media";
import { cn } from "@/lib/utils";

interface EventMediaProps {
  isFavorite: boolean;
  priceKind: string;
  className?: string;
  onFavoriteClick?: (e: React.MouseEvent) => void;
}

export default function EventMedia({
  isFavorite,
  priceKind,
  className,
  onFavoriteClick,
}: EventMediaProps) {
  return (
    <Media className={cn("aspect-square w-full rounded-3xl", className)}>
      <Heart
        name="heart"
        onClick={onFavoriteClick}
        className={cn(
          "absolute top-3 right-3 size-8 cursor-pointer",
          isFavorite
            ? "fill-heart-red text-heart-red"
            : "fill-neutral-500 stroke-white text-neutral-500"
        )}
      />
      {priceKind === "free" && (
        <div className="absolute right-3 bottom-3 rounded-full bg-green-500 px-3 py-1">
          <p className="text-sm font-medium text-white">Free</p>
        </div>
      )}
      <MediaFallback className="bg-neutral-300" />
    </Media>
  );
}
