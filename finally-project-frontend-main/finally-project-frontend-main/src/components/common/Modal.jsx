import React, { useEffect, useRef } from "react";
import Button from "./Button"; // Supposons que le composant Button est dans le même répertoire

/**
 * Composant Modal réutilisable avec un design professionnel et interactif.
 */
const Modal = ({ isOpen, onClose, title, children, size = "md", className = "" }) => {
  const modalRef = useRef(null);

  // Fermer la modale sur la touche Échap
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Gérer le clic en dehors du contenu de la modale
  const handleOverlayClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-2xl w-full ${sizeClasses[size] || sizeClasses.md} transform transition-all duration-300 ease-out scale-100 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête de la modale */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Fermer la modale"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Corps de la modale */}
        <div className="p-5 overflow-y-auto max-h-[70vh]">{children}</div>

        {/* Pied de page avec actions */}
        <div className="flex justify-end p-5 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;