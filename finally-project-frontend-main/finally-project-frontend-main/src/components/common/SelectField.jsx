import React from "react";

/**
 * Composant SelectField réutilisable avec un design professionnel et interactif.
 */
const SelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  className = "",
  labelClassName = "",
  containerClassName = "",
  error = "",
  ...props
}) => {
  const selectBaseStyles =
    "block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-300 focus:outline-none focus:ring-2 sm:text-sm";
  const errorStyles = error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
  const disabledStyles = disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "";
  const labelStyles = "block text-sm font-semibold text-gray-800 mb-1";

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className={`${labelStyles} ${labelClassName}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`${selectBaseStyles} ${errorStyles} ${disabledStyles} ${className} appearance-none`}
          {...props}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Icône de flèche pour styliser le sélecteur */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default SelectField;