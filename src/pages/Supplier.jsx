import React, { useState, useEffect } from 'react';
import { Search, Plus, Phone, Mail, MapPin, Package, Edit, Trash2, X, Save, ArrowLeft, Bot } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import ChatBot from '../components/ChatBot';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    products: []
  });
  const [newProduct, setNewProduct] = useState('');
  
  // State for layout components
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [showChatBot, setShowChatBot] = useState(false);
  
  // Mock dashboard data for WelcomeModal and ChatBot
  const dashboardData = {
    todayStats: {
      revenue: 1245.75,
      transactions: 24,
      averageOrderValue: 51.90
    },
    customers: {
      totalCustomers: 124
    },
    inventory: {
      lowStockCount: 3,
      lowStockProducts: [
        { name: "Coca Cola 500ml" },
        { name: "Fanta Orange 350ml" },
        { name: "Sprite 500ml" }
      ]
    }
  };

  // Mock function to simulate API call
  const getSuppliers = (shopId) => {
    return [
      {
        "id": "sup_123",
        "name": "Coca Cola Bottling Company",
        "contactPerson": "Mike Johnson",
        "phone": "+233555123456",
        "email": "mike@cocacola.com",
        "address": "Industrial Area, Tema",
        "products": [
          { "name": "Coca Cola 500ml" },
          { "name": "Fanta Orange 350ml" },
          { "name": "Sprite 500ml" }
        ]
      },
      {
        "id": "sup_124",
        "name": "Unilever Ghana Ltd",
        "contactPerson": "Sarah Adams",
        "phone": "+233555987654",
        "email": "sarah@unilever.com",
        "address": "Spintex Road, Accra",
        "products": [
          { "name": "OMO Detergent 500g" },
          { "name": "Lipton Tea Bags" },
          { "name": "Blue Band Margarine" }
        ]
      },
      {
        "id": "sup_125",
        "name": "Fan Milk Limited",
        "contactPerson": "John Mensah",
        "phone": "+233555456789",
        "email": "john@fanmilk.com",
        "address": "Tema Industrial Area",
        "products": [
          { "name": "Fan Ice Vanilla" },
          { "name": "Fan Yoghurt Strawberry" },
          { "name": "Fan Milk 500ml" }
        ]
      },
      {
        "id": "sup_126",
        "name": "Nestlé Ghana Ltd",
        "contactPerson": "Grace Owusu",
        "phone": "+233555234567",
        "email": "grace@nestle.com",
        "address": "East Legon, Accra",
        "products": [
          { "name": "Milo 400g" },
          { "name": "Maggi Cubes" },
          { "name": "Nescafé Classic" }
        ]
      }
    ];
  };

  useEffect(() => {
    const fetchedSuppliers = getSuppliers("shop_001");
    setSuppliers(fetchedSuppliers);
    setFilteredSuppliers(fetchedSuppliers);
    
    // Show welcome modal on first load
   
  }, []);
