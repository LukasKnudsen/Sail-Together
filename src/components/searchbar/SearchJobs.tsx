import SearchBar from "./SearchBar";
import { searchJobsConfig } from "./configs/searchJobsConfig";

// Re-export types for backwards compatibility
export type { Filters } from "./configs/searchJobsConfig";

export default function SearchJobs() {
  return <SearchBar config={searchJobsConfig} />;
}
