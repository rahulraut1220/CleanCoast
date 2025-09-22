import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { path: "create-event", label: "Create Event" },
    { path: "manage-events", label: "Manage Events" },
    { path: "mark-attendance", label: "Mark Attendance" },
    { path: "view-reports", label: "View Reports" },
  ];

  return (
    <aside className="w-64 bg-gray-100 h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Organizer Dashboard</h2>
      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-700"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