useEffect(() => {
  const filtered = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.products.some(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  setFilteredSuppliers(filtered);
}, [searchTerm, suppliers]);

  const handleSupplierClick = (supplier) => {
    setSelectedSupplier(supplier);
    setFormData(supplier);
    setIsEditing(false);
    setIsAdding(false);
  };

  const handleAddSupplier = () => {
    setIsAdding(true);
    setSelectedSupplier(null);
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      products: []
    });
    setIsEditing(true);
  };

  const handleEditSupplier = () => {
    setIsEditing(true);
  };

  const handleDeleteSupplier = () => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      const updatedSuppliers = suppliers.filter(s => s.id !== selectedSupplier.id);
      setSuppliers(updatedSuppliers);
      setSelectedSupplier(null);
    }
  };

  const handleSaveSupplier = () => {
    if (isAdding) {
      const newSupplier = {
        ...formData,
        id: `sup_${Date.now()}`
      };
      setSuppliers([...suppliers, newSupplier]);
      setSelectedSupplier(newSupplier);
      setIsAdding(false);
    } else {
      const updatedSuppliers = suppliers.map(s => 
        s.id === selectedSupplier.id ? { ...formData, id: selectedSupplier.id } : s
      );
      setSuppliers(updatedSuppliers);
      setSelectedSupplier({ ...formData, id: selectedSupplier.id });
    }
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProduct = () => {
    if (newProduct.trim()) {
      setFormData(prev => ({
        ...prev,
        products: [...prev.products, { name: newProduct.trim() }]
      }));
      setNewProduct('');
    }
  };

  const handleRemoveProduct = (index) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const handleCancel = () => {
    if (isAdding) {
      setSelectedSupplier(null);
      setIsAdding(false);
    } else {
      setFormData(selectedSupplier);
    }
    setIsEditing(false);
  };

  const handleBackToList = () => {
    setSelectedSupplier(null);
    setIsAdding(false);
    setIsEditing(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
              title="Supplier Management" 
          />
        </div>

      
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-12">
          {selectedSupplier || isAdding ? (
            <div className="min-h-full bg-gray-50">
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={handleBackToList}
                      className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                      <h1 className="text-2xl font-bold text-black">
                        {isAdding ? 'Add New Supplier' : (isEditing ? 'Edit Supplier' : 'Supplier Details')}
                      </h1>
                      <p className="text-gray-600 mt-1">
                        {isAdding ? 'Enter supplier information' : (isEditing ? 'Update supplier information' : selectedSupplier?.name)}
                      </p>
                    </div>
                  </div>
                  
                  {!isEditing && !isAdding && (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleEditSupplier}
                        className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={handleDeleteSupplier}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Form/Details Content */}
              <div className="max-w-4xl mx-auto px-6 py-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <form className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-all ${
                            isEditing 
                              ? 'focus:ring-2 focus:ring-black focus:border-transparent' 
                              : 'bg-gray-50 text-gray-700'
                          }`}
                          placeholder="Enter company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-all ${
                            isEditing 
                              ? 'focus:ring-2 focus:ring-black focus:border-transparent' 
                              : 'bg-gray-50 text-gray-700'
                          }`}
                          placeholder="Enter contact person"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-all ${
                            isEditing 
                              ? 'focus:ring-2 focus:ring-black focus:border-transparent' 
                              : 'bg-gray-50 text-gray-700'
                          }`}
                          placeholder="+233555123456"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-all ${
                            isEditing 
                              ? 'focus:ring-2 focus:ring-black focus:border-transparent' 
                              : 'bg-gray-50 text-gray-700'
                          }`}
                          placeholder="email@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows="3"
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-all ${
                          isEditing 
                            ? 'focus:ring-2 focus:ring-black focus:border-transparent' 
                            : 'bg-gray-50 text-gray-700'
                        }`}
                        placeholder="Enter complete address"
                      />
                    </div>

                    {/* Products Section */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Products
                      </label>
                      
                      {isEditing && (
                        <div className="flex mb-4">
                          <input
                            type="text"
                            value={newProduct}
                            onChange={(e) => setNewProduct(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                            placeholder="Enter product name"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProduct())}
                          />
                          <button
                            type="button"
                            onClick={handleAddProduct}
                            className="px-4 py-2 bg-black text-white rounded-r-lg hover:bg-gray-800 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {formData.products.map((product, index) => (
                          <div key={index} className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                            <span className="text-sm text-gray-700">{product.name}</span>
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => handleRemoveProduct(index)}
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveSupplier}
                          className="flex items-center px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isAdding ? 'Add Supplier' : 'Save Changes'}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-full bg-gray-50">
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-2xl font-bold text-black">Supplier Management</h1>
                  <p className="text-gray-600 mt-1">Manage your suppliers and their product catalog</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search suppliers, contacts, or products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Suppliers List */}
              <div className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredSuppliers.map((supplier) => (
                    <div
                      key={supplier.id}
                      onClick={() => handleSupplierClick(supplier)}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                    >
                      {/* Supplier Header */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-black group-hover:text-gray-800 transition-colors">
                            {supplier.name}
                          </h3>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <p className="text-gray-600 font-medium">{supplier.contactPerson}</p>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{supplier.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm truncate">{supplier.email}</span>
                        </div>
                        <div className="flex items-start text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{supplier.address}</span>
                        </div>
                      </div>

                      {/* Products */}
                      <div>
                        <div className="flex items-center mb-2">
                          <Package className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            Products ({supplier.products.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {supplier.products.slice(0, 3).map((product, index) => (
                            <span
                              key={index}
                              className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                            >
                              {product.name}
                            </span>
                          ))}
                          {supplier.products.length > 3 && (
                            <span className="inline-block bg-black text-white px-2 py-1 rounded-md text-xs">
                              +{supplier.products.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredSuppliers.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? 'No suppliers found' : 'No suppliers yet'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm 
                        ? 'Try adjusting your search terms'
                        : 'Add your first supplier to get started'
                      }
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={handleAddSupplier}
                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        Add Supplier
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Floating Action Button */}
              <button
                onClick={handleAddSupplier}
                className="fixed bottom-6 right-6 bg-black text-white w-14 h-14 rounded-full shadow-lg hover:bg-gray-800 transition-all hover:scale-105 flex items-center justify-center z-50"
                aria-label="Add Supplier"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
      
  
      {/* Chatbot */}
      <ChatBot 
        isVisible={showChatBot}
        onClose={() => setShowChatBot(false)}
        dashboardData={dashboardData}
      />
      
      {/* Chatbot Toggle Button */}
      <button 
        onClick={() => setShowChatBot(true)}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-black to-black text-white w-14 h-14 rounded-full shadow-lg hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center z-50"
        aria-label="Open AI Chat"
      >
        <Bot className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SupplierManagement;