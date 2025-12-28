import { create } from "zustand";
import type { CategorySlug } from "@/types/category";
import type { DateRange } from "react-day-picker";

export interface EventSearchFilters {
  where: string | null;
  whereCoordinates?: { longitude: number; latitude: number } | null;
  eventType: CategorySlug | null;
  when: DateRange | undefined;
}

interface EventState {
  // Stores the id of the event that is currently being hovered over in sidebar
  hoveredEventId: string | null;
  setHoveredEventId: (id: string | null) => void;
  // Search filters
  searchFilters: EventSearchFilters;
  setSearchFilters: (filters: EventSearchFilters) => void;
  clearSearchFilters: () => void;
}

const defaultSearchFilters: EventSearchFilters = {
  where: null,
  eventType: null,
  when: undefined,
};

export const useEventStore = create<EventState>((set) => ({
  hoveredEventId: null,
  setHoveredEventId: (id: string | null) => set({ hoveredEventId: id }),
  searchFilters: defaultSearchFilters,
  setSearchFilters: (filters: EventSearchFilters) => set({ searchFilters: filters }),
  clearSearchFilters: () => set({ searchFilters: defaultSearchFilters }),
}));
