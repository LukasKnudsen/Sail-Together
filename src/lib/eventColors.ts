import type { CategorySlug } from "@/types/category";

/**
 * Maps event category slugs to Tailwind background color classes for markers
 * Colors are chosen to match the event type theme from EVENT_TYPES
 */
export function getEventMarkerColor(category: CategorySlug): string {
  const colorMap: Record<CategorySlug, string> = {
    race: "bg-blue-500", // Competitive sailing - blue
    cruise: "bg-sky-500", // Casual trips - sky blue
    meetup: "bg-amber-500", // Social gatherings - amber
    training: "bg-green-500", // Education - green
    maintenance: "bg-gray-500", // Work - gray
    party: "bg-pink-500", // Celebrations - pink
    meeting: "bg-purple-500", // Official meetings - purple
    "open-day": "bg-lime-500", // Public events - lime
    charity: "bg-indigo-500", // Fundraisers - indigo
    other: "bg-slate-500", // Default - slate
  };

  return colorMap[category] || colorMap.other;
}

