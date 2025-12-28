import type { DateRange } from "node_modules/react-day-picker/dist/esm/types/shared";
import { create } from "zustand";

export interface JobSearchFilters {
  name: string | null;
  position: string | null;
  availability?: DateRange | undefined;
}

interface JobState {
  // Stores the id of the job that is currently being hovered over in sidebar
  hoveredJobId: string | null;
  setHoveredJobId: (id: string | null) => void;
  // Search filters
  searchFilters: JobSearchFilters;
  setSearchFilters: (filters: JobSearchFilters) => void;
  clearSearchFilters: () => void;
}

export const useJobStore = create<JobState>((set) => ({
  hoveredJobId: null,
  setHoveredJobId: (id) => set({ hoveredJobId: id }),
  searchFilters: { name: null, position: null, availability: undefined },
  setSearchFilters: (filters) => set({ searchFilters: filters }),
  clearSearchFilters: () =>
    set({ searchFilters: { name: null, position: null, availability: undefined } }),
}));
