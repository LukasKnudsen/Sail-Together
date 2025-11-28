import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import HeaderAuth from "@/components/HeaderAuth";
import { Button } from "./ui/button";

interface Navbar {
  to: string;
  label: string;
  end?: boolean;
}

export const NAVIGATION: Navbar[] = [
  { to: "/", label: "Home", end: true },
  { to: "/events", label: "Events" },
  { to: "/explore", label: "Explore" },
];

export default function Header() {
  return (
    <header className="bg-card border-border sticky top-0 z-50 w-full py-2">
      <div className="flex flex-row items-center">
        {/* LOGO */}
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
      </div>
    </header>
  );
}
