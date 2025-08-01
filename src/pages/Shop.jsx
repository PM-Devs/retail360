import { useState, useEffect } from 'react';
import { 
  Edit, Save, X, Store, User, Settings, Phone, Mail, MapPin, Crown, Building,
  Plus, Search, Filter, Users, Network, Eye, Trash2, Link, TrendingUp, 
  DollarSign, Package, MoreVertical, Loader, CheckCircle, XCircle, Bot
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatBot from '../components/ChatBot.jsx';
import { toast } from 'react-toastify';

const API_BASE_URL = 'https://retail360-backend.vercel.app/api';

// Animation variants
const fadeInUp = "animate-[fadeInUp_0.5s_ease-out]";
const slideInRight = "animate-[slideInRight_0.3s_ease-out]";
const scaleIn = "animate-[scaleIn_0.2s_ease-out]";
const bounceIn = "animate-[bounceIn_0.6s_ease-out]";

// Business Types Enum
const BUSINESS_TYPES = [
  'mini-mart',
  'provision-store',
  'supermarket',
  'cosmetic-shop',
  'spare-parts',
  'boutique',
  'other'
];

// Custom CSS animations
const customStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes bounceIn {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .hover-lift {
    transition: all 0.3s ease;
  }
  
  .hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    .sidebar-container {
      width: 100%;
      z-index: 40;
      transform: translateX(-100%);
      transition: transform 0.3s ease-out;
    }
    
    .sidebar-container.open {
      transform: translateX(0);
    }
    
    .sidebar-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.5);
      z-index: 30;
    }
    
    .sidebar-overlay.visible {
      display: block;
    }
  }
