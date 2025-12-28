import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="relative container mx-auto flex min-h-dvh flex-col p-2 md:px-0">
      <main className="flex w-full flex-1 flex-col items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}
