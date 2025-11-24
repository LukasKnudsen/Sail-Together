import avatar from "@/assets/avatar.png";
import { cn } from "@/lib/utils";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getCurrentUser, logOut } from "@/lib/parse/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound, Heart, Map, Menu, Settings } from "lucide-react";

interface Navbar {
  to: string;
  label: string;
  end?: boolean;
}

const NAVIGATION: Navbar[] = [
  { to: "/", label: "Home", end: true },
  { to: "/events", label: "Events" },
  { to: "/explore", label: "Explore" },
];

export default function Header() {
  const [user, setUser] = useState<Parse.User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u ? (u as unknown as Parse.User) : null);
  }, []);

  async function handleSignOut() {
    await logOut();
    setUser(null);
    navigate("/login");
  }

  return (
    <header className="bg-card border-border sticky top-0 z-50 w-full py-2">
      <div className="flex flex-row items-center">
        {/* LOGO */}
        <h1 className="text-2xl font-extrabold text-nowrap text-blue-500 select-none">Open Sail</h1>

        <nav aria-label="Primary" className="absolute left-1/2 -translate-x-1/2">
          <ul className="flex list-none gap-0.5">
            {NAVIGATION.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={!!end}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex h-9 items-center rounded-lg px-4 py-2 font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive && "hover:bg-background text-blue-500 hover:text-blue-500"
                    )
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <NavLink to={"/add-listing"}>
                <Button variant={"secondary"}>Add Listing</Button>
              </NavLink>

              <NavLink to={"/profile"}>
                <Avatar className="size-9 select-none">
                  <AvatarImage src={avatar} alt="profile avatar" />
                  <AvatarFallback>CL</AvatarFallback>
                </Avatar>
              </NavLink>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="Open menu"
                    variant="outline"
                    size="icon"
                    className="select-none"
                  >
                    <Menu strokeWidth={3} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-2 w-60 rounded-xl py-2 font-medium">
                  <DropdownMenuItem>
                    <Heart strokeWidth={2} />
                    Favourites
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Map strokeWidth={2} />
                    Trips
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <CircleUserRound strokeWidth={2} /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="mx-3" />
                  <DropdownMenuItem>
                    <Settings strokeWidth={2} /> Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="mx-3" />
                  <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <NavLink to="/login">
                <Button variant={"ghost"}>Log in</Button>
              </NavLink>
              <NavLink to="/signup">
                <Button variant={"secondary"}>Sign up</Button>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
