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

// Import existing components
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatBot from '../components/ChatBot.jsx';

const CatPage = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Layout states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false);

  // Mock dashboard data for components
  const dashboardData = {
    todayStats: {
      revenue: 2450.50,
      transactions: 24,
      averageOrderValue: 102.10
    },
    inventory: {
      lowStockCount: 5,
      lowStockProducts: [
        { name: 'Coca Cola 500ml' },
        { name: 'Pringles Original' }
      ]
    },
    customers: {
      totalCustomers: 156
    }
  };

  // Mock data for categories
  useEffect(() => {
    const mockCategories = [
      {
        id: "cat_001",
        name: "Beverages",
        description: "Soft drinks and beverages",
        parentCategory: null,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        itemCount: 25,
        color: "#3B82F6"
      },
      {
        id: "cat_002", 
        name: "Snacks",
        description: "Chips, crackers, and snack foods",
        parentCategory: null,
        isActive: true,
        createdAt: "2024-01-02T00:00:00Z",
        itemCount: 18,
        color: "#10B981"
      },
      {
        id: "cat_003",
        name: "Dairy",
        description: "Milk, cheese, and dairy products", 
        parentCategory: null,
        isActive: true,
        createdAt: "2024-01-03T00:00:00Z",
        itemCount: 12,
        color: "#F59E0B"
      },
      {
        id: "cat_004",
        name: "Household",
        description: "Cleaning supplies and household items",
        parentCategory: null,
        isActive: true,
        createdAt: "2024-01-04T00:00:00Z",
        itemCount: 31,
        color: "#8B5CF6"
      }
    ];
    setCategories(mockCategories);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentCategory: null,
    isActive: true
  });

  // Filtered categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', parentCategory: null, isActive: true });
    setShowAddCategory(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      parentCategory: category.parentCategory,
      isActive: category.isActive
    });
    setShowAddCategory(true);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
    } else {
      // Create new category
      const newCategory = {
        id: `cat_${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
        itemCount: 0,
        color: "#6B7280"
      };
      setCategories(prev => [...prev, newCategory]);
    }
    setShowAddCategory(false);
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const CategoryCard = ({ category }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
          style={{ backgroundColor: category.color }}
        >
          <Package size={24} />
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleEditCategory(category)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={() => handleDeleteCategory(category.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{category.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{category.itemCount} items</span>
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

  const CategoryListItem = ({ category }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
          style={{ backgroundColor: category.color }}
        >
          <Package size={20} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">{category.name}</h3>
          <p className="text-gray-600 text-sm">{category.description}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500">{category.itemCount} items</span>
        <span className={`px-2 py-1 text-xs rounded-full ${
          category.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {category.isActive ? 'Active' : 'Inactive'}
        </span>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleEditCategory(category)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={() => handleDeleteCategory(category.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
     {/* Sidebar - Fixed positioning with proper z-index */}
      <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content area - Adjusted for sidebar */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Navbar - Fixed at top with proper z-index */}
        <div className="fixed top-0 right-0 z-30 transition-all duration-300" style={{ left: sidebarOpen ? '256px' : '80px' }}>
          <Navbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            title={ 'Categories'}
          />
        </div>


        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="mb-8 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 ">Categories</h1>
            <p className="text-gray-600">Manage your product categories and organize your inventory.</p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

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
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List size={18} />
              </button>
            </div>

            {/* Filter Button */}
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={18} />
              <span>Filter</span>
            </button>

            {/* Add Category Button */}
            <button 
              onClick={handleAddCategory}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus size={18} />
              <span>Add Category</span>
            </button>
          </div>

          {/* Categories Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map(category => (
                <CategoryListItem key={category.id} category={category} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
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

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChatBot(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
            >
              <Bot className="text-white w-6 h-6" />
      </button>

      {/* Add/Edit Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category
                </label>
                <select
                  value={formData.parentCategory || ''}
                  onChange={(e) => setFormData({...formData, parentCategory: e.target.value || null})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">None (Root Category)</option>
                  {categories.filter(cat => cat.id !== editingCategory?.id).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
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
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className="flex-1 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors"
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
        dashboardData={dashboardData}
        isVisible={showChatBot}
        onClose={() => setShowChatBot(false)}
      />
    </div>
  );
};

export default CatPage;