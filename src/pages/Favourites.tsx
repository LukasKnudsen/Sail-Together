import useSWR from "swr";
import { getFavoriteEvents } from "@/features/events/api";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import { useToggleEventFavorite } from "@/features/events/useToggleEventFavorite";

export default function Favourites() {
  const { data, isLoading, error } = useSWR("favorite-events", getFavoriteEvents, {
    dedupingInterval: 10 * 60 * 1000, // 10 minutes
    revalidateIfStale: true,
  });

  const toggleFavorite = useToggleEventFavorite("favorite-events");

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Favourite Events</h1>
        <p className="text-muted-foreground mt-2">
          {data && data.length > 0
            ? `You have ${data.length} favourite event${data.length === 1 ? "" : "s"}`
            : "No favourite events yet"}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => <EventCardSkeleton key={i} />)
        ) : error ? (
          <div className="text-destructive">Error loading favourite events: {error.message}</div>
        ) : data && data.length > 0 ? (
          data.map((event) => (
            <EventCard key={event.id} event={event} onToggleFavorite={toggleFavorite} />
          ))
        ) : (
          <div className="text-muted-foreground col-span-full py-12 text-center">
            <p className="text-lg">No favourite events yet</p>
            <p className="mt-2 text-sm">Start favouriting events to see them here!</p>
          </div>
        )}
      </div>
    </main>
  );
}
