import avatar from "@/assets/avatar.png";
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
import { Briefcase, CircleUserRound, Heart, Map, Menu, Settings } from "lucide-react";
import AddJob from "./modals/AddJob";

export default function HeaderAuth() {
  const [user, setUser] = useState<Parse.User | null>(null);
  const [addJobOpen, setAddJobOpen] = useState(false);
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
    <div className="ml-auto flex items-center gap-3">
      {user ? (
        <>
          <NavLink to={"/add-listing"} className="hidden md:block">
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
              <Button aria-label="Open menu" variant="outline" size="icon" className="select-none">
                <Menu strokeWidth={3} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-2 w-60 rounded-xl py-2 font-medium">
              <DropdownMenuItem>
                <Heart strokeWidth={2} />
                Favourites
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAddJobOpen(true)} >
                <Briefcase strokeWidth={2} />
                Add Job
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
          <AddJob open={addJobOpen} onOpenChange={setAddJobOpen} hideTrigger />
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
  );
}
