import React from "react";
import Sidebar from "../components/Volunteer/Sidebar";
import { Outlet } from "react-router-dom";

const VolunteerLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default VolunteerLayout;
