import { X } from 'lucide-react';

const FilterModal = ({ isOpen, onClose, filters, onFilterChange, categories }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Filter Products</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Status
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.lowStock}
                  onChange={() => onFilterChange('lowStock', !filters.lowStock)}
                  className="w-4 h-4 text-black rounded border-gray-300 focus:ring-black"
                />
                <span className="ml-2 text-sm text-gray-600">Low Stock Only</span>
              </label>
            </div>
          </div>

          {/* Product Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Status
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.active}
                  onChange={() => onFilterChange('active', !filters.active)}
                  className="w-4 h-4 text-black rounded border-gray-300 focus:ring-black"
                />
                <span className="ml-2 text-sm text-gray-600">Active Products</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inactive}
                  onChange={() => onFilterChange('inactive', !filters.inactive)}
                  className="w-4 h-4 text-black rounded border-gray-300 focus:ring-black"
                />
                <span className="ml-2 text-sm text-gray-600">Inactive Products</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t">
          <button
            onClick={() => {
              onFilterChange('reset', null);
              onClose();
            }}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
