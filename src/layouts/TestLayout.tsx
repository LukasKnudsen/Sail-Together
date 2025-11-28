import { Outlet } from "react-router-dom";

export default function TestLayout() {
  return (
    <div className="overscroll-contain">
      <Outlet />
    </div>
  );
}
