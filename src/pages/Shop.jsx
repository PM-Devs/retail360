import { useState, useEffect } from 'react';
import { 
  Edit, Save, X, Store, User, Settings, Phone, Mail, MapPin, Calendar, Shield, Bot,
  Plus, Search, Filter, Users, Network, Eye, Trash2, Link, Unlink, Crown, Building,
  TrendingUp, DollarSign, Package, AlertTriangle, MoreVertical, ArrowRight, Copy,
  CheckCircle, XCircle, Loader, RefreshCw, Globe, Home, UserCheck, UserPlus
} from 'lucide-react';

// Import existing components
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatBot from '../components/ChatBot.jsx';

// Edit Shop Form Component (moved outside main component)
const EditShopForm = ({ shop, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: shop.name,
    description: shop.description,
    phone: shop.phone,
    email: shop.email,
    businessType: shop.businessType,
    address: { ...shop.address },
    isActive: shop.isActive
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
          <select
            value={formData.businessType}
            onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="mini-mart">Mini Mart</option>
            <option value="boutique">Boutique</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="electronics">Electronics</option>
            <option value="restaurant">Restaurant</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
          className="rounded focus:ring-2 focus:ring-black"
        />
        <label htmlFor="isActive" className="text-sm text-gray-700">
          Shop is active and accepting customers
        </label>
      </div>
      
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {loading ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const ShopManagement = () => {
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  
  // Data states
  const [currentUser] = useState({
    id: "507f1f77bcf86cd799439012",
    name: "Kofi Asante",
    email: "kofi.asante@email.com"
  });
  
  const [shops, setShops] = useState([
    {
      _id: "507f1f77bcf86cd799439011",
      name: "Kofi's Mini Mart",
      description: "Your neighborhood convenience store",
      address: {
        street: "123 Oxford Street",
        city: "Accra",
        region: "Greater Accra",
        country: "Ghana"
      },
      phone: "+233241234567",
      email: "kofi@minimart.com",
      businessType: "mini-mart",
      currency: "GHS",
      shopLevel: "branch",
      isActive: true,
      owner: { name: "Kofi Asante", _id: "507f1f77bcf86cd799439012" },
      masterShop: { _id: "507f1f77bcf86cd799439013", name: "Ama's Fashion Empire HQ" },
      financials: {
        totalRevenue: 15420.50,
        totalExpenses: 8230.75,
        totalDebt: 2500.00
      },
      createdAt: "2024-01-15T10:30:00.000Z"
    },
    {
      _id: "507f1f77bcf86cd799439013",
      name: "Ama's Fashion Empire HQ",
      description: "Main boutique and headquarters",
      address: {
        street: "456 Ring Road",
        city: "Kumasi",
        region: "Ashanti",
        country: "Ghana"
      },
      phone: "+233201234567",
      email: "ama@fashionempire.com",
      businessType: "boutique",
      currency: "GHS",
      shopLevel: "master",
      isActive: true,
      owner: { name: "Kofi Asante", _id: "507f1f77bcf86cd799439012" },
      masterShop: null,
      connectedShops: [
        { shopId: "507f1f77bcf86cd799439011", connectionType: "branch" },
        { shopId: "507f1f77bcf86cd799439015", connectionType: "branch" }
      ],
      financials: {
        totalRevenue: 45000.00,
        totalExpenses: 25000.00,
        totalDebt: 5000.00
      },
      createdAt: "2024-01-15T11:00:00.000Z"
    }
  ]);

  const [currentShop, setCurrentShop] = useState(shops[0]);
  const [shopUsers, setShopUsers] = useState([
    {
      userId: "507f1f77bcf86cd799439012",
      name: "Kofi Asante",
      email: "kofi.asante@email.com",
      shopRole: "owner",
      permissions: ["inventory", "sales", "reports", "settings", "users"],
      isCurrentShop: true
    },
    {
      userId: "507f1f77bcf86cd799439016",
      name: "Akua Manager",
      email: "akua@minimart.com",
      shopRole: "manager",
      permissions: ["inventory", "sales", "reports"],
      isCurrentShop: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalShops: shops.length
  });

  // Form states
  const [editingShop, setEditingShop] = useState(null);
  const [newShop, setNewShop] = useState({
    name: '',
    description: '',
    address: { street: '', city: '', region: '', country: 'Ghana' },
    phone: '',
    email: '',
    businessType: 'mini-mart',
    currency: 'GHS',
    setAsMaster: false
  });

  // Sample dashboard data
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

  // API simulation functions
  const createShop = async (shopData) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newShopData = {
      ...shopData,
      _id: `shop_${Date.now()}`,
      owner: currentUser,
      shopLevel: shopData.setAsMaster ? 'master' : 'independent',
      isActive: true,
      createdAt: new Date().toISOString(),
      financials: { totalRevenue: 0, totalExpenses: 0, totalDebt: 0 }
    };
    
    setShops(prev => [...prev, newShopData]);
    setLoading(false);
    setShowCreateModal(false);
    setNewShop({
      name: '', description: '', address: { street: '', city: '', region: '', country: 'Ghana' },
      phone: '', email: '', businessType: 'mini-mart', currency: 'GHS', setAsMaster: false
    });
  };

  const updateShop = async (shopId, updates) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setShops(prev => prev.map(shop => 
      shop._id === shopId ? { ...shop, ...updates, updatedAt: new Date().toISOString() } : shop
    ));
    
    if (currentShop._id === shopId) {
      setCurrentShop(prev => ({ ...prev, ...updates }));
    }
    
    setLoading(false);
    setEditingShop(null);
  };

  const deleteShop = async (shopId) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setShops(prev => prev.filter(shop => shop._id !== shopId));
    setLoading(false);
  };

  const setMasterShop = async (shopId) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setShops(prev => prev.map(shop => 
      shop._id === shopId 
        ? { ...shop, shopLevel: 'master', masterShop: null }
        : shop
    ));
    
    setLoading(false);
  };

  const connectToMaster = async (shopId, masterShopId) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const masterShop = shops.find(s => s._id === masterShopId);
    
    setShops(prev => prev.map(shop => {
      if (shop._id === shopId) {
        return {
          ...shop,
          shopLevel: 'branch',
          masterShop: { _id: masterShopId, name: masterShop.name }
        };
      }
      if (shop._id === masterShopId) {
        return {
          ...shop,
          connectedShops: [...(shop.connectedShops || []), { shopId, connectionType: 'branch' }]
        };
      }
      return shop;
    }));
    
    setLoading(false);
    setShowNetworkModal(false);
  };

  const switchCurrentShop = async (shopId) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const shop = shops.find(s => s._id === shopId);
    setCurrentShop(shop);
    setLoading(false);
  };

  // Filter shops based on search and level
  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || shop.shopLevel === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const ShopCard = ({ shop, isCurrentShop = false }) => (
    <div className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
      isCurrentShop ? 'border-black ring-4 ring-black/10' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${
              shop.shopLevel === 'master' ? 'bg-yellow-100' : 
              shop.shopLevel === 'branch' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {shop.shopLevel === 'master' ? <Crown className="text-yellow-600" size={20} /> :
               shop.shopLevel === 'branch' ? <Building className="text-blue-600" size={20} /> :
               <Store className="text-gray-600" size={20} />}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                {shop.name}
                {isCurrentShop && <span className="px-2 py-1 bg-black text-white text-xs rounded-full">Current</span>}
              </h3>
              <p className="text-sm text-gray-500 capitalize">{shop.shopLevel} • {shop.businessType}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${shop.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{shop.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={14} className="mr-2" />
            {shop.address.city}, {shop.address.region}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Phone size={14} className="mr-2" />
            {shop.phone}
          </div>
        </div>

        {shop.financials && (
          <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
            <div className="text-center">
              <p className="text-xs text-gray-500">Revenue</p>
              <p className="font-semibold text-green-600">₵{shop.financials.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Expenses</p>
              <p className="font-semibold text-red-600">₵{shop.financials.totalExpenses.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Debt</p>
              <p className="font-semibold text-orange-600">₵{shop.financials.totalDebt.toFixed(2)}</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedShop(shop)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center space-x-1"
            >
              <Eye size={14} />
              <span>View</span>
            </button>
            <button
              onClick={() => setEditingShop(shop)}
              className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center space-x-1"
            >
              <Edit size={14} />
              <span>Edit</span>
            </button>
          </div>
          
          {!isCurrentShop && (
            <button
              onClick={() => switchCurrentShop(shop._id)}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              Switch To
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const CreateShopModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Shop</h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="p-2 hover:bg-gray-100 rounded-xl"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); createShop(newShop); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
                <input
                  type="text"
                  value={newShop.name}
                  onChange={(e) => setNewShop(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                <select
                  value={newShop.businessType}
                  onChange={(e) => setNewShop(prev => ({ ...prev, businessType: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="mini-mart">Mini Mart</option>
                  <option value="boutique">Boutique</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="electronics">Electronics</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newShop.description}
                onChange={(e) => setNewShop(prev => ({ ...prev, description: e.target.value }))}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newShop.phone}
                  onChange={(e) => setNewShop(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newShop.email}
                  onChange={(e) => setNewShop(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                  <input
                    type="text"
                    value={newShop.address.street}
                    onChange={(e) => setNewShop(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, street: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={newShop.address.city}
                    onChange={(e) => setNewShop(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <input
                  type="text"
                  value={newShop.address.region}
                  onChange={(e) => setNewShop(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, region: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-xl">
              <input
                type="checkbox"
                id="setAsMaster"
                checked={newShop.setAsMaster}
                onChange={(e) => setNewShop(prev => ({ ...prev, setAsMaster: e.target.checked }))}
                className="rounded focus:ring-2 focus:ring-black"
              />
              <label htmlFor="setAsMaster" className="text-sm text-gray-700">
                Set as Master Shop (can manage other shops)
              </label>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? <Loader className="animate-spin" size={16} /> : <Plus size={16} />}
                <span>{loading ? 'Creating...' : 'Create Shop'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Navbar */}
        <div className="fixed top-0 right-0 z-30 transition-all duration-300" style={{ left: sidebarOpen ? '256px' : '80px' }}>
          <Navbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            title="Shop Management"
          />
        </div>

        {/* Main Content */}
        <div className="pt-20 px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            
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
                      <p className="text-gray-400 mt-1">Manage your stores, network, and users</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Current Shop</p>
                      <p className="font-semibold">{currentShop?.name}</p>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-100 transition-colors font-medium flex items-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>New Shop</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'overview', label: 'Overview', icon: Store },
                  { id: 'network', label: 'Network', icon: Network },
                  { id: 'users', label: 'Users', icon: Users },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-black border-b-2 border-black bg-gray-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Current Shop Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-600">
                          ₵{currentShop?.financials?.totalRevenue?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-xl">
                        <TrendingUp className="text-green-600" size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                        <p className="text-2xl font-bold text-red-600">
                          ₵{currentShop?.financials?.totalExpenses?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div className="p-3 bg-red-100 rounded-xl">
                        <DollarSign className="text-red-600" size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Outstanding Debt</p>
                        <p className="text-2xl font-bold text-orange-600">
                          ₵{currentShop?.financials?.totalDebt?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-xl">
                        <AlertTriangle className="text-orange-600" size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Shop Level</p>
                        <p className="text-2xl font-bold text-blue-600 capitalize">
                          {currentShop?.shopLevel || 'Independent'}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-xl">
                        {currentShop?.shopLevel === 'master' ? 
                          <Crown className="text-blue-600" size={20} /> :
                          <Building className="text-blue-600" size={20} />
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search shops..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <select
                          value={filterLevel}
                          onChange={(e) => setFilterLevel(e.target.value)}
                          className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white"
                        >
                          <option value="all">All Levels</option>
                          <option value="master">Master</option>
                          <option value="branch">Branch</option>
                          <option value="independent">Independent</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Showing {filteredShops.length} of {shops.length} shops
                    </div>
                  </div>

                  {/* Shops Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredShops.map(shop => (
                      <ShopCard 
                        key={shop._id} 
                        shop={shop} 
                        isCurrentShop={shop._id === currentShop?._id}
                      />
                    ))}
                  </div>
                  
                  {filteredShops.length === 0 && (
                    <div className="text-center py-12">
                      <Store className="mx-auto text-gray-400 mb-4" size={48} />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No shops found</h3>
                      <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'network' && (
              <div className="space-y-8">
                {/* Network Overview */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Shop Network</h2>
                      <p className="text-gray-600">Manage your master shop and connected branches</p>
                    </div>
                    <button
                      onClick={() => setShowNetworkModal(true)}
                      className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center space-x-2"
                    >
                      <Link size={16} />
                      <span>Connect Shop</span>
                    </button>
                  </div>

                  {/* Master Shop Section */}
                  {shops.find(s => s.shopLevel === 'master') ? (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Crown className="text-yellow-500 mr-2" size={20} />
                        Master Shop
                      </h3>
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
                        {(() => {
                          const masterShop = shops.find(s => s.shopLevel === 'master');
                          return (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-3 bg-yellow-100 rounded-xl">
                                  <Crown className="text-yellow-600" size={24} />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{masterShop.name}</h4>
                                  <p className="text-gray-600">{masterShop.description}</p>
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                    <span>Connected Shops: {masterShop.connectedShops?.length || 0}</span>
                                    <span>Revenue: ₵{masterShop.financials.totalRevenue.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => setSelectedShop(masterShop)}
                                className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
                              >
                                View Details
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-8 p-6 bg-gray-50 rounded-2xl text-center">
                      <Crown className="mx-auto text-gray-400 mb-3" size={32} />
                      <h3 className="font-medium text-gray-900 mb-2">No Master Shop Set</h3>
                      <p className="text-gray-600 mb-4">Set one of your shops as master to create a network</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {shops.filter(s => s.shopLevel === 'independent').map(shop => (
                          <button
                            key={shop._id}
                            onClick={() => setMasterShop(shop._id)}
                            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                          >
                            Set "{shop.name}" as Master
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Connected Shops */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Building className="text-blue-500 mr-2" size={20} />
                      Connected Shops ({shops.filter(s => s.shopLevel === 'branch').length})
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {shops.filter(s => s.shopLevel === 'branch').map(shop => (
                        <div key={shop._id} className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Building className="text-blue-600" size={16} />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{shop.name}</h4>
                                <p className="text-sm text-gray-600">Connected to: {shop.masterShop?.name}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                // Disconnect shop
                                setShops(prev => prev.map(s => 
                                  s._id === shop._id 
                                    ? { ...s, shopLevel: 'independent', masterShop: null }
                                    : s._id === shop.masterShop?._id
                                      ? { ...s, connectedShops: s.connectedShops?.filter(c => c.shopId !== shop._id) }
                                      : s
                                ));
                              }}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Disconnect"
                            >
                              <Unlink size={16} />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Revenue</p>
                              <p className="font-semibold text-green-600">₵{shop.financials.totalRevenue.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Status</p>
                              <div className="flex items-center space-x-1">
                                <div className={`w-2 h-2 rounded-full ${shop.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="font-medium">{shop.isActive ? 'Active' : 'Inactive'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {shops.filter(s => s.shopLevel === 'branch').length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Building className="mx-auto mb-3" size={32} />
                        <p>No connected shops yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Independent Shops */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Home className="text-gray-500 mr-2" size={20} />
                    Independent Shops ({shops.filter(s => s.shopLevel === 'independent').length})
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shops.filter(s => s.shopLevel === 'independent').map(shop => (
                      <div key={shop._id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Store className="text-gray-600" size={14} />
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm">{shop.name}</h4>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => setMasterShop(shop._id)}
                              className="p-1 text-yellow-600 hover:bg-yellow-100 rounded text-xs"
                              title="Set as Master"
                            >
                              <Crown size={12} />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-2">{shop.address.city}, {shop.address.region}</p>
                        <div className="text-xs text-gray-500">
                          Revenue: ₵{shop.financials.totalRevenue.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {shops.filter(s => s.shopLevel === 'independent').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Home className="mx-auto mb-3" size={32} />
                      <p>No independent shops</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-8">
                {/* Users Management */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Shop Users</h2>
                      <p className="text-gray-600">Manage users and their permissions</p>
                    </div>
                    <button
                      onClick={() => setShowUserModal(true)}
                      className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center space-x-2"
                    >
                      <UserPlus size={16} />
                      <span>Add User</span>
                    </button>
                  </div>

                  {/* Users List */}
                  <div className="space-y-4">
                    {shopUsers.map(user => (
                      <div key={user.userId} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                              <User className="text-gray-600" size={20} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{user.name}</h4>
                              <p className="text-gray-600">{user.email}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  user.shopRole === 'owner' ? 'bg-yellow-100 text-yellow-700' :
                                  user.shopRole === 'manager' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {user.shopRole}
                                </span>
                                {user.isCurrentShop && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                    Current Shop
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                              <Edit size={16} />
                            </button>
                            {user.shopRole !== 'owner' && (
                              <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Permissions */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">Permissions:</p>
                          <div className="flex flex-wrap gap-2">
                            {user.permissions.map(permission => (
                              <span key={permission} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg capitalize">
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                {/* Current Shop Settings */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop Settings</h2>
                  
                  {editingShop ? (
                    <EditShopForm 
                      shop={editingShop}
                      onSave={(updates) => updateShop(editingShop._id, updates)}
                      onCancel={() => setEditingShop(null)}
                      loading={loading}
                    />
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
                          <p className="text-gray-900 font-medium">{currentShop?.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                          <p className="text-gray-900 capitalize">{currentShop?.businessType}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <p className="text-gray-900">{currentShop?.phone}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <p className="text-gray-900">{currentShop?.email}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <p className="text-gray-700">{currentShop?.description}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <p className="text-gray-700">
                          {currentShop?.address?.street}, {currentShop?.address?.city}, {currentShop?.address?.region}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => setEditingShop(currentShop)}
                        className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center space-x-2"
                      >
                        <Edit size={16} />
                        <span>Edit Shop</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-red-200">
                  <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-900">Delete Shop</h4>
                        <p className="text-sm text-gray-600">Permanently delete this shop and all its data</p>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this shop? This action cannot be undone.')) {
                            deleteShop(currentShop._id);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete Shop
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && <CreateShopModal />}
      
      {/* Network Connection Modal */}
      {showNetworkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Connect to Master</h3>
                <button
                  onClick={() => setShowNetworkModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">Select a shop to connect to master:</p>
                
                {shops.filter(s => s.shopLevel === 'master').map(masterShop => (
                  <button
                    key={masterShop._id}
                    onClick={() => {
                      const shopToConnect = shops.find(s => s.shopLevel === 'independent');
                      if (shopToConnect) {
                        connectToMaster(shopToConnect._id, masterShop._id);
                      }
                    }}
                    className="w-full p-4 text-left bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Crown className="text-yellow-600" size={16} />
                      <div>
                        <p className="font-medium text-gray-900">{masterShop.name}</p>
                        <p className="text-sm text-gray-600">{masterShop.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
                
                {shops.filter(s => s.shopLevel === 'master').length === 0 && (
                  <p className="text-gray-500 text-center py-4">No master shops available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shop Details Modal */}
      {selectedShop && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedShop.name}</h2>
                <button
                  onClick={() => setSelectedShop(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Business Type</p>
                    <p className="text-gray-900 capitalize">{selectedShop.businessType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Shop Level</p>
                    <p className="text-gray-900 capitalize">{selectedShop.shopLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-gray-900">{selectedShop.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-900">{selectedShop.email}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                  <p className="text-gray-700">{selectedShop.description}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Address</p>
                  <p className="text-gray-700">
                    {selectedShop.address.street}<br />
                    {selectedShop.address.city}, {selectedShop.address.region}<br />
                    {selectedShop.address.country}
                  </p>
                </div>
                
                {selectedShop.financials && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Financial Overview</p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-500">Revenue</p>
                        <p className="font-semibold text-green-600">₵{selectedShop.financials.totalRevenue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Expenses</p>
                        <p className="font-semibold text-red-600">₵{selectedShop.financials.totalExpenses.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Debt</p>
                        <p className="font-semibold text-orange-600">₵{selectedShop.financials.totalDebt.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Created: {new Date(selectedShop.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setEditingShop(selectedShop);
                        setSelectedShop(null);
                        setActiveTab('settings');
                      }}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Edit Shop
                    </button>
                  </div>
                </div>
              </div>
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