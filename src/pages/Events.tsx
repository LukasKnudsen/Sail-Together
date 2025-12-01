import useSWR from "swr";
import { getEvents } from "@/features/events/api";
import TwoColumnLayout from "@/components/layouts/TwoColumnLayout";
import EventGrid from "@/components/EventGrid";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useMemo } from "react";
import Map from "@/components/map/Map";
import { eventsToGeoJson } from "@/lib/eventsToGeoJSON";
import { useToggleEventFavorite } from "@/features/events/useToggleEventFavorite";

export default function Events() {
  const searchFilters = useEventStore((state) => state.searchFilters);
  const clearSearchFilters = useEventStore((state) => state.clearSearchFilters);
  
  useEffect(() => {
    return () => {
      clearSearchFilters(); 
    };
  }, [clearSearchFilters]);
  
  // Create a stable key that includes search filters for SWR caching
  const hasActiveFilters = 
    searchFilters.where || 
    searchFilters.eventType || 
    searchFilters.when?.from;
  
  const searchKey = hasActiveFilters
    ? [
        "events",
        searchFilters.where || "",
        searchFilters.eventType || "",
        searchFilters.when?.from?.toISOString() || "",
        searchFilters.when?.to?.toISOString() || "",
      ]
    : "events";

  const { data, isLoading, error } = useSWR(searchKey, () => getEvents(searchFilters), {
    dedupingInterval: 10 * 60 * 1000, // 10 minutes
    revalidateIfStale: true,
  });

  const toggleFavorite = useToggleEventFavorite(
    typeof searchKey === "string" ? searchKey : Array.isArray(searchKey) ? searchKey.join("-") : null
  );

  // Convert events to GeoJSON for the map
  const eventsGeoJSON = useMemo(() => {
    if (!data || data.length === 0) return undefined;
    return eventsToGeoJson(data);
  }, [data]);

  return (
    <>
      <main>
        <TwoColumnLayout
          sidebar={
            <EventGrid title="events within map area" count={data?.length} isLoading={isLoading}>
              {isLoading ? (
                Array.from({ length: 9 }).map((_, i) => <EventCardSkeleton key={i} />)
              ) : error ? (
                <div className="text-destructive">Error loading events: {error.message}</div>
              ) : data && data.length > 0 ? (
                data.map((event) => (
                  <EventCard key={event.id} event={event} onToggleFavorite={toggleFavorite} />
                ))
              ) : (
                <div className="text-muted-foreground">No events found</div>
              )}
            </EventGrid>
          }
          map={
            <div className="size-full rounded-3xl overflow-hidden">
              <Map events={eventsGeoJSON} />
            </div>
          }
        />
      </main>
    </>
  );
}
