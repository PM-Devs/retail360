const FilterChips = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onFilterChange('lowStock')}
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          filters.lowStock
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Low Stock
      </button>
      <button
        onClick={() => onFilterChange('active')}
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          filters.active
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Active
      </button>
      <button
        onClick={() => onFilterChange('inactive')}
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          filters.inactive
            ? 'bg-gray-300 text-gray-800'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Inactive
      </button>
    </div>
  );
};

export default FilterChips;
