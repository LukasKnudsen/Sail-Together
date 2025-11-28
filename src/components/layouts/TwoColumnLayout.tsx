import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TwoColumnLayoutProps {
  sidebar: ReactNode;
  map: ReactNode;
  sidebarClassName?: string;
  mapClassName?: string;
  containerClassName?: string;
  stickyOffset?: string;
}

export default function TwoColumnLayout({
  sidebar,
  map,
  sidebarClassName,
  mapClassName,
  containerClassName,
  stickyOffset = "120px",
}: TwoColumnLayoutProps) {
  return (
    <>
      <div
        className={cn(
          "relative container mx-auto grid grid-cols-1 gap-4 overscroll-contain py-4 md:grid-cols-2",
          containerClassName
        )}
      >
        {/* LEFT SIDEBAR */}
        <div className={sidebarClassName}>{sidebar}</div>

        {/* RIGHT MAP */}
        <aside
          className={cn(
            "sticky hidden h-[calc(100dvh-96px-2rem-8px)] self-start md:block",
            mapClassName
          )}
          style={{ top: stickyOffset }}
        >
          {map}
        </aside>
      </div>
    </>
  );
}
