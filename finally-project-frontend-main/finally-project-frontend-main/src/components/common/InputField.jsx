import React from "react";

/**
 * Composant InputField réutilisable avec un design professionnel et accessible.
 * @param {object} props - Propriétés du composant.
 */
const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  className = "",
  labelClassName = "",
  containerClassName = "",
  error = "",
  ...props
}) => {
  const inputBaseStyles =
    "block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-300 focus:outline-none focus:ring-2 focus:border-blue-500 sm:text-sm";
  const errorStyles = error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
  const disabledStyles = disabled ? "bg-gray-100 cursor-not-allowed" : "";
  const labelStyles = "block text-sm font-semibold text-gray-800 mb-1";

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className={`${labelStyles} ${labelClassName}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`${inputBaseStyles} ${errorStyles} ${disabledStyles} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;