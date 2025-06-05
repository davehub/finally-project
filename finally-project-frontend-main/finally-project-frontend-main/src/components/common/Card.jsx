
import React from 'react';

/**
 * Composant Card réutilisable avec un design moderne.
 * @param {object} props - Propriétés du composant.
 * @param {React.ReactNode} props.children - Le contenu à afficher dans la carte.
 * @param {string} [props.className=''] - Classes Tailwind CSS supplémentaires pour la carte.
 * @param {string} [props.title=''] - Titre facultatif pour la carte.
 * @param {string} [props.titleClassName=''] - Classes Tailwind CSS supplémentaires pour le titre de la carte.
 */
const Card = ({ children, className = '', title = '', titleClassName = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-transform transform hover:scale-105 hover:shadow-xl ${className}`}
      {...props}
    >
      {title && (
        <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${titleClassName}`}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Card;