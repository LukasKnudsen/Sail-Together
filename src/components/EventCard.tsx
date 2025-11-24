import { cn } from "@/lib/utils";
import { Media, MediaFallback } from "./ui/media";
import { format } from "date-fns";
import { Heart } from "lucide-react";
import type { EventAttributes } from "@/db/types";

function formatEventDate(date: Date | string | undefined): string {
  if (!date) return "Date TBD";

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }
    return `${format(dateObj, "hh:mm a")} ${format(dateObj, "do MMM yyyy")}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date TBD";
  }
}

export default function EventCard({
  event,
  className,
  ...props
}: React.ComponentProps<"div"> & { event: EventAttributes }) {
  return (
    <div aria-label="event-card" className={cn("flex w-full flex-col gap-2", className)} {...props}>
      <Media className="aspect-square w-full rounded-3xl">
        {event.isFavorite ? (
          <Heart
            name="heart"
            className="fill-heart-red text-heart-red absolute top-3 right-3 size-8"
          />
        ) : (
          <Heart
            name="heart-fill"
            className="stroke absolute top-3 right-3 size-8 fill-neutral-500 stroke-white text-neutral-500"
          />
        )}

        {event.priceKind === "free" && (
          <div className="absolute right-3 bottom-3 rounded-full bg-green-500 px-3 py-1">
            <p className="text-sm font-medium text-white">Free</p>
          </div>
        )}
        <MediaFallback className="bg-neutral-300" />
      </Media>

      <div className="flex w-full flex-col">
        <h3 className="font-semibold">{event.title}</h3>

        <div className="text-muted-foreground flex gap-2 text-sm">
          <p>{formatEventDate(event.startDate)}</p>
        </div>
        <p className="text-muted-foreground text-sm">{event.locationId.name}</p>
      </div>
    </div>
  );
}
