import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Phone, Mail, MapPin, Star, ShoppingBag, Edit, Award, ArrowLeft, MessageCircle, Bot, X, AlertCircle, Check, Loader } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatBot from '../components/ChatBot.jsx';

// API Base URL
const API_BASE = 'https://retail360-backend.vercel.app';

// Notification Component
const Notification = ({ type, message, onClose }) => (
  <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
    type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
  }`}>
    {type === 'success' ? (
      <Check className="text-green-600" size={20} />
    ) : (
      <AlertCircle className="text-red-600" size={20} />
    )}
    <span className={`text-sm font-medium ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
      {message}
    </span>
    <button onClick={onClose} className="ml-2">
      <X size={16} className={type === 'success' ? 'text-green-600' : 'text-red-600'} />
    </button>
  </div>
);

// Customer Card Component
const CustomerCard = ({ customer, onClick }) => {
  const getTierColor = (tier) => {
    switch(tier?.toLowerCase()) {
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(customer)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={16} className="sm:hidden text-blue-600" />
            <User size={20} className="hidden sm:block text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{customer.name}</h3>
            <div className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm mt-1">
              <Phone size={12} className="sm:hidden" />
              <Phone size={14} className="hidden sm:block" />
              <span className="truncate">{customer.phone}</span>
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <div className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(customer.loyalty?.membershipTier)}`}>
            <Award size={10} className="mr-1 sm:hidden" />
            <Award size={12} className="mr-1 hidden sm:block" />
            <span className="hidden sm:inline">{customer.loyalty?.membershipTier || 'bronze'}</span>
            <span className="sm:hidden">{(customer.loyalty?.membershipTier || 'bronze').charAt(0).toUpperCase()}</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">{customer.loyalty?.points || 0} pts</p>
        </div>
      </div>
      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-600">
        <div className="flex items-center gap-1 min-w-0">
          <Mail size={12} className="sm:hidden flex-shrink-0" />
          <Mail size={14} className="hidden sm:block flex-shrink-0" />
          <span className="truncate">{customer.email || 'No email'}</span>
        </div>
        <span className="text-right sm:flex-shrink-0">GHS {(customer.loyalty?.totalSpent || 0).toFixed(2)} spent</span>
      </div>
    </div>
  );
};

// Edit Customer Modal
const EditCustomerModal = ({ selectedCustomer, editForm, setEditForm, setShowEditModal, updateCustomer, loading }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Customer</h3>
          <button onClick={() => setShowEditModal(false)}>
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={editForm.name || ''}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={editForm.email || ''}
              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={editForm.address?.city || ''}
              onChange={(e) => setEditForm({
                ...editForm, 
                address: { ...editForm.address, city: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowEditModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => updateCustomer(selectedCustomer._id, editForm)}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? <Loader className="animate-spin mx-auto" size={16} /> : 'Save'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Points Modal
const PointsModal = ({ 
  selectedCustomer, 
  pointsAction, 
  pointsForm, 
  setPointsForm, 
  setShowPointsModal, 
  updateCustomerLoyalty, 
  loading 
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl max-w-md w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {pointsAction === 'add' ? 'Add' : 'Redeem'} Loyalty Points
          </h3>
          <button onClick={() => setShowPointsModal(false)}>
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
            <input
              type="number"
              value={pointsForm.points}
              onChange={(e) => setPointsForm({...pointsForm, points: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>
          
          {pointsAction === 'add' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Spent (GHS)</label>
              <input
                type="number"
                step="0.01"
                value={pointsForm.totalSpent}
                onChange={(e) => setPointsForm({...pointsForm, totalSpent: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
          )}
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowPointsModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => updateCustomerLoyalty(selectedCustomer._id, pointsForm)}
            disabled={loading || pointsForm.points <= 0}
            className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? <Loader className="animate-spin mx-auto" size={16} /> : 
              (pointsAction === 'add' ? 'Add Points' : 'Redeem Points')}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Customers List Page
const CustomersListPage = ({ 
  searchQuery, 
  setSearchQuery, 
  fetchCustomers, 
  setCurrentPage, 
  loading, 
  filteredCustomers, 
  setSelectedCustomer 
}) => (
  <div className="p-4 sm:p-6">
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
      <div className="flex-1 relative">
        <Search size={18} className="sm:hidden absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Search size={20} className="hidden sm:block absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search customers by name or phone..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value) {
              fetchCustomers(e.target.value);
            } else {
              fetchCustomers();
            }
          }}
          className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        />
      </div>
      <button 
        onClick={() => setCurrentPage('search')}
        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
      >
        Phone Search
      </button>
    </div>

    {loading && (
      <div className="flex justify-center items-center py-8">
        <Loader className="animate-spin" size={32} />
      </div>
    )}

    {!loading && (
      <div className="grid gap-3 sm:gap-4">
        {filteredCustomers.map(customer => (
          <CustomerCard 
            key={customer._id} 
            customer={customer} 
            onClick={(customer) => {
              setSelectedCustomer(customer);
              setCurrentPage('details');
            }}
          />
        ))}
        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'No customers found matching your search' : 'No customers found'}
          </div>
        )}
      </div>
    )}

    <button
      onClick={() => setCurrentPage('add')}
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center z-20"
    >
      <Plus size={20} className="sm:hidden" />
      <Plus size={24} className="hidden sm:block" />
    </button>
  </div>
);

// Add Customer Page
const AddCustomerPage = ({ 
  customerForm, 
  setCustomerForm, 
  setCurrentPage, 
  createCustomer, 
  loading 
}) => (
  <div className="p-4 sm:p-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={customerForm.name}
            onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
            className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter customer name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={customerForm.phone}
            onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
            className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="+233XXXXXXXXX"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={customerForm.email}
            onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
            className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="customer@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={customerForm.address.city}
            onChange={(e) => setCustomerForm({
              ...customerForm, 
              address: { ...customerForm.address, city: e.target.value }
            })}
            className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter city"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
        <button
          onClick={() => setCurrentPage('customers')}
          className="flex-1 px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
        >
          Cancel
        </button>
        <button
          onClick={() => createCustomer(customerForm)}
          disabled={loading || !customerForm.name || !customerForm.phone}
          className="flex-1 px-6 py-2.5 sm:py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base disabled:opacity-50"
        >
          {loading ? <Loader className="animate-spin mx-auto" size={16} /> : 'Save Customer'}
        </button>
      </div>
    </div>
  </div>
);

// Customer Details Page
const CustomerDetailsPage = ({ 
  selectedCustomer, 
  setEditForm, 
  setShowEditModal, 
  setPointsAction, 
  setPointsForm, 
  setShowPointsModal 
}) => {
  const getTierColor = (tier) => {
    switch(tier?.toLowerCase()) {
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Customer Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={20} className="sm:hidden text-blue-600" />
              <User size={24} className="hidden sm:block text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{selectedCustomer?.name}</h2>
              <p className="text-sm sm:text-base text-gray-600">Customer since {new Date(selectedCustomer?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setEditForm({
                name: selectedCustomer?.name || '',
                email: selectedCustomer?.email || '',
                address: selectedCustomer?.address || {}
              });
              setShowEditModal(true);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <Edit size={18} className="sm:hidden text-gray-600" />
            <Edit size={20} className="hidden sm:block text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <Phone size={16} className="sm:hidden text-gray-400 flex-shrink-0" />
            <Phone size={18} className="hidden sm:block text-gray-400 flex-shrink-0" />
            <span className="text-sm sm:text-base text-gray-700 truncate">{selectedCustomer?.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={16} className="sm:hidden text-gray-400 flex-shrink-0" />
            <Mail size={18} className="hidden sm:block text-gray-400 flex-shrink-0" />
            <span className="text-sm sm:text-base text-gray-700 truncate">{selectedCustomer?.email || 'No email'}</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={16} className="sm:hidden text-gray-400 flex-shrink-0 mt-0.5" />
            <MapPin size={18} className="hidden sm:block text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm sm:text-base text-gray-700 break-words">{selectedCustomer?.address?.city || 'No address'}</span>
          </div>
        </div>
      </div>

      {/* Loyalty Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Loyalty Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
              {selectedCustomer?.loyalty?.points || 0}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Points Balance</div>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getTierColor(selectedCustomer?.loyalty?.membershipTier)}`}>
              <Award size={14} className="sm:hidden mr-1" />
              <Award size={16} className="hidden sm:block mr-2" />
              {(selectedCustomer?.loyalty?.membershipTier || 'bronze').toUpperCase()}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">Membership Tier</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
              GHS {(selectedCustomer?.loyalty?.totalSpent || 0).toFixed(2)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Total Spent</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
          <button 
            onClick={() => {
              setPointsAction('add');
              setPointsForm({ points: 0, totalSpent: 0 });
              setShowPointsModal(true);
            }}
            className="flex-1 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base"
          >
            Add Points
          </button>
          <button 
            onClick={() => {
              setPointsAction('redeem');
              setPointsForm({ points: 0, totalSpent: 0 });
              setShowPointsModal(true);
            }}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
          >
            Redeem Points
          </button>
        </div>
      </div>

      {/* Purchase History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Purchase History</h3>
        <div className="text-center py-8 text-gray-500">
          <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
          <p>Purchase history integration coming soon</p>
        </div>
      </div>
    </div>
  );
};

// Customer Search Page
const CustomerSearchPage = ({ 
  searchCustomerByPhone, 
  setCustomerForm, 
  customerForm, 
  setCurrentPage, 
  setSelectedCustomer 
}) => {
  const [phoneSearch, setPhoneSearch] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!phoneSearch.trim()) return;
    
    setSearching(true);
    const customer = await searchCustomerByPhone(phoneSearch);
    setSearchResult(customer || false);
    setSearching(false);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Search by Phone Number</h3>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="tel"
            value={phoneSearch}
            onChange={(e) => setPhoneSearch(e.target.value)}
            placeholder="+233XXXXXXXXX"
            className="flex-1 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={searching || !phoneSearch.trim()}
            className="px-6 py-2.5 sm:py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base whitespace-nowrap disabled:opacity-50"
          >
            {searching ? <Loader className="animate-spin mx-auto" size={16} /> : 'Search'}
          </button>
        </div>
      </div>

      {searchResult === null && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
          <Phone size={40} className="sm:hidden text-gray-400 mx-auto mb-4" />
          <Phone size={48} className="hidden sm:block text-gray-400 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">Enter a phone number to search for customers</p>
        </div>
      )}

      {searchResult === false && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="text-center mb-4">
            <User size={40} className="sm:hidden text-gray-400 mx-auto mb-4" />
            <User size={48} className="hidden sm:block text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Customer Not Found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">No customer found with phone number: {phoneSearch}</p>
          </div>
          <button
            onClick={() => {
              setCustomerForm({...customerForm, phone: phoneSearch});
              setCurrentPage('add');
            }}
            className="w-full px-6 py-2.5 sm:py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base"
          >
            Add New Customer
          </button>
        </div>
      )}

      {searchResult && searchResult !== false && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Customer Found</h3>
          <CustomerCard 
            customer={searchResult} 
            onClick={(customer) => {
              setSelectedCustomer(customer);
              setCurrentPage('details');
            }}
          />
        </div>
      )}
    </div>
  );
};

// Main Component
const Retail360CustomerApp = () => {
  const [currentPage, setCurrentPage] = useState('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatBotVisible, setChatBotVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [pointsAction, setPointsAction] = useState('add'); // 'add' or 'redeem'
  const [success, setSuccess] = useState(null);

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const getAuthToken = () => localStorage.getItem('authToken');

  // Fixed function to get current shop ID
  const getCurrentShopId = () => {
    const userData = getUserData();
    // Handle both cases: currentShop as object or as ID string
    if (userData?.currentShop) {
      return typeof userData.currentShop === 'object' 
        ? userData.currentShop._id 
        : userData.currentShop;
    }
    return null;
  };

  // Form states
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: { city: '', street: '', region: '' },
    loyaltyPoints: 0
  });
  const [editForm, setEditForm] = useState({});
  const [pointsForm, setPointsForm] = useState({ points: 0, totalSpent: 0 });

  // Dashboard data for chatbot
  const dashboardData = {
    todayStats: {
      revenue: 1250.50,
      transactions: 28,
      averageOrderValue: 44.66
    },
    customers: {
      totalCustomers: customers.length
    },
    inventory: {
      lowStockCount: 3,
      lowStockProducts: [
        { name: 'iPhone Cases' },
        { name: 'Wireless Chargers' }
      ]
    }
  };

  // API Functions
  const apiCall = async (endpoint, options = {}) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  // Customer API functions
  const fetchCustomers = async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      const shopId = getCurrentShopId();
      if (!shopId) {
        throw new Error('No shop selected. Please check your login status.');
      }

      const searchParam = search ? `?search=${encodeURIComponent(search)}` : '';
      const data = await apiCall(`/api/customers/shop/${shopId}${searchParam}`);
      
      // Handle different response structures
      const customersList = data.customers || data.data || data || [];
      setCustomers(Array.isArray(customersList) ? customersList : []);
    } catch (error) {
      setError(`Failed to fetch customers: ${error.message}`);
      console.error('Error fetching customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const searchCustomerByPhone = async (phone) => {
    setLoading(true);
    try {
      const shopId = getCurrentShopId();
      if (!shopId) {
        throw new Error('No shop selected');
      }

      const data = await apiCall(`/api/customers/phone/${encodeURIComponent(phone)}?shopId=${shopId}`);
      return data.customer || data.data || null;
    } catch (error) {
      console.error('Error searching customer by phone:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData) => {
    setLoading(true);
    setError(null);
    try {
      const shopId = getCurrentShopId();
      if (!shopId) {
        throw new Error('No shop selected');
      }

      // Validate required fields
      if (!customerData.name?.trim()) {
        throw new Error('Customer name is required');
      }
      if (!customerData.phone?.trim()) {
        throw new Error('Customer phone is required');
      }

      const data = await apiCall('/api/customers', {
        method: 'POST',
        body: JSON.stringify({
          ...customerData,
          shopId,
          // Ensure address is properly structured
          address: {
            city: customerData.address?.city || '',
            street: customerData.address?.street || '',
            region: customerData.address?.region || ''
          }
        })
      });

      setSuccess('Customer created successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Reset form
      setCustomerForm({
        name: '',
        phone: '',
        email: '',
        address: { city: '', street: '', region: '' },
        loyaltyPoints: 0
      });
      
      // Refresh customers list
      fetchCustomers();
      setCurrentPage('customers');
      
      return data.customer || data.data;
    } catch (error) {
      setError(`Failed to create customer: ${error.message}`);
      console.error('Error creating customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (customerId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      if (!customerId) {
        throw new Error('Customer ID is required');
      }

      const data = await apiCall(`/api/customers/${customerId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      setSuccess('Customer updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Update selected customer if it's the one being edited
      if (selectedCustomer && selectedCustomer._id === customerId) {
        const updatedCustomer = data.customer || data.data || { ...selectedCustomer, ...updateData };
        setSelectedCustomer(updatedCustomer);
      }
      
      // Refresh customers list
      fetchCustomers();
      setShowEditModal(false);
      
      return data.customer || data.data;
    } catch (error) {
      setError(`Failed to update customer: ${error.message}`);
      console.error('Error updating customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomerLoyalty = async (customerId, loyaltyData) => {
    setLoading(true);
    setError(null);
    try {
      if (!customerId) {
        throw new Error('Customer ID is required');
      }

      const data = await apiCall(`/api/customers/${customerId}/loyalty`, {
        method: 'POST',
        body: JSON.stringify({
          action: pointsAction,
          points: loyaltyData.points,
          totalSpent: loyaltyData.totalSpent || 0
        })
      });

      setSuccess(`Loyalty points ${pointsAction === 'add' ? 'added' : 'redeemed'} successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      
      // Update selected customer
      if (selectedCustomer && selectedCustomer._id === customerId) {
        const updatedLoyalty = data.loyalty || data.data?.loyalty;
        setSelectedCustomer({ 
          ...selectedCustomer, 
          loyalty: updatedLoyalty || selectedCustomer.loyalty 
        });
      }
      
      // Refresh customers list
      fetchCustomers();
      setShowPointsModal(false);
      setPointsForm({ points: 0, totalSpent: 0 });
      
      return data;
    } catch (error) {
      setError(`Failed to ${pointsAction} loyalty points: ${error.message}`);
      console.error('Error updating loyalty:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.includes(searchQuery)
  );

  const getPageTitle = () => {
    switch(currentPage) {
      case 'add': return 'Add Customer';
      case 'details': return 'Customer Details';
      case 'search': return 'Customer Search';
      default: return 'Customers';
    }
  };

  const handleBackNavigation = () => {
    if (currentPage === 'add' || currentPage === 'search') {
      setCurrentPage('customers');
    } else if (currentPage === 'details') {
      setCurrentPage('customers');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      {success && (
        <Notification 
          type="success" 
          message={success} 
          onClose={() => setSuccess(null)} 
        />
      )}
      {error && (
        <Notification 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}

      {/* Modals */}
      {showEditModal && (
        <EditCustomerModal 
          selectedCustomer={selectedCustomer}
          editForm={editForm}
          setEditForm={setEditForm}
          setShowEditModal={setShowEditModal}
          updateCustomer={updateCustomer}
          loading={loading}
        />
      )}
      {showPointsModal && (
        <PointsModal 
          selectedCustomer={selectedCustomer}
          pointsAction={pointsAction}
          pointsForm={pointsForm}
          setPointsForm={setPointsForm}
          setShowPointsModal={setShowPointsModal}
          updateCustomerLoyalty={updateCustomerLoyalty}
          loading={loading}
        />
      )}

      {/* Sidebar - Fixed positioning with proper z-index */}
      <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main content area - Adjusted for sidebar */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Navbar - Fixed at top with proper z-index */}
        <div className={`fixed top-0 right-0 left-0 z-30 transition-all duration-300 ${sidebarOpen ? 'lg:left-64' : 'lg:left-20'}`}>
          <Navbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            title={getPageTitle()}
          />
        </div>

        {/* Page Content with top padding for fixed navbar */}
        <div className="pt-16 sm:pt-20">
          {/* Back Button for sub-pages */}
          {currentPage !== 'customers' && (
            <div className="p-4 sm:p-6 pb-0">
              <button
                onClick={handleBackNavigation}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft size={18} className="sm:hidden" />
                <ArrowLeft size={20} className="hidden sm:block" />
                <span>Back to Customers</span>
              </button>
            </div>
          )}

          {/* Page Content */}
          <div className="min-h-screen pb-20">
            {currentPage === 'customers' && (
              <CustomersListPage 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                fetchCustomers={fetchCustomers}
                setCurrentPage={setCurrentPage}
                loading={loading}
                filteredCustomers={filteredCustomers}
                setSelectedCustomer={setSelectedCustomer}
              />
            )}
            
            {currentPage === 'add' && (
              <AddCustomerPage 
                customerForm={customerForm}
                setCustomerForm={setCustomerForm}
                setCurrentPage={setCurrentPage}
                createCustomer={createCustomer}
                loading={loading}
              />
            )}
            
            {currentPage === 'details' && (
              <CustomerDetailsPage 
                selectedCustomer={selectedCustomer}
                setEditForm={setEditForm}
                setShowEditModal={setShowEditModal}
                setPointsAction={setPointsAction}
                setPointsForm={setPointsForm}
                setShowPointsModal={setShowPointsModal}
              />
            )}
            
            {currentPage === 'search' && (
              <CustomerSearchPage 
                searchCustomerByPhone={searchCustomerByPhone}
                setCustomerForm={setCustomerForm}
                customerForm={customerForm}
                setCurrentPage={setCurrentPage}
                setSelectedCustomer={setSelectedCustomer}
              />
            )}
          </div>
        </div>
      </div>

      {/* ChatBot */}
      <ChatBot 
        dashboardData={dashboardData}
        isVisible={chatBotVisible}
        onClose={() => setChatBotVisible(false)}
      />

      {/* Floating Chat Button */}
      <button
        onClick={() => setChatBotVisible(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
      >
        <Bot className="text-white w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};

export default Retail360CustomerApp;