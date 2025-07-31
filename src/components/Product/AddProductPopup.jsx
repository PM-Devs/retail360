import { useState, useEffect } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';

// API base URL
const API_BASE = 'https://retail360-backend.vercel.app';

const AddProductPopup = ({ isOpen, onClose }) => {
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const shopId = userData?.currentShop?._id;
  const userId = userData?._id; // Get user ID for addedBy field
  const authToken = localStorage.getItem('authToken');
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    costPrice: '',
    sellingPrice: '',
    wholesalePrice: '',
    discountPrice: '',
    currentQuantity: '',
    minQuantity: '',
    reorderLevel: '',
    unitOfMeasure: 'piece',
    description: '',
    barcode: '',
    expiryDate: '',
    batchNumber: '',
    image: null
  });
  
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const unitOptions = [
    'piece', 'sachet', 'bottle', 'kilo', 'gram', 
    'liter', 'meter', 'pack', 'carton', 'dozen'
  ];

  const fetchCategories = async () => {
    if (!shopId || !authToken) return [];

    try {
      const response = await fetch(`${API_BASE}/api/categories/shop/${shopId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        return data.data.filter(cat => cat.isActive !== false);
      }
      
      return [];
    } catch (error) {
      setError('Failed to load categories. Please try again.');
      return [];
    }
  };

  // Fetch categories when popup opens
  useEffect(() => {
    if (isOpen && shopId && authToken) {
      setLoading(true);
      fetchCategories()
        .then(categoriesData => {
          setCategories(categoriesData);
          setError(''); // Clear any previous errors
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, shopId, authToken]);

  // Reset form when popup closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        sku: '',
        category: '',
        costPrice: '',
        sellingPrice: '',
        wholesalePrice: '',
        discountPrice: '',
        currentQuantity: '',
        minQuantity: '',
        reorderLevel: '',
        unitOfMeasure: 'piece',
        description: '',
        barcode: '',
        expiryDate: '',
        batchNumber: '',
        image: null
      });
      setError('');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const createProduct = async (productData) => {
    if (!shopId) {
      setError('No shop selected');
      return null;
    }

    if (!userId) {
      setError('User information not found. Please log in again.');
      return null;
    }

    try {
      setIsLoading(true);
      
      // Transform form data to match schema structure
      const transformedData = {
        name: productData.name,
        sku: productData.sku || undefined,
        category: productData.category,
        description: productData.description || undefined,
        barcode: productData.barcode || undefined,
        pricing: {
          costPrice: parseFloat(productData.costPrice),
          sellingPrice: parseFloat(productData.sellingPrice),
          wholesalePrice: productData.wholesalePrice ? parseFloat(productData.wholesalePrice) : 0,
          discountPrice: productData.discountPrice ? parseFloat(productData.discountPrice) : 0
        },
        stock: {
          currentQuantity: parseInt(productData.currentQuantity) || 0,
          minQuantity: parseInt(productData.minQuantity) || 5,
          reorderLevel: parseInt(productData.reorderLevel) || 10
        },
        unitOfMeasure: productData.unitOfMeasure,
        expiryDate: productData.expiryDate || undefined,
        batchNumber: productData.batchNumber || undefined,
        shopId,
        addedBy: userId // Add the user ID for the backend
      };

      const response = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(transformedData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      setError(error.message || 'Failed to create product');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Validate required fields
      if (!formData.name) {
        throw new Error('Product name is required');
      }
      if (!formData.category) {
        throw new Error('Category is required');
      }
      if (!formData.costPrice) {
        throw new Error('Cost price is required');
      }
      if (!formData.sellingPrice) {
        throw new Error('Selling price is required');
      }
      if (!userId) {
        throw new Error('User information not found. Please log in again.');
      }
      if (!shopId) {
        throw new Error('Shop information not found. Please select a shop.');
      }

      const response = await createProduct(formData);
      if (response) {
        onClose();
        // You might want to refresh the products list here
        // or call a callback function passed as prop
      }
    } catch (err) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full relative z-10 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={loading}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg mb-4">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
                maxLength="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              disabled={loading}
              maxLength="500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {loading && categories.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">Loading categories...</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit of Measure
              </label>
              <select
                name="unitOfMeasure"
                value={formData.unitOfMeasure}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {unitOptions.map(unit => (
                  <option key={unit} value={unit}>
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost Price *
                </label>
                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price *
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wholesale Price
                </label>
                <input
                  type="number"
                  name="wholesalePrice"
                  value={formData.wholesalePrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Price
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Stock Management */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Stock Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Quantity
                </label>
                <input
                  type="number"
                  name="currentQuantity"
                  value={formData.currentQuantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Quantity
                </label>
                <input
                  type="number"
                  name="minQuantity"
                  value={formData.minQuantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  disabled={loading}
                  placeholder="Default: 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reorder Level
                </label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  disabled={loading}
                  placeholder="Default: 10"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Barcode
                </label>
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Number
                </label>
                <input
                  type="text"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                id="image-upload"
                disabled={loading}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer flex flex-col items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Click to upload or drag and drop
                </span>
              </label>
              {formData.image && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected: {formData.image.name}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || isLoading}
          >
            {loading || isLoading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductPopup;