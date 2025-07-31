import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Package, 
  Edit3, 
  Trash2, 
  Filter,
  Grid,
  List,
  MessageCircle,
  Bot
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatBot from '../components/ChatBot.jsx';

const API_BASE_URL = 'https://retail360-backend.vercel.app';

const CatPage = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentCategory: '',
    isActive: true
  });

  // Get current shop ID from user data
  const getCurrentShopId = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        return parsedData.currentShop?._id || null;
      }
      
      // Fallback to old method if userData doesn't exist
      return localStorage.getItem('currentShop');
    } catch (error) {
      console.error('Error parsing user data:', error);
      return localStorage.getItem('currentShop');
    }
  };

  const shopId = getCurrentShopId();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      if (!shopId) {
        throw new Error('No shop selected');
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/categories/shop/${shopId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch categories: ${response.status}`);
      }
      
      const data = await response.json();
      setCategories(data.data || []);
      setParentCategories((data.data || []).filter(cat => !cat.parentCategory));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single category for editing
  const fetchCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch category');
      }
      
      return await response.json();
    } catch (err) {
      setError(err.message);
      console.error('Error fetching category:', err);
      return null;
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchCategories();
    } else {
      setError('No shop selected. Please select a shop first.');
      setLoading(false);
    }
    
    // Responsive sidebar
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [shopId]);

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle add category button
  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({ 
      name: '', 
      description: '', 
      parentCategory: '', 
      isActive: true 
    });
    setShowAddCategory(true);
  };

  // Handle edit category
  const handleEditCategory = async (category) => {
    try {
      const categoryData = await fetchCategory(category._id);
      if (categoryData && categoryData.data) {
        setEditingCategory(categoryData.data);
        setFormData({
          name: categoryData.data.name || '',
          description: categoryData.data.description || '',
          parentCategory: categoryData.data.parentCategory?._id || '',
          isActive: categoryData.data.isActive !== undefined ? categoryData.data.isActive : true
        });
        setShowAddCategory(true);
      }
    } catch (err) {
      setError('Failed to load category for editing');
      console.error(err);
    }
  };

  // Save category (create or update)
  const handleSaveCategory = async () => {
    try {
      if (!formData.name.trim()) {
        setError('Category name is required');
        return;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const method = editingCategory ? 'PUT' : 'POST';
      const url = editingCategory 
        ? `${API_BASE_URL}/api/categories/${editingCategory._id}`
        : `${API_BASE_URL}/api/categories`;
      
      const requestBody = {
        ...formData,
        ...(editingCategory ? {} : { shopId })
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save category');
      }
      
      fetchCategories(); // Refresh categories
      setShowAddCategory(false);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message);
      console.error('Error saving category:', err);
    }
  };

  // Delete category (soft delete)
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete category');
      }
      
      // Optimistic UI update
      setCategories(prev => 
        prev.filter(cat => cat._id !== categoryId)
      );
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message);
      console.error('Error deleting category:', err);
    }
  };

  // Category card component
  const CategoryCard = ({ category }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white"
          style={{ backgroundColor: category.color || '#6B7280' }}
        >
          <Package size={20} className="sm:w-6 sm:h-6" />
        </div>
        <div className="flex space-x-1 sm:space-x-2">
          <button 
            onClick={() => handleEditCategory(category)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit3 size={14} className="sm:w-4 sm:h-4" />
          </button>
          <button 
            onClick={() => handleDeleteCategory(category._id)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
      
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
      <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">
        {category.description || 'No description'}
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm text-gray-500">
          {category.products?.length || 0} items
        </span>
        <span className={`px-2 py-1 text-xs rounded-full ${
          category.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {category.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  );

  // Category list item component
  const CategoryListItem = ({ category }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
        <div 
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
          style={{ backgroundColor: category.color || '#6B7280' }}
        >
          <Package size={16} className="sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{category.name}</h3>
          <p className="text-gray-600 text-xs sm:text-sm truncate">
            {category.description || 'No description'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
        <div className="hidden sm:flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {category.products?.length || 0} items
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            category.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {category.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="flex space-x-1 sm:space-x-2">
          <button 
            onClick={() => handleEditCategory(category)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit3 size={14} className="sm:w-4 sm:h-4" />
          </button>
          <button 
            onClick={() => handleDeleteCategory(category._id)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 animate-pulse" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Loading categories...</h3>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-4">
          <Package className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading categories</h3>
          <p className="mt-1 text-sm text-gray-500 break-words">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchCategories();
            }}
            className="mt-4 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - FIXED: Added mobile-friendly behavior */}
      <div 
        className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out transform ${
          sidebarOpen 
            ? 'translate-x-0 w-64 shadow-lg' 
            : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Sidebar Overlay - FIXED: Added mobile-specific behavior */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Navbar */}
        <div className="fixed top-0 right-0 left-0 lg:left-auto z-30 transition-all duration-300" style={{ left: sidebarOpen ? '0' : '0' }}>
          <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
            <Navbar 
              onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
              title={'Categories'}
            />
          </div>
        </div>

        {/* Page Content */}
        <div className="pt-16 lg:pt-0">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
            {/* Page Title */}
            <div className="mb-6 sm:mb-8 p-3 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Categories</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your product categories and organize your inventory.</p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Package className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={() => setError(null)}
                      className="text-red-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4 mb-4 sm:mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-2 sm:space-x-4">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <List size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>

                {/* Filter Button */}
                <button className="hidden sm:flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter size={18} />
                  <span>Filter</span>
                </button>

                {/* Add Category Button */}
                <button 
                  onClick={handleAddCategory}
                  className="bg-black hover:bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-sm sm:text-base"
                >
                  <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden sm:inline">Add Category</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>

            {/* Categories Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {filteredCategories.map(category => (
                  <CategoryCard key={category._id} category={category} />
                ))}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredCategories.map(category => (
                  <CategoryListItem key={category._id} category={category} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredCategories.length === 0 && !error && (
              <div className="text-center py-8 sm:py-12">
                <Package className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first category.'}
                </p>
                {!searchTerm && (
                  <div className="mt-6">
                    <button 
                      onClick={handleAddCategory}
                      className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
                    >
                      <Plus size={18} />
                      <span>Add Category</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChatBot(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
      >
        <Bot className="text-white w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Add/Edit Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category
                </label>
                <select
                  name="parentCategory"
                  value={formData.parentCategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">None (Root Category)</option>
                  {parentCategories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active category
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddCategory(false)}
                className="flex-1 px-4 py-2.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className="flex-1 px-4 py-2.5 sm:py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!formData.name.trim()}
              >
                {editingCategory ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ChatBot */}
      <ChatBot
        isVisible={showChatBot}
        onClose={() => setShowChatBot(false)}
      />
    </div>
  );
};

export default CatPage;