import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { path: ".", label: "Dashboard" },
    { path: "my-events", label: "My Events" },
    { path: "badges", label: "Badges" },
    { path: "quizzes", label: "Quiz History" },
    { path: "start-quiz", label: "Start Quiz" },
    { path: "profile", label: "Profile" },
    { path: "generate-certificates", label: "Certificates" },
  ];

  return (
    <aside className="w-64 bg-gray-100 h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Volunteer Dashboard</h2>
      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end
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
