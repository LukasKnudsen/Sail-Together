import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

export default function RootLayout() {
  return (
    <div className="relative container mx-auto flex min-h-dvh flex-col gap-4 overscroll-contain p-2 md:px-0">
      <Header />
      <main className="flex flex-1 flex-col gap-4">
        <Outlet />
      </main>
    </div>
  );
}
