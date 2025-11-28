import HeaderWithSearch from "@/components/HeaderWithSearch";
import { Outlet } from "react-router-dom";

interface MapPageLayoutProps {
  searchType?: "auto" | "events" | "jobs";
}

export default function MapPageLayout({ searchType = "auto" }: MapPageLayoutProps) {
  return (
    <div>
      <HeaderWithSearch searchType={searchType} />
      <Outlet />
    </div>
  );
}
