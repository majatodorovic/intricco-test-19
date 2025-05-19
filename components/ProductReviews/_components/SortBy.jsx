"use client";

/**
 * Component for sorting items by different criteria.
 *
 * @param {function} handleSortChange - Callback for updating sort criteria.
 * @param {Object} sort - Current sort settings (field and direction).
 * @param {Array} [sortOptions=[{label: "Latest", value: "new", direction: "desc"}, {label: "Oldest", value: "old", direction: "asc"}]] - Available sort options.
 *
 * Renders sorting options as a dropdown on mobile and button group on larger screens.
 */

const SortBy = ({
  handleSortChange,
  sort,
  sortOptions = [
    { label: "Latest", value: "new", direction: "desc" },
    { label: "Oldest", value: "old", direction: "asc" },
  ],
}) => {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-[auto_1fr] md:items-center">
      <span className="text-sm font-semibold text-gray-700 hidden md:block mr-4">
        Sort By
      </span>

      {/* Select element for mobile */}
      <div className="block md:hidden">
        <select
          onChange={(e) =>
            handleSortChange({
              field: e.target.value,
              direction: e.target.direction,
            })
          }
          value={sort.value}
          className="w-full px-3 py-2 border rounded text-sm text-gray-700"
        >
          <option value="" disabled>
            Sort By
          </option>
          {sortOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Button group for tablets and larger screens */}
      <div className="hidden md:flex flex-row gap-4">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() =>
              handleSortChange({
                field: option.value,
                direction: option.direction,
              })
            }
            className={`px-3 py-2 rounded-full border text-sm ${
              sort.field === option.value
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortBy;
