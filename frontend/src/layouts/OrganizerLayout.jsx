import Sidebar from "../components/organiser/Sidebar";
import { Outlet } from "react-router-dom";

const OrganizerLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default OrganizerLayout;
