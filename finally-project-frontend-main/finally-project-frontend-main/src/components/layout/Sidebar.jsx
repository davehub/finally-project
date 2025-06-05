// src/components/layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Importer le contexte d'authentification

/**
 * Composant de barre latérale améliorée avec une meilleure interactivité et design.
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, userRole } = useAuth();

  const navLinks = [
    { path: "/", name: "Tableau de bord", icon: "🏠", roles: ["user", "admin"] },
    { path: "/users", name: "Gestion des utilisateurs", icon: "👥", roles: ["admin"] },
    { path: "/materials", name: "Gestion des matériaux", icon: "📦", roles: ["user", "admin"] },
    { path: "/categories", name: "Gestion des catégories", icon: "📂", roles: ["user", "admin"] },
    { path: "/roles", name: "Gestion des rôles", icon: "🔑", roles: ["admin"] },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-30 lg:hidden" onClick={onClose}></div>
      )}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-6 space-y-6 z-40
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          transition-all duration-300 ease-in-out lg:relative lg:flex-shrink-0 shadow-xl`}
      >
        <div className="flex items-center justify-between lg:justify-center">
          <h1 className="text-2xl font-bold text-blue-400">Admin Panel</h1>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white focus:outline-none">
            ✖
          </button>
        </div>

        <nav>
          {currentUser &&
            navLinks
              .filter((link) => link.roles.includes(userRole))
              .map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ease-in-out
                  ${isActive ? "bg-blue-700 text-white shadow-md" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
                  }
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.name}</span>
                </NavLink>
              ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;