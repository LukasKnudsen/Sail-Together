import SearchBar from "./SearchBar";
import { searchJobsConfig } from "./config/searchJobsConfig";

// Re-export types for backwards compatibility
export type { Filters } from "./config/searchJobsConfig";

export default function SearchJobs() {
  return <SearchBar config={searchJobsConfig} />;
}
