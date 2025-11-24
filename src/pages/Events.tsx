import SearchEvent from "@/components/searchbar/SearchEvent";
import useSWR from "swr";
import EventSidebar from "@/components/EventSidebar";
import { getEvents } from "@/features/events/api";
import Map from "@/components/map/Map";
import { eventsToGeoJson } from "@/lib/eventsToGeoJSON";
import { useMemo, useState, useCallback } from "react";

export default function Events() {
  const { data, isLoading, error } = useSWR("events", getEvents, {
    dedupingInterval: 10 * 60 * 1000, // 10 minutes
    revalidateIfStale: true,
  });

  const [mapBounds, setMapBounds] = useState<{
    ne: [number, number];
    sw: [number, number];
  } | null>(null);

  const handleBoundsChange = useCallback(
    (bounds: { ne: [number, number]; sw: [number, number] }) => {
      setMapBounds(bounds);
    },
    []
  );

  // Filter events based on map bounds
  // Don't show events until map bounds are available to prevent flash of all events
  const filteredEvents = useMemo(() => {
    if (!data) return undefined;
    if (!mapBounds) return undefined; // Wait for map bounds before showing events

    return data.filter((event) => {
      const locationData = event.locationId as any;
      if (!locationData?.longitude || !locationData?.latitude) return false;

      const lng = locationData.longitude;
      const lat = locationData.latitude;

      // Check if point is within bounds
      return (
        lng >= mapBounds.sw[0] &&
        lng <= mapBounds.ne[0] &&
        lat >= mapBounds.sw[1] &&
        lat <= mapBounds.ne[1]
      );
    });
  }, [data, mapBounds]);

  const eventsGeoJSON = useMemo(() => {
    if (!filteredEvents) return undefined;
    return eventsToGeoJson(filteredEvents);
  }, [filteredEvents]);

  return (
    <>
      <SearchEvent />
      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
        <aside className="flex flex-col gap-4">
          {isLoading && <div>Loading...</div>}

          {error && <div>Error: {error.message}</div>}

          {!isLoading && !error && !mapBounds && <div>Loading map...</div>}

          {filteredEvents && <EventSidebar events={filteredEvents} />}
        </aside>

        <section className="sticky top-4 h-[calc(100vh-5rem)] md:col-start-2">
          <Map events={eventsGeoJSON} onBoundsChange={handleBoundsChange} />
        </section>
      </div>
    </>
  );
}
