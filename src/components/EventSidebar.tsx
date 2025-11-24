import { useEventStore } from "@/store/useEventStore";
import EventCard from "./EventCard";
import type { EventAttributes } from "@/db/types";

interface EventSidebarProps {
  events: EventAttributes[];
}

export default function EventSidebar({ events }: EventSidebarProps) {
  const { setHoveredEventId } = useEventStore();

  if (events.length === 0) {
    return (
      <>
        <h2 className="font-medium">0 events within map area</h2>
        <p className="text-muted-foreground text-sm">No events found. Create one to get started!</p>
      </>
    );
  }

  return (
    <>
      <h2 className="font-medium">{events.length} events within map area</h2>
      <div className="grid grid-cols-3 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onMouseEnter={() => setHoveredEventId(event.id)}
            onMouseLeave={() => setHoveredEventId(null)}
          />
        ))}
      </div>
    </>
  );
}
