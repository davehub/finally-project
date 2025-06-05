import React from "react";

/**
 * Composant de tableau réutilisable avec un design moderne et amélioré.
 */
const Table = ({
  headers,
  data,
  className = "",
  headerClassName = "",
  rowClassName = "",
  cellClassName = "",
  striped = true,
  ...props
}) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
      <table
        className={`min-w-full divide-y divide-gray-300 bg-white ${className}`}
        {...props}
      >
        <thead className="bg-gray-100">
          <tr className={`${headerClassName} border-b border-gray-300`}>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-6 py-4 text-sm text-gray-500 text-center"
              >
                Aucune donnée disponible.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${striped && rowIndex % 2 === 1 ? "bg-gray-50" : "bg-white"} hover:bg-gray-200 transition-all duration-300 ${rowClassName}`}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-6 py-4 text-sm text-gray-900 ${cellClassName}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;