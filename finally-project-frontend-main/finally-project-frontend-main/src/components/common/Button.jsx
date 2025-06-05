import React from 'react';

/**
 * Composant de bouton réutilisable avec un design professionnel.
 * @param {object} props - Propriétés du composant.
 * @param {string} props.children - Le contenu du bouton.
 * @param {string} [props.variant='primary'] - La variante de style du bouton ('primary', 'secondary', 'danger', 'outline').
 * @param {string} [props.size='md'] - La taille du bouton ('sm', 'md', 'lg').
 * @param {boolean} [props.disabled=false] - Indique si le bouton est désactivé.
 * @param {string} [props.className=''] - Classes Tailwind CSS supplémentaires.
 * @param {function} props.onClick - Gestionnaire d'événements de clic.
 * @param {string} [props.type='button'] - Type de bouton ('button', 'submit', 'reset').
 */
const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'font-semibold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75 shadow-md flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:scale-95',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 active:scale-95',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:scale-95',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400 active:scale-95',
  };

  const sizeStyles = {
    sm: 'text-sm py-1.5 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-2.5 px-5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${
        sizeStyles[size] || sizeStyles.md
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;