`;

// Edit Shop Form Component
const EditShopForm = ({ shop, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: shop?.name || '',
    description: shop?.description || '',
    phone: shop?.phone || '',
    email: shop?.email || '',
    businessType: shop?.businessType || '',
    address: {
      street: shop?.address?.street || '',
      city: shop?.address?.city || '',
      region: shop?.address?.region || '',
      country: shop?.address?.country || 'Ghana'
    },
    isActive: shop?.isActive !== undefined ? shop.isActive : true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={`${scaleIn}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${fadeInUp} delay-100`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
              required
            />
          </div>
          
          <div className={`${fadeInUp} delay-200`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
            <select
              value={formData.businessType}
              onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
              required
            >
              <option value="">Select business type</option>
              {BUSINESS_TYPES.map(type => (
                <option key={type} value={type}>
                  {type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className={`${fadeInUp} delay-300`}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${fadeInUp} delay-400`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
            />
          </div>
          
          <div className={`${fadeInUp} delay-500`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
            />
          </div>
        </div>

        {/* Address Section */}
        <div className={`${fadeInUp} delay-600`}>
          <h3 className="font-medium text-gray-900 mb-4">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, street: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, city: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <input
              type="text"
              value={formData.address.region}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, region: e.target.value }
              }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
            />
          </div>
        </div>
        
        <div className={`${fadeInUp} delay-700 flex items-center space-x-3 p-4 bg-gray-50 rounded-xl`}>
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
        
        <div className={`${fadeInUp} delay-800 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4`}>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 hover-lift"
          >
            {loading ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 hover-lift"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Shop Card Component
const ShopCard = ({ 
  shop, 
  isCurrentShop, 
  setSelectedShop, 
  setEditingShop, 
  setShowDeleteConfirm, 
  switchCurrentShop, 
  currentShop,
  masterShop
}) => {
  // Determine shop level based on role and master status
  const shopLevel = 
    shop._id === masterShop?._id ? 'master' :
    shop.role === 'owner' ? 'independent' : 'branch';
  
  return (
    <div className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover-lift ${
      isCurrentShop ? 'border-black ring-4 ring-black/10' : 'border-gray-200 hover:border-gray-300'
    } ${fadeInUp}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl transition-all duration-300 ${
              shopLevel === 'master' ? 'bg-yellow-100' : 
              shopLevel === 'branch' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {shopLevel === 'master' ? <Crown className="text-yellow-600" size={20} /> :
               shopLevel === 'branch' ? <Building className="text-blue-600" size={20} /> :
               <Store className="text-gray-600" size={20} />}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                {shop.name}
                {isCurrentShop && <span className="px-2 py-1 bg-black text-white text-xs rounded-full animate-pulse">Current</span>}
              </h3>
              <p className="text-sm text-gray-500 capitalize">{shopLevel} • {shop.businessType}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              shop.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300">
                <MoreVertical size={16} />
              </button>
              <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={() => setSelectedShop(shop)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => setEditingShop(shop)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Edit Shop
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(shop)}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{shop.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={14} className="mr-2" />
            {shop.address?.city}, {shop.address?.region}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Phone size={14} className="mr-2" />
            {shop.phone}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedShop(shop)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 text-sm flex items-center space-x-1 hover-lift"
            >
              <Eye size={14} />
              <span>View</span>
            </button>
            <button
              onClick={() => setEditingShop(shop)}
              className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 text-sm flex items-center space-x-1 hover-lift"
            >
              <Edit size={14} />
              <span>Edit</span>
            </button>
          </div>
          
          {!isCurrentShop && (
            <button
              onClick={() => switchCurrentShop(shop._id)}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-300 text-sm hover-lift"
            >
              Switch To
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Create Shop Modal Component
const CreateShopModal = ({ onClose, onCreate, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: { street: '', city: '', region: '', country: 'Ghana' },
    phone: '',
    email: '',
    businessType: '',
    currency: 'GHS',
    setAsMaster: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`glass-card rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${scaleIn}`}>
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Shop</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`${fadeInUp} delay-100`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                  required
                />
              </div>
              
              <div className={`${fadeInUp} delay-200`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                  required
                >
                  <option value="">Select business type</option>
                  {BUSINESS_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className={`${fadeInUp} delay-300`}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`${fadeInUp} delay-400`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                />
              </div>
              
              <div className={`${fadeInUp} delay-500`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                />
              </div>
            </div>
            
            <div className={`${fadeInUp} delay-600`}>
              <h3 className="font-medium text-gray-900 mb-4">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, street: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <input
                  type="text"
                  value={formData.address.region}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, region: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                />
              </div>
            </div>
            
            <div className={`${fadeInUp} delay-700 flex items-center space-x-3 p-4 bg-yellow-50 rounded-xl`}>
              <input
                type="checkbox"
                id="setAsMaster"
                checked={formData.setAsMaster}
                onChange={(e) => setFormData(prev => ({ ...prev, setAsMaster: e.target.checked }))}
                className="rounded focus:ring-2 focus:ring-black"
              />
              <label htmlFor="setAsMaster" className="text-sm text-gray-700">
                Set as Master Shop (can manage other shops)
              </label>
            </div>
            
            <div className={`${fadeInUp} delay-800 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4`}>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 hover-lift"
              >
                {loading ? <Loader className="animate-spin" size={16} /> : <Plus size={16} />}
                <span>{loading ? 'Creating...' : 'Create Shop'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 hover-lift"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Network Modal Component
const NetworkModal = ({ 
  onClose, 
  shops, 
  masterShop, 
  connectToMaster, 
  loading 
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className={`glass-card rounded-3xl shadow-2xl max-w-md w-full ${scaleIn}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Connect to Master</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">Select shops to connect:</p>
          
          {masterShop && (
            <div className={`${fadeInUp} delay-100`}>
              <h4 className="font-medium text-gray-900 mb-2">Available Master Shop:</h4>
              <button
                onClick={() => {
                  const independentShop = shops.find(s => s.role === 'owner');
                  if (independentShop) {
                    connectToMaster(independentShop._id, masterShop._id);
                  }
                }}
                disabled={loading}
                className="w-full p-4 text-left bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition-all duration-300 disabled:opacity-50"
              >
                <div className="flex items-center space-x-3">
                  <Crown className="text-yellow-600" size={16} />
                  <div>
                    <p className="font-medium text-gray-900">{masterShop.name}</p>
                    <p className="text-sm text-gray-600">Master Shop</p>
                  </div>
                </div>
              </button>
            </div>
          )}
          
          {!masterShop && (
            <div className={`${fadeInUp} delay-100 text-center py-4`}>
              <Crown className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No master shop available</p>
              <p className="text-sm text-gray-400">Set a shop as master first</p>
            </div>
          )}
          
          {shops.filter(s => s.role === 'owner').length === 0 && (
            <div className={`${fadeInUp} delay-200 text-center py-4`}>
              <Building className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No independent shops to connect</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Delete Confirmation Modal Component
const DeleteConfirmModal = ({ shop, onCancel, onDelete, loading }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className={`glass-card rounded-3xl shadow-2xl max-w-md w-full ${scaleIn}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-red-600">Delete Shop</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete <strong>{shop.name}</strong>?
          </p>
          <p className="text-sm text-red-600">
            This action cannot be undone and will permanently delete all shop data.
          </p>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => onDelete(shop._id)}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? <Loader className="animate-spin" size={16} /> : <Trash2 size={16} />}
              <span>{loading ? 'Deleting...' : 'Delete'}</span>
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
);

// Create User Modal Component
const CreateUserModal = ({ 
  onClose, 
  onCreate, 
  newUser, 
  setNewUser, 
  loading 
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className={`glass-card rounded-3xl shadow-2xl max-w-md w-full ${scaleIn}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Add New User</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300"
          >
            <X size={16} />
          </button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onCreate(newUser); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={newUser.phone}
              onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
              required
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="cashier">Cashier</option>
              <option value="inventory">Inventory Manager</option>
            </select>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? <Loader className="animate-spin" size={16} /> : <User size={16} />}
              <span>{loading ? 'Creating...' : 'Add User'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

// Notification Bar Component
const NotificationBar = ({ notification, setNotification }) => {
  if (!notification) return null;
  
  return (
    <div className={`fixed top-20 right-4 z-50 ${slideInRight}`}>
      <div className={`px-6 py-4 rounded-xl shadow-lg border-l-4 ${
        notification.type === 'success' 
          ? 'bg-green-50 border-green-500 text-green-800' 
          : 'bg-red-50 border-red-500 text-red-800'
      }`}>
        <div className="flex items-center space-x-3">
          {notification.type === 'success' ? 
            <CheckCircle size={20} /> : 
            <XCircle size={20} />
          }
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="hover:bg-black/10 rounded-lg p-1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ShopManagement = () => {
  // Add custom styles
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // State management
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Data states
  const [currentUser, setCurrentUser] = useState(null);
  const [shops, setShops] = useState([]);
  const [currentShop, setCurrentShop] = useState(null);
  const [masterShop, setMasterShop] = useState(null);
  const [shopStats, setShopStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  // Form states
  const [editingShop, setEditingShop] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'cashier',
    phone: ''
  });

  // Mobile responsive
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get auth data
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const getUserData = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Initialize data
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setCurrentUser(userData);
      fetchUserShops(userData.id);
    }
  }, []);

  // Fetch users for current shop
  const fetchShopUsers = async (shopId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shops/${shopId}/users`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // API functions
  const fetchUserShops = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${userId}/shops`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Transform shop data to include all necessary fields
        const transformedShops = data.data.shops.map(shopData => ({
          ...shopData.shopId,
          role: shopData.role,
          permissions: shopData.permissions,
          isActive: shopData.isActive,
          joinedAt: shopData.joinedAt
        }));
        
        setShops(transformedShops);
        setCurrentShop(data.data.currentShop);
        setMasterShop(data.data.masterShop);
        
        if (data.data.currentShop) {
          fetchShopStats(data.data.currentShop._id);
          fetchShopUsers(data.data.currentShop._id);
        }
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to fetch shops', 'error');
      }
    } catch (error) {
      showNotification('Failed to fetch shops', 'error');
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShopStats = async (shopId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shops/${shopId}/stats`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setShopStats(data.data);
      } else {
        console.error('Failed to fetch shop stats');
      }
    } catch (error) {
      console.error('Error fetching shop stats:', error);
    }
  };

  const createShop = async (shopData) => {
    try {
      setLoading(true);
      const payload = {
        ...shopData,
        userId: currentUser.id
      };
      
      const response = await fetch(`${API_BASE_URL}/shops`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        await fetchUserShops(currentUser.id);
        setShowCreateModal(false);
        showNotification('Shop created successfully!');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to create shop', 'error');
      }
    } catch (error) {
      showNotification('Failed to create shop', 'error');
      console.error('Error creating shop:', error);
    } finally {
      setLoading(false);
    }
  };
const createUser = async (userData) => {
  try {
    setLoading(true);
    
    // Add the registeredByUserId to the request body
    const requestBody = {
      ...userData,
      registeredByUserId: currentUser?.id || null // Assuming you have current user context
    };
    
    const response = await fetch(`${API_BASE_URL}/staff/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody)
    });
    
    if (response.ok) {
      const result = await response.json();
      await fetchShopUsers(currentShop._id);
      setShowCreateUserModal(false);
      setNewUser({ name: '', email: '', role: 'cashier', phone: '' });
      showNotification('Staff member registered successfully!');
    } else {
      const errorData = await response.json();
      showNotification(errorData.message || 'Failed to register staff member', 'error');
    }
  } catch (error) {
    showNotification('Failed to register staff member', 'error');
    console.error('Error registering staff member:', error);
  } finally {
    setLoading(false);
  }
};
  const updateShop = async (shopId, updates) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/shops/${shopId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        await fetchUserShops(currentUser.id);
        setEditingShop(null);
        showNotification('Shop updated successfully!');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to update shop', 'error');
      }
    } catch (error) {
      showNotification('Failed to update shop', 'error');
      console.error('Error updating shop:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteShop = async (shopId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/shops/${shopId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId: currentUser.id })
      });
      
      if (response.ok) {
        await fetchUserShops(currentUser.id);
        setShowDeleteConfirm(null);
        showNotification('Shop deleted successfully!');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to delete shop', 'error');
      }
    } catch (error) {
      showNotification('Failed to delete shop', 'error');
      console.error('Error deleting shop:', error);
    } finally {
      setLoading(false);
    }
  };

  const setMasterShopAPI = async (shopId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}/master-shop`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ shopId })
      });
      
      if (response.ok) {
        await fetchUserShops(currentUser.id);
        showNotification('Master shop set successfully!');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to set master shop', 'error');
      }
    } catch (error) {
      showNotification('Failed to set master shop', 'error');
      console.error('Error setting master shop:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectToMaster = async (shopId, masterShopId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/shops/${shopId}/connect-to-master`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          masterShopId,
          connectionType: 'branch',
          financialSettings: {
            shareRevenue: true,
            consolidateReports: true,
            sharedInventory: false
          }
        })
      });
      
      if (response.ok) {
        await fetchUserShops(currentUser.id);
        setShowNetworkModal(false);
        showNotification('Shop connected successfully!');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to connect shop', 'error');
      }
    } catch (error) {
      showNotification('Failed to connect shop', 'error');
      console.error('Error connecting shop:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchCurrentShop = async (shopId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}/current-shop`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ shopId })
      });
      
      if (response.ok) {
        await fetchUserShops(currentUser.id);
        showNotification('Current shop switched successfully!');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to switch shop', 'error');
      }
    } catch (error) {
      showNotification('Failed to switch shop', 'error');
      console.error('Error switching shop:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter shops based on search and level
  const filteredShops = shops.filter(shop => {
    if (!shop) return false;
    
    const matchesSearch = shop.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesLevel = true;
    if (filterLevel !== 'all') {
      if (filterLevel === 'master') {
        matchesLevel = shop._id === masterShop?._id;
      } else if (filterLevel === 'branch') {
        matchesLevel = shop._id !== masterShop?._id && shop.role !== 'owner';
      } else if (filterLevel === 'independent') {
        matchesLevel = shop.role === 'owner';
      }
    }
    
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notification */}
      <NotificationBar notification={notification} setNotification={setNotification} />
      
      {/* Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="sidebar-overlay visible"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`sidebar-container fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
        isMobile ? 'w-full' : sidebarOpen ? 'w-64' : 'w-20'
      } ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ${
        isMobile ? 'ml-0' : sidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
        {/* Navbar */}
        <div className={`fixed top-0 right-0 z-30 transition-all duration-300 ${
          isMobile ? 'left-0' : sidebarOpen ? 'left-64' : 'left-20'
        }`}>
          <Navbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            title="Shop Management"
          />
        </div>

        {/* Main Content */}
        <div className="pt-20 px-4 md:px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className={`bg-black text-white rounded-3xl mb-8 overflow-hidden ${bounceIn}`}>
              <div className="px-6 md:px-8 py-6 md:py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4 md:space-x-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-white to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                      <Store className="text-black" size={isMobile ? 20 : 24} />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Shop Management</h1>
                      <p className="text-gray-400 mt-1 text-sm md:text-base">Manage your stores, network, and users</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-400">Current Shop</p>
                      <p className="font-semibold">{currentShop?.name || 'No shop selected'}</p>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-4 md:px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium flex items-center space-x-2 hover-lift"
                    >
                      <Plus size={16} />
                      <span>New Shop</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className={`bg-white rounded-2xl shadow-lg mb-8 overflow-hidden ${fadeInUp}`}>
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: Store },
                  { id: 'network', label: 'Network', icon: Network },
                  { id: 'users', label: 'Users', icon: Users },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 md:px-6 py-4 font-medium transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-black border-b-2 border-black bg-gray-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon size={16} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Current Shop Stats */}
                {shopStats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <div className={`bg-white rounded-2xl shadow-lg p-4 md:p-6 hover-lift ${fadeInUp} delay-100`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Sales</p>
                          <p className="text-xl md:text-2xl font-bold text-green-600">
                            {shopStats.totalSales || 0}
                          </p>
                        </div>
                        <div className="p-2 md:p-3 bg-green-100 rounded-xl">
                          <TrendingUp className="text-green-600" size={16} />
                        </div>
                      </div>
                    </div>
                    
                    <div className={`bg-white rounded-2xl shadow-lg p-4 md:p-6 hover-lift ${fadeInUp} delay-200`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Daily Sales</p>
                          <p className="text-xl md:text-2xl font-bold text-blue-600">
                            {shopStats.dailySales || 0}
                          </p>
                        </div>
                        <div className="p-2 md:p-3 bg-blue-100 rounded-xl">
                          <DollarSign className="text-blue-600" size={16} />
                        </div>
                      </div>
                    </div>
                    
                    <div className={`bg-white rounded-2xl shadow-lg p-4 md:p-6 hover-lift ${fadeInUp} delay-300`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Products</p>
                          <p className="text-xl md:text-2xl font-bold text-purple-600">
                            {shopStats.totalProducts || 0}
                          </p>
                        </div>
                        <div className="p-2 md:p-3 bg-purple-100 rounded-xl">
                          <Package className="text-purple-600" size={16} />
                        </div>
                      </div>
                    </div>
                    
                    <div className={`bg-white rounded-2xl shadow-lg p-4 md:p-6 hover-lift ${fadeInUp} delay-400`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Customers</p>
                          <p className="text-xl md:text-2xl font-bold text-orange-600">
                            {shopStats.totalCustomers || 0}
                          </p>
                        </div>
                        <div className="p-2 md:p-3 bg-orange-100 rounded-xl">
                          <Users className="text-orange-600" size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Search and Filter */}
                <div className={`bg-white rounded-2xl shadow-lg p-4 md:p-6 ${fadeInUp} delay-500`}>
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1 w-full">
                      <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search shops..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                        />
                      </div>
                      
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <select
                          value={filterLevel}
                          onChange={(e) => setFilterLevel(e.target.value)}
                          className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white transition-all duration-300"
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {filteredShops.map((shop, index) => (
                      <div key={shop._id} className={`${fadeInUp}`} style={{ animationDelay: `${index * 100}ms` }}>
                        <ShopCard 
                          shop={shop} 
                          isCurrentShop={shop._id === currentShop?._id}
                          setSelectedShop={setSelectedShop}
                          setEditingShop={setEditingShop}
                          setShowDeleteConfirm={setShowDeleteConfirm}
                          switchCurrentShop={switchCurrentShop}
                          currentShop={currentShop}
                          masterShop={masterShop}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {filteredShops.length === 0 && (
                    <div className="text-center py-12">
                      <Store className="mx-auto text-gray-400 mb-4" size={48} />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No shops found</h3>
                      <p className="text-gray-600">
                        {shops.length === 0 ? 'Create your first shop to get started' : 'Try adjusting your search or filter criteria'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-8">
                <div className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 ${fadeInUp}`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                      <p className="text-gray-600">Manage users for your shop</p>
                    </div>
                    <button
                      onClick={() => setShowCreateUserModal(true)}
                      disabled={!currentShop}
                      className={`px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center space-x-2 hover-lift ${
                        !currentShop ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <User size={16} />
                      <span>Add User</span>
                    </button>
                  </div>

                  {!currentShop ? (
                    <div className="text-center py-12">
                      <Store className="mx-auto text-gray-400 mb-4" size={48} />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Shop Selected</h3>
                      <p className="text-gray-600">Please select a shop first to manage users</p>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-12">
                      <User className="mx-auto text-gray-400 mb-4" size={48} />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
                      <p className="text-gray-600">Add users to your shop to get started</p>
                      <button
                        onClick={() => setShowCreateUserModal(true)}
                        className="mt-4 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center space-x-2 mx-auto hover-lift"
                      >
                        <User size={16} />
                        <span>Add First User</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {users.map((user, index) => (
                        <div key={user._id} className={`bg-white rounded-2xl border border-gray-200 p-6 hover-lift ${fadeInUp}`} style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="flex items-center space-x-4">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                            <div>
                              <h3 className="font-semibold text-gray-900">{user.name}</h3>
                              <p className="text-gray-600">{user.email}</p>
                              <div className="flex items-center mt-2">
                                <span className="text-sm px-2 py-1 bg-gray-100 text-gray-800 rounded capitalize">
                                  {user.role}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <button className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300">
                              Edit
                            </button>
                            <button className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-300">
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'network' && (
              <div className="space-y-8">
                {/* Network Overview */}
                <div className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 ${fadeInUp}`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Shop Network</h2>
                      <p className="text-gray-600">Manage your master shop and connected branches</p>
                    </div>
                    <button
                      onClick={() => setShowNetworkModal(true)}
                      className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center space-x-2 hover-lift"
                    >
                      <Link size={16} />
                      <span>Connect Shop</span>
                    </button>
                  </div>

                  {/* Master Shop Section */}
                  {masterShop ? (
                    <div className={`mb-8 ${fadeInUp} delay-200`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Crown className="text-yellow-500 mr-2" size={20} />
                        Master Shop
                      </h3>
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-yellow-100 rounded-xl">
                              <Crown className="text-yellow-600" size={24} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{masterShop.name}</h4>
                              <p className="text-gray-600">{masterShop.description}</p>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-gray-500 space-y-1 sm:space-y-0">
                                <span>Connected Shops: {shops.filter(s => s.role !== 'owner').length}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedShop(masterShop)}
                            className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover-lift"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`mb-8 p-6 bg-gray-50 rounded-2xl text-center ${fadeInUp} delay-200`}>
                      <Crown className="mx-auto text-gray-400 mb-3" size={32} />
                      <h3 className="font-medium text-gray-900 mb-2">No Master Shop Set</h3>
                      <p className="text-gray-600 mb-4">Set one of your shops as master to create a network</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {shops.filter(s => s.role === 'owner').map(shop => (
                          <button
                            key={shop._id}
                            onClick={() => setMasterShopAPI(shop._id)}
                            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-all duration-300 text-sm hover-lift"
                          >
                            Set "{shop.name}" as Master
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Connected Shops */}
                  <div className={`${fadeInUp} delay-400`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Building className="text-blue-500 mr-2" size={20} />
                      Connected Shops ({shops.filter(s => s.role !== 'owner').length})
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {shops.filter(s => s.role !== 'owner').map((shop, index) => (
                        <div key={shop._id} className={`bg-blue-50 rounded-2xl p-6 border border-blue-200 hover-lift ${fadeInUp}`} style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Building className="text-blue-600" size={16} />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{shop.name}</h4>
                                <p className="text-sm text-gray-600">Connected to: {masterShop?.name || 'Master Shop'}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Status</p>
                              <div className="flex items-center space-x-1">
                                <div className={`w-2 h-2 rounded-full ${shop.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="font-medium">{shop.isActive ? 'Active' : 'Inactive'}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-500">Type</p>
                              <p className="font-medium capitalize">{shop.businessType}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {shops.filter(s => s.role !== 'owner').length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Building className="mx-auto mb-3" size={32} />
                        <p>No connected shops yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Independent Shops */}
                <div className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 ${fadeInUp} delay-600`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Store className="text-gray-500 mr-2" size={20} />
                    Independent Shops ({shops.filter(s => s.role === 'owner').length})
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shops.filter(s => s.role === 'owner').map((shop, index) => (
                      <div key={shop._id} className={`bg-gray-50 rounded-2xl p-4 border border-gray-200 hover-lift ${fadeInUp}`} style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Store className="text-gray-600" size={14} />
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm">{shop.name}</h4>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => setMasterShopAPI(shop._id)}
                              className="p-1 text-yellow-600 hover:bg-yellow-100 rounded text-xs transition-all duration-300"
                              title="Set as Master"
                            >
                              <Crown size={12} />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-2">{shop.address?.city}, {shop.address?.region}</p>
                        <div className="text-xs text-gray-500 capitalize">
                          {shop.businessType}
                        </div>
                      </div>
                    ))}
                  </div>

                  {shops.filter(s => s.role === 'owner').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Store className="mx-auto mb-3" size={32} />
                      <p>No independent shops</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                {/* Current Shop Settings */}
                <div className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 ${fadeInUp}`}>
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
                        <div className={`${fadeInUp} delay-100`}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
                          <p className="text-gray-900 font-medium">{currentShop?.name || 'No current shop'}</p>
                        </div>
                        <div className={`${fadeInUp} delay-200`}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                          <p className="text-gray-900 capitalize">{currentShop?.businessType || 'Not specified'}</p>
                        </div>
                        <div className={`${fadeInUp} delay-300`}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <p className="text-gray-900">{currentShop?.phone || 'Not provided'}</p>
                        </div>
                        <div className={`${fadeInUp} delay-400`}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <p className="text-gray-900">{currentShop?.email || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className={`${fadeInUp} delay-500`}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <p className="text-gray-700">{currentShop?.description || 'No description provided'}</p>
                      </div>
                      
                      <div className={`${fadeInUp} delay-600`}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <p className="text-gray-700">
                          {currentShop?.address ? 
                            `${currentShop.address.street || ''}, ${currentShop.address.city || ''}, ${currentShop.address.region || ''}` :
                            'No address provided'
                          }
                        </p>
                      </div>
                      
                      {currentShop && (
                        <button
                          onClick={() => setEditingShop(currentShop)}
                          className={`px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center space-x-2 hover-lift ${fadeInUp} delay-700`}
                        >
                          <Edit size={16} />
                          <span>Edit Shop</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Danger Zone */}
                {currentShop && (
                  <div className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 border-2 border-red-200 ${fadeInUp} delay-800`}>
                    <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-red-50 rounded-xl space-y-4 sm:space-y-0">
                        <div>
                          <h4 className="font-medium text-gray-900">Delete Shop</h4>
                          <p className="text-sm text-gray-600">Permanently delete this shop and all its data</p>
                        </div>
                        <button
                          onClick={() => setShowDeleteConfirm(currentShop)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 hover-lift"
                        >
                          Delete Shop
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateShopModal 
          onClose={() => setShowCreateModal(false)}
          onCreate={(shopData) => createShop(shopData)}
          loading={loading}
        />
      )}
      
      {showNetworkModal && (
        <NetworkModal 
          onClose={() => setShowNetworkModal(false)}
          shops={shops}
          masterShop={masterShop}
          connectToMaster={connectToMaster}
          loading={loading}
        />
      )}
      
      {showDeleteConfirm && (
        <DeleteConfirmModal 
          shop={showDeleteConfirm} 
          onCancel={() => setShowDeleteConfirm(null)}
          onDelete={deleteShop}
          loading={loading}
        />
      )}
      
      {showCreateUserModal && (
        <CreateUserModal 
          onClose={() => setShowCreateUserModal(false)}
          onCreate={createUser}
          newUser={newUser}
          setNewUser={setNewUser}
          loading={loading}
        />
      )}
      
      {/* Shop Details Modal */}
      {selectedShop && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`glass-card rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${scaleIn}`}>
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedShop.name}</h2>
                <button
                  onClick={() => setSelectedShop(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className={`${fadeInUp} delay-100`}>
                    <p className="text-sm font-medium text-gray-700">Business Type</p>
                    <p className="text-gray-900 capitalize">{selectedShop.businessType}</p>
                  </div>
                  <div className={`${fadeInUp} delay-200`}>
                    <p className="text-sm font-medium text-gray-700">Role</p>
                    <p className="text-gray-900 capitalize">{selectedShop.role}</p>
                  </div>
                  <div className={`${fadeInUp} delay-300`}>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-gray-900">{selectedShop.phone || 'Not provided'}</p>
                  </div>
                  <div className={`${fadeInUp} delay-400`}>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-900">{selectedShop.email || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className={`${fadeInUp} delay-500`}>
                  <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                  <p className="text-gray-700">{selectedShop.description || 'No description provided'}</p>
                </div>
                
                <div className={`${fadeInUp} delay-600`}>
                  <p className="text-sm font-medium text-gray-700 mb-2">Address</p>
                  <p className="text-gray-700">
                    {selectedShop.address ? (
                      <>
                        {selectedShop.address.street && `${selectedShop.address.street}`}<br />
                        {selectedShop.address.city && `${selectedShop.address.city}, `}
                        {selectedShop.address.region && `${selectedShop.address.region}`}<br />
                        {selectedShop.address.country}
                      </>
                    ) : (
                      'No address provided'
                    )}
                  </p>
                </div>
                
                <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-200 space-y-4 sm:space-y-0 ${fadeInUp} delay-700`}>
                  <div className="text-sm text-gray-500">
                    Status: <span className={`font-medium ${selectedShop.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedShop.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setEditingShop(selectedShop);
                        setSelectedShop(null);
                        setActiveTab('settings');
                      }}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 hover-lift"
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
  
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <Loader className="animate-spin text-black" size={24} />
              <span className="text-lg font-medium">Loading...</span>
            </div>
          </div>
        </div>
      )}
  
      {/* ChatBot */}
      <ChatBot 
        dashboardData={{
          todayStats: shopStats ? {
            revenue: 0,
            transactions: shopStats.dailySales || 0,
            averageOrderValue: 0
          } : null,
          inventory: {
            lowStockCount: 0,
            lowStockProducts: []
          },
          customers: {
            totalCustomers: shopStats?.totalCustomers || 0
          }
        }}
        isVisible={showChatBot}
        onClose={() => setShowChatBot(false)}
      />
  
      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChatBot(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-all duration-300 z-30 hover-lift ${bounceIn}`}
      >
        <Bot className="text-white w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    </div>
  );
};

export default ShopManagement;