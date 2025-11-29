import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { EventAttributes } from "@/db/types";
import CardMedia from "./CardMedia";

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
    <div
      aria-label="event-card"
      className={cn("flex aspect-square w-full flex-col gap-2", className)}
      {...props}
    >
      <CardMedia isFavorite={event.isFavorite ?? false} priceKind={event.priceKind} />

      <div className="flex w-full flex-col gap-1 px-1">
        <h3 className="leading-tight font-semibold">{event.title}</h3>
        <p className="text-muted-foreground truncate text-sm leading-none">
          {formatEventDate(event.startDate)}
        </p>
        <p className="text-muted-foreground truncate text-sm leading-none">
          {event.locationId.name}
        </p>
      </div>
    </div>
  );
}
