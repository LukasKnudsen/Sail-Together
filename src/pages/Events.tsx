import useSWR from "swr";
import { getEvents } from "@/features/events/api";
import TwoColumnLayout from "@/components/layouts/TwoColumnLayout";
import EventGrid from "@/components/EventGrid";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";

export default function Events() {
  const { data, isLoading, error } = useSWR("events", getEvents, {
    dedupingInterval: 10 * 60 * 1000, // 10 minutes
    revalidateIfStale: true,
  });

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
                data.map((event) => <EventCard key={event.id} event={event} />)
              ) : (
                <div className="text-muted-foreground">No events found</div>
              )}
            </EventGrid>
          }
          map={<div className="bg-muted size-full rounded-3xl" />}
        />
      </main>
    </>
  );
}
