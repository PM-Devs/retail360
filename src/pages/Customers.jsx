import React, { useState } from 'react';
import { Search, Plus, User, Phone, Mail, MapPin, Star, ShoppingBag, Edit, Award, ArrowLeft, MessageCircle ,Bot} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatBot from '../components/ChatBot.jsx';

const Retail360CustomerApp = () => {
  const [currentPage, setCurrentPage] = useState('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatBotVisible, setChatBotVisible] = useState(false);

  // Mock dashboard data for the welcome modal and chatbot
  const dashboardData = {
    todayStats: {
      revenue: 1250.50,
      transactions: 28,
      averageOrderValue: 44.66
    },
    customers: {
      totalCustomers: 156
    },
    inventory: {
      lowStockCount: 3,
      lowStockProducts: [
        { name: 'iPhone Cases' },
        { name: 'Wireless Chargers' }
      ]
    }
  };

  // Mock data for customers
  const mockCustomers = [
    {
      id: "cust_123",
      name: "Jane Smith",
      phone: "+233987654321",
      email: "jane@example.com",
      address: "456 Oak Street, Accra",
      loyalty: {
        points: 150,
        membershipTier: "silver",
        totalSpent: 500.00
      },
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "cust_124",
      name: "John Doe",
      phone: "+233555123456",
      email: "john@example.com",
      address: "123 Main Street, Kumasi",
      loyalty: {
        points: 75,
        membershipTier: "bronze",
        totalSpent: 250.00
      },
      createdAt: "2024-01-15T00:00:00Z"
    },
    {
      id: "cust_125",
      name: "Mary Johnson",
      phone: "+233777888999",
      email: "mary@example.com",
      address: "789 Elm Avenue, Tema",
      loyalty: {
        points: 320,
        membershipTier: "gold",
        totalSpent: 1200.00
      },
      createdAt: "2024-02-01T00:00:00Z"
    }
  ];

  const mockPurchaseHistory = [
    { id: 1, date: "2024-07-20", amount: 45.50, items: 3 },
    { id: 2, date: "2024-07-15", amount: 78.20, items: 5 },
    { id: 3, date: "2024-07-10", amount: 32.00, items: 2 },
  ];

  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    loyaltyPoints: 0
  });

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const getTierColor = (tier) => {
    switch(tier) {
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };



  const CustomerCard = ({ customer, onClick }) => (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(customer)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{customer.name}</h3>
            <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
              <Phone size={14} />
              <span>{customer.phone}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(customer.loyalty.membershipTier)}`}>
            <Award size={12} className="mr-1" />
            {customer.loyalty.membershipTier}
          </div>
          <p className="text-sm text-gray-600 mt-1">{customer.loyalty.points} points</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Mail size={14} />
          <span>{customer.email}</span>
        </div>
        <span>GHS {customer.loyalty.totalSpent.toFixed(2)} spent</span>
      </div>
    </div>
  );

  const CustomersListPage = () => (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button 
          onClick={() => setCurrentPage('search')}
          className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
        >
          Phone Search
        </button>
      </div>

      <div className="grid gap-4">
        {filteredCustomers.map(customer => (
          <CustomerCard 
            key={customer.id} 
            customer={customer} 
            onClick={(customer) => {
              setSelectedCustomer(customer);
              setCurrentPage('details');
            }}
          />
        ))}
      </div>

      <button
        onClick={() => setCurrentPage('add')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
      >
        <Plus size={24} />
      </button>
    </div>
  );

  const AddCustomerPage = () => (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={customerForm.name}
              onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={customerForm.phone}
              onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+233XXXXXXXXX"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="customer@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={customerForm.address}
              onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter customer address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Loyalty Points
            </label>
            <input
              type="number"
              value={customerForm.loyaltyPoints}
              onChange={(e) => setCustomerForm({...customerForm, loyaltyPoints: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setCurrentPage('customers')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            Save Customer
          </button>
        </div>
      </div>
    </div>
  );

  const CustomerDetailsPage = () => (
    <div className="p-6 space-y-6">
      {/* Customer Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedCustomer?.name}</h2>
              <p className="text-gray-600">Customer since {new Date(selectedCustomer?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Edit size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-gray-400" />
            <span className="text-gray-700">{selectedCustomer?.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-gray-400" />
            <span className="text-gray-700">{selectedCustomer?.email}</span>
          </div>
          <div className="flex items-center gap-3 md:col-span-2">
            <MapPin size={18} className="text-gray-400" />
            <span className="text-gray-700">{selectedCustomer?.address}</span>
          </div>
        </div>
      </div>

      {/* Loyalty Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Loyalty Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {selectedCustomer?.loyalty.points}
            </div>
            <div className="text-sm text-gray-600">Points Balance</div>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTierColor(selectedCustomer?.loyalty.membershipTier)}`}>
              <Award size={16} className="mr-2" />
              {selectedCustomer?.loyalty.membershipTier?.toUpperCase()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Membership Tier</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              GHS {selectedCustomer?.loyalty.totalSpent.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <button className="flex-1 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">
            Add Points
          </button>
          <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
            Redeem Points
          </button>
        </div>
      </div>

      {/* Purchase History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase History</h3>
        <div className="space-y-3">
          {mockPurchaseHistory.map(purchase => (
            <div key={purchase.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingBag size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Purchase #{purchase.id}</p>
                  <p className="text-sm text-gray-600">{purchase.date} • {purchase.items} items</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">GHS {purchase.amount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CustomerSearchPage = () => {
    const [phoneSearch, setPhoneSearch] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const handleSearch = () => {
      const customer = mockCustomers.find(c => c.phone === phoneSearch);
      setSearchResult(customer || false);
    };

    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Search by Phone Number</h3>
          <div className="flex gap-4">
            <input
              type="tel"
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              placeholder="+233XXXXXXXXX"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </div>

        {searchResult === null && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Phone size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Enter a phone number to search for customers</p>
          </div>
        )}

        {searchResult === false && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-4">
              <User size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Not Found</h3>
              <p className="text-gray-600 mb-4">No customer found with phone number: {phoneSearch}</p>
            </div>
            <button
              onClick={() => {
                setCustomerForm({...customerForm, phone: phoneSearch});
                setCurrentPage('add');
              }}
              className="w-full px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              Add New Customer
            </button>
          </div>
        )}

        {searchResult && searchResult !== false && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Found</h3>
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
            title={getPageTitle()}
          />
        </div>


        {/* Back Button for sub-pages */}
        {currentPage !== 'customers' && (
          <div className="p-6 pb-0">
            <button
              onClick={handleBackNavigation}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Customers</span>
            </button>
          </div>
        )}

        {/* Page Content */}
        <div className="min-h-screen p-8">
          {currentPage === 'customers' && <CustomersListPage />}
          {currentPage === 'add' && <AddCustomerPage />}
          {currentPage === 'details' && <CustomerDetailsPage />}
          {currentPage === 'search' && <CustomerSearchPage />}
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
            className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
              >
                <Bot className="text-white w-6 h-6" />
      </button>
    </div>
  );
};

export default Retail360CustomerApp;