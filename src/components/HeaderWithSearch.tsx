import { NAVIGATION } from "@/components/Header";
import HeaderAuth from "@/components/HeaderAuth";
import SearchEvent from "@/components/searchbar/SearchEvent";
import SearchJobs from "@/components/searchbar/SearchJobs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavLink, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface HeaderWithSearchProps {
  className?: string;
  searchType?: "auto" | "events" | "jobs";
}

export default function HeaderWithSearch({
  className,
  searchType = "auto",
}: HeaderWithSearchProps) {
  const location = useLocation();

  const getSearchComponent = (): ReactNode => {
    if (searchType === "events") return <SearchEvent />;
    if (searchType === "jobs") return <SearchJobs />;

    // Auto-detect based on route
    if (location.pathname.startsWith("/events") || location.pathname === "/test") {
      return <SearchEvent />;
    }
    return <SearchJobs />;
  };

  return (
    <div
      className={cn(
        "bg-background/90 sticky top-0 z-30 flex w-full flex-col gap-2 px-2 py-2 backdrop-blur-sm md:px-0",
        className
      )}
    >
      <header className="container mx-auto flex h-12 w-full flex-row items-center">
        <h1 className="text-2xl font-extrabold text-nowrap text-blue-500 select-none">Open Sail</h1>

        <nav className="absolute left-1/2 flex -translate-x-1/2 gap-0.5">
          {NAVIGATION.map(({ to, label, end }) => {
            const isActive = end ? location.pathname === to : location.pathname.startsWith(to);

            return (
              <Button
                key={to}
                variant={"ghost"}
                asChild
                className={cn("text-base", isActive && "text-blue-500 hover:text-blue-500")}
              >
                <NavLink to={to}>{label}</NavLink>
              </Button>
            );
          })}
        </nav>

        <HeaderAuth />
      </header>
      <div className="h-12 w-full">{getSearchComponent()}</div>
    </div>
  );
}
