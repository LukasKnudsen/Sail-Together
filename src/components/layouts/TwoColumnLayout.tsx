import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TwoColumnLayoutProps {
  sidebar: ReactNode;
  map: ReactNode;
  footer?: ReactNode;
  sidebarClassName?: string;
  mapClassName?: string;
  containerClassName?: string;
  footerClassName?: string;
  stickyOffset?: string;
}

export default function TwoColumnLayout({
  sidebar,
  map,
  footer,
  sidebarClassName,
  mapClassName,
  containerClassName,
  footerClassName,
  stickyOffset = "120px",
}: TwoColumnLayoutProps) {
  return (
    <>
      <div
        className={cn(
          "relative container mx-auto grid grid-cols-1 gap-4 py-4 md:grid-cols-2",
          containerClassName
        )}
      >
        {/* LEFT SIDEBAR */}
        <div className={sidebarClassName}>{sidebar}</div>

        {/* RIGHT MAP */}
        <aside
          className={cn(
            "sticky bottom-4 hidden h-[calc(100dvh-96px-2rem-8px)] self-start md:block",
            mapClassName
          )}
          style={{ top: stickyOffset }}
        >
          {map}
        </aside>
      </div>

      {/* FOOTER */}
      {footer && <footer className={cn("container mx-auto", footerClassName)}>{footer}</footer>}
    </>
  );
}
