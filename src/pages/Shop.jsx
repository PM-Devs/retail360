import { useState } from 'react';
import { Edit, Save, X, Store, User, Settings, Phone, Mail, MapPin, Calendar, Shield, Bot } from 'lucide-react';

// Import existing components
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatBot from '../components/ChatBot.jsx';

const ShopManagement = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false);
  
  const [shopData, setShopData] = useState({
    id: "shop_123",
    name: "Super Store",
    description: "Your neighborhood convenience store with quality products and exceptional service for the community.",
    address: "123 Main Street, Accra",
    phone: "+233123456789",
    email: "info@superstore.com",
    isActive: true,
    owner: {
      name: "John Doe",
      email: "john@example.com"
    },
    createdAt: "2024-01-01T00:00:00Z"
  });

  // Sample dashboard data for the chatbot and welcome modal
  const dashboardData = {
    todayStats: {
      revenue: 2450.75,
      transactions: 28,
      averageOrderValue: 87.53
    },
    inventory: {
      lowStockCount: 3,
      lowStockProducts: [
        { name: "Coca Cola 500ml" },
        { name: "Bread Loaf" },
        { name: "Milk 1L" }
      ]
    },
    customers: {
      totalCustomers: 156
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setShopData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setShopData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the data
    setIsEditing(false);
    // Show a success message or notification
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset any unsaved changes if needed
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
             title="Shop Managment"
          />
        </div>
      
      {/* ChatBot */}
      <ChatBot 
        dashboardData={dashboardData}
        isVisible={showChatBot}
        onClose={() => setShowChatBot(false)}
      />

      {/* Main Content */}
  
        <div className="max-w-7xl mx-auto px-6 py-8 ">
          
          {/* Header Section */}
          <div className="bg-black text-white rounded-3xl mb-8 overflow-hidden">
            <div className="px-8 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                    <Store className="text-black" size={24} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Shop Management</h1>
                    <p className="text-gray-400 mt-1">Manage your store information and settings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <div className={`mb-8 p-6 rounded-2xl border-2 ${
            shopData.isActive 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${
                  shopData.isActive ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Shield className={shopData.isActive ? 'text-green-600' : 'text-red-600'} size={24} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    shopData.isActive ? 'text-green-800' : 'text-red-800'
                  }`}>
                    Shop Status: {shopData.isActive ? 'Active' : 'Inactive'}
                  </h3>
                  <p className={`text-sm ${
                    shopData.isActive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {shopData.isActive 
                      ? 'Your shop is live and accepting customers' 
                      : 'Your shop is currently disabled'
                    }
                  </p>
                </div>
              </div>
              {isEditing && (
                <button
                  onClick={() => handleInputChange('isActive', !shopData.isActive)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
                    shopData.isActive 
                      ? 'bg-green-500 focus:ring-green-500' 
                      : 'bg-gray-300 focus:ring-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                      shopData.isActive ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Shop Information Card */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-900 to-black p-8">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <Store className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Shop Information</h2>
                      <p className="text-gray-300">Manage your store details</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 space-y-8">
                  {/* Basic Info Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                          <Store size={16} />
                          <span>Shop Name</span>
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={shopData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium text-lg">{shopData.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                          <Phone size={16} />
                          <span>Phone Number</span>
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={shopData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{shopData.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Mail size={16} />
                        <span>Email Address</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={shopData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{shopData.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <MapPin size={16} />
                        <span>Store Address</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={shopData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{shopData.address}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      {isEditing ? (
                        <textarea
                          value={shopData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                          placeholder="Tell customers about your store..."
                        />
                      ) : (
                        <p className="text-gray-700 leading-relaxed">{shopData.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Owner Information Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Owner Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                          <User size={16} />
                          <span>Owner Name</span>
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={shopData.owner.name}
                            onChange={(e) => handleInputChange('owner.name', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{shopData.owner.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                          <Mail size={16} />
                          <span>Owner Email</span>
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={shopData.owner.email}
                            onChange={(e) => handleInputChange('owner.email', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{shopData.owner.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings & Info Sidebar */}
            <div className="space-y-8">
              {/* Quick Stats Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-900 to-black p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                      <Settings className="text-white" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Quick Info</h2>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar className="text-blue-600" size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Created</p>
                          <p className="text-xs text-gray-500">Store establishment</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(shopData.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Store className="text-purple-600" size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Shop ID</p>
                          <p className="text-xs text-gray-500">Unique identifier</p>
                        </div>
                      </div>
                      <p className="text-sm font-mono font-semibold text-gray-900 bg-white px-2 py-1 rounded-lg">
                        {shopData.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleSave}
                      className="w-full px-6 py-4 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all duration-200 flex items-center justify-center space-x-3 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Save size={20} />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="w-full px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3 font-medium"
                    >
                      <X size={20} />
                      <span>Cancel</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full px-6 py-4 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all duration-200 flex items-center justify-center space-x-3 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Edit size={20} />
                    <span>Edit Shop</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChatBot(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
             >
               <Bot className="text-white w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    </div>
  );
};

export default ShopManagement;