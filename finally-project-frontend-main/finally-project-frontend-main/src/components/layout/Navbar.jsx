// src/components/layout/Navbar.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext"; // Importer le contexte d'authentification
import Button from "../common/Button"; // Importer le composant Button

/**
 * Composant de barre de navigation améliorée pour une meilleure expérience utilisateur.
 */
const Navbar = ({ onMenuClick }) => {
  const { currentUser, userRole, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <nav className="bg-white shadow-lg p-4 flex items-center justify-between sticky top-0 z-30 border-b border-gray-200">
      {/* Bouton menu pour mobile */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none transition-transform hover:scale-105"
        aria-label="Ouvrir le menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {currentUser ? (
        <div className="flex items-center space-x-4">
          {/* Informations utilisateur */}
          <div className="relative flex items-center space-x-2 text-gray-700">
            <img
              className="h-10 w-10 rounded-full object-cover border border-gray-300 shadow-md"
              src="https://placehold.co/40x40/cccccc/ffffff?text=U"
              alt="Avatar utilisateur"
            />
            <span className="hidden md:block font-medium text-gray-800">
              {currentUser.email} <span className="text-sm text-gray-500">({userRole})</span>
            </span>
          </div>
          {/* Bouton de déconnexion */}
          <Button onClick={handleLogout} variant="danger" size="sm">
            Déconnexion
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Button onClick={() => window.location.href = "/login"} variant="primary" size="sm">
            Connexion
          </Button>
          <Button onClick={() => window.location.href = "/register"} variant="outline" size="sm">
            Inscription
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;