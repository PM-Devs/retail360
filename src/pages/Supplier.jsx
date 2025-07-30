import React, { useState, useEffect } from 'react';
import { Search, Plus, Phone, Mail, MapPin, Package, Edit, Trash2, X, Save, ArrowLeft, Bot } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatBot from '../components/ChatBot';

const BASE_URL = 'https://retail360-backend.vercel.app';

// Custom Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};



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
    paymentTerms: '',
    products: []
  });
  const [newProduct, setNewProduct] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
  const [showChatBot, setShowChatBot] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Get current shop ID from localStorage (with error handling)
  const getUserData = () => {
    try {
      return JSON.parse(localStorage.getItem('userData') || '{}');
    } catch {
      return {};
    }
  };
  
  const userData = getUserData();
  const shopId = userData.currentShop?._id || userData.shops?.[0]?._id;

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    if (!shopId) {
      setError('No shop selected');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/api/suppliers/shop/${shopId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch suppliers: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSuppliers(data.data || []);
      setFilteredSuppliers(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching suppliers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new supplier
  const createSupplier = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/api/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          shopId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create supplier: ${response.statusText}`);
      }
      
      const data = await response.json();
      fetchSuppliers();
      setSelectedSupplier(data.data);
      setSuccessMessage('Supplier created successfully!');
      setShowSuccessModal(true);
      setIsAdding(false);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
      console.error('Error creating supplier:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing supplier
  const updateSupplier = async () => {
    try {
      if (!selectedSupplier?._id) return;
      
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/api/suppliers/${selectedSupplier._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update supplier: ${response.statusText}`);
      }
      
      const data = await response.json();
      fetchSuppliers();
      setSelectedSupplier({ ...selectedSupplier, ...formData });
      setSuccessMessage('Supplier updated successfully!');
      setShowSuccessModal(true);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
      console.error('Error updating supplier:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete supplier
  const deleteSupplier = async () => {
    try {
      if (!selectedSupplier?._id) return;
      
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/api/suppliers/${selectedSupplier._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete supplier: ${response.statusText}`);
      }
      
      fetchSuppliers();
      setSelectedSupplier(null);
      setShowDeleteModal(false);
      setSuccessMessage('Supplier deleted successfully!');
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting supplier:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchSuppliers();
    }
  }, [shopId]);

  useEffect(() => {
    const filtered = suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.contactPerson && supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (supplier.products && supplier.products.some(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
    
    setFilteredSuppliers(filtered);
  }, [searchTerm, suppliers]);

  const handleSupplierClick = (supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name || '',
      contactPerson: supplier.contactPerson || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      paymentTerms: supplier.paymentTerms || '',
      products: supplier.products || []
    });
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
      paymentTerms: '',
      products: []
    });
    setIsEditing(true);
  };

  const handleEditSupplier = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleSaveSupplier = () => {
    if (isAdding) {
      createSupplier();
    } else {
      updateSupplier();
    }
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
        products: [...(prev.products || []), { name: newProduct.trim() }]
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
    } else if (selectedSupplier) {
      setFormData({
        name: selectedSupplier.name || '',
        contactPerson: selectedSupplier.contactPerson || '',
        phone: selectedSupplier.phone || '',
        email: selectedSupplier.email || '',
        address: selectedSupplier.address || '',
        paymentTerms: selectedSupplier.paymentTerms || '',
        products: selectedSupplier.products || []
      });
    }
    setIsEditing(false);
  };

  const handleBackToList = () => {
    setSelectedSupplier(null);
    setIsAdding(false);
    setIsEditing(false);
  };

  // Close sidebar when clicking overlay on mobile
  const handleOverlayClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };



  if (error && suppliers.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md w-full">
            <div className="text-red-500 text-2xl mb-4">Error</div>
            <p className="text-gray-700 mb-4">{error}</p>
            <button 
              onClick={fetchSuppliers}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={handleOverlayClick}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } ${sidebarOpen ? 'w-64' : 'w-64 md:w-20'}`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} flex flex-col`}>
        {/* Navbar */}
        <div className="flex-shrink-0">
          <Navbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            title="Supplier Management" 
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedSupplier || isAdding ? (
            <div className="min-h-full bg-gray-50">
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <button
                      onClick={handleBackToList}
                      className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="min-w-0">
                      <h1 className="text-lg md:text-2xl font-bold text-black truncate">
                        {isAdding ? 'Add New Supplier' : (isEditing ? 'Edit Supplier' : 'Supplier Details')}
                      </h1>
                      <p className="text-gray-600 text-sm md:text-base mt-1 truncate">
                        {isAdding ? 'Enter supplier information' : (isEditing ? 'Update supplier information' : selectedSupplier?.name)}
                      </p>
                    </div>
                  </div>
                  
                  {!isEditing && !isAdding && (
                    <div className="flex space-x-2 flex-shrink-0">
                      <button
                        onClick={handleEditSupplier}
                        className="flex items-center px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Form/Details Content */}
              <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                  <form className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-black mb-2">
                          Payment Terms
                        </label>
                        <select
                          name="paymentTerms"
                          value={formData.paymentTerms}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-all ${
                            isEditing 
                              ? 'focus:ring-2 focus:ring-black focus:border-transparent' 
                              : 'bg-gray-50 text-gray-700'
                          }`}
                        >
                          <option value="">Select payment terms</option>
                          <option value="cash">Cash</option>
                          <option value="credit-7">Credit (7 days)</option>
                          <option value="credit-14">Credit (14 days)</option>
                          <option value="credit-30">Credit (30 days)</option>
                        </select>
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
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-all resize-none ${
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
                      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
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
                          disabled={isLoading}
                          className="flex items-center justify-center px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                 
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
              <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-xl md:text-2xl font-bold text-black">Supplier Management</h1>
                  <p className="text-gray-600 mt-1 text-sm md:text-base">Manage your suppliers and their product catalog</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
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
              <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
                <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSuppliers.map((supplier) => (
                    <div
                      key={supplier._id}
                      onClick={() => handleSupplierClick(supplier)}
                      className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                    >
                      {/* Supplier Header */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-base md:text-lg font-bold text-black group-hover:text-gray-800 transition-colors line-clamp-2">
                            {supplier.name}
                          </h3>
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                        </div>
                        <p className="text-gray-600 font-medium text-sm md:text-base truncate">{supplier.contactPerson}</p>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-xs md:text-sm truncate">{supplier.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-xs md:text-sm truncate">{supplier.email}</span>
                        </div>
                        <div className="flex items-start text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-xs md:text-sm line-clamp-2">{supplier.address}</span>
                        </div>
                      </div>

                      {/* Products */}
                      <div>
                        <div className="flex items-center mb-2">
                          <Package className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="text-xs md:text-sm font-medium text-gray-700">
                            Products ({supplier.products?.length || 0})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {supplier.products?.slice(0, 3).map((product, index) => (
                            <span
                              key={index}
                              className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs truncate max-w-24"
                            >
                              {product.name}
                            </span>
                          ))}
                          {supplier.products?.length > 3 && (
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
                  <div className="text-center py-8 md:py-12">
                    <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
                      {searchTerm ? 'No suppliers found' : 'No suppliers yet'}
                    </h3>
                    <p className="text-gray-600 mb-6 text-sm md:text-base max-w-md mx-auto">
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
                className="fixed bottom-6 right-6 bg-black text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg hover:bg-gray-800 transition-all hover:scale-105 flex items-center justify-center z-50"
                aria-label="Add Supplier"
              >
                <Plus className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Chatbot */}
      <ChatBot 
        isVisible={showChatBot}
        onClose={() => setShowChatBot(false)}
      />
      
      {/* Chatbot Toggle Button */}
      <button 
        onClick={() => setShowChatBot(true)}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-black to-black text-white w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center z-40"
        aria-label="Open AI Chat"
      >
        <Bot className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        <div className="p-4">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete <span className="font-bold">{selectedSupplier?.name}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={deleteSupplier}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
             
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Success Notification Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
      >
        <div className="p-4">
          <p className="text-gray-700 mb-6">{successMessage}</p>
          <div className="flex justify-end">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SupplierManagement;