import React, { useState } from 'react';
import { Search, Filter, ArrowUp, ArrowDown, Package, Calendar, User, FileText, MessageCircle, Bot } from 'lucide-react';

// Import existing components
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatBot from '../components/ChatBot.jsx';

const StockMovements = () => {
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedReason, setSelectedReason] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for existing components
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatBotVisible, setChatBotVisible] = useState(false);

  // Mock dashboard data for components
  const dashboardData = {
    todayStats: {
      revenue: 2456.50,
      transactions: 15,
      averageOrderValue: 163.77
    },
    inventory: {
      lowStockCount: 3,
      lowStockProducts: [
        { name: "Coca Cola 500ml" },
        { name: "Sprite 500ml" }
      ]
    },
    customers: {
      totalCustomers: 247
    }
  };

  // Mock data for stock movements
  const movements = [
    {
      id: "mov_123",
      product: { name: "Coca Cola 500ml" },
      type: "out",
      quantity: 2,
      previousQuantity: 52,
      newQuantity: 50,
      reason: "sale",
      reference: "sale_123",
      user: { name: "John Doe" },
      createdAt: "2024-01-15T14:30:00Z"
    },
    {
      id: "mov_124",
      product: { name: "Sprite 500ml" },
      type: "in",
      quantity: 24,
      previousQuantity: 6,
      newQuantity: 30,
      reason: "restock",
      reference: "purchase_456",
      user: { name: "Jane Smith" },
      createdAt: "2024-01-15T13:45:00Z"
    },
    {
      id: "mov_125",
      product: { name: "Fanta Orange 500ml" },
      type: "out",
      quantity: 5,
      previousQuantity: 15,
      newQuantity: 10,
      reason: "adjustment",
      reference: "adj_789",
      user: { name: "Mike Johnson" },
      createdAt: "2024-01-15T12:20:00Z"
    },
    {
      id: "mov_126",
      product: { name: "Water 1L" },
      type: "in",
      quantity: 50,
      previousQuantity: 20,
      newQuantity: 70,
      reason: "delivery",
      reference: "del_321",
      user: { name: "Sarah Wilson" },
      createdAt: "2024-01-15T11:15:00Z"
    },
    {
      id: "mov_127",
      product: { name: "Energy Drink 250ml" },
      type: "out",
      quantity: 12,
      previousQuantity: 48,
      newQuantity: 36,
      reason: "sale",
      reference: "sale_124",
      user: { name: "Emma Davis" },
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "mov_128",
      product: { name: "Juice Box 200ml" },
      type: "in",
      quantity: 100,
      previousQuantity: 25,
      newQuantity: 125,
      reason: "delivery",
      reference: "del_322",
      user: { name: "Tom Anderson" },
      createdAt: "2024-01-15T09:45:00Z"
    }
  ];

  const products = ['all', 'Coca Cola 500ml', 'Sprite 500ml', 'Fanta Orange 500ml', 'Water 1L', 'Energy Drink 250ml', 'Juice Box 200ml'];
  const types = ['all', 'in', 'out'];
  const reasons = ['all', 'sale', 'restock', 'adjustment', 'delivery', 'return'];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getMovementIcon = (type) => {
    return type === 'in' ? (
      <ArrowUp className="w-5 h-5 text-green-600" />
    ) : (
      <ArrowDown className="w-5 h-5 text-red-600" />
    );
  };

  const getMovementColor = (type) => {
    return type === 'in' ? 'text-green-600' : 'text-red-600';
  };

  const getReasonBadgeColor = (reason) => {
    const colors = {
      'sale': 'bg-blue-100 text-blue-800',
      'restock': 'bg-green-100 text-green-800',
      'adjustment': 'bg-yellow-100 text-yellow-800',
      'delivery': 'bg-purple-100 text-purple-800',
      'return': 'bg-orange-100 text-orange-800'
    };
    return colors[reason] || 'bg-gray-100 text-gray-800';
  };

  const filteredMovements = movements.filter(movement => {
    const matchesProduct = selectedProduct === 'all' || movement.product.name === selectedProduct;
    const matchesType = selectedType === 'all' || movement.type === selectedType;
    const matchesReason = selectedReason === 'all' || movement.reason === selectedReason;
    const matchesSearch = movement.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesProduct && matchesType && matchesReason && matchesSearch;
  });

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
           title="Stock Movements" 
          />
        </div>


        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mt-1 p-5">Track all inventory changes and transactions</p>
              </div>
             
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, users, references..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                />
              </div>

              {/* Filter Chips */}
              <div className="flex flex-wrap gap-4">
                {/* Product Filter */}
                <div>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white"
                  >
                    {products.map(product => (
                      <option key={product} value={product}>
                        {product === 'all' ? 'All Products' : product}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {types.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        selectedType === type
                          ? 'bg-black text-white'
                          : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      {type === 'all' ? 'All Types' : type === 'in' ? 'Stock In' : 'Stock Out'}
                    </button>
                  ))}
                </div>

                {/* Reason Filter */}
                <div>
                  <select
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white"
                  >
                    {reasons.map(reason => (
                      <option key={reason} value={reason}>
                        {reason === 'all' ? 'All Reasons' : reason.charAt(0).toUpperCase() + reason.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Movements List */}
          <div className="space-y-4">
            {filteredMovements.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No movements found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              filteredMovements.map((movement) => (
                <div key={movement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Movement Type Icon */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        movement.type === 'in' ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        {getMovementIcon(movement.type)}
                      </div>

                      {/* Movement Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-black truncate">
                            {movement.product.name}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReasonBadgeColor(movement.reason)}`}>
                            {movement.reason.charAt(0).toUpperCase() + movement.reason.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">Quantity:</span>
                            <span className={`font-semibold ${getMovementColor(movement.type)}`}>
                              {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">Stock Change:</span>
                            <span className="text-black font-medium">
                              {movement.previousQuantity} → {movement.newQuantity}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{movement.user.name}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(movement.createdAt)}</span>
                          </div>

                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <FileText className="w-4 h-4" />
                            <span>{movement.reference}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-xs text-gray-500 italic flex items-center justify-center">
              Powered by
              <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" fill="#10b981"/>
                <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="ml-1">BootCode</span>
            </p>
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
          className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
             >
               <Bot className="text-white w-6 h-6" />
      </button>
    </div>
  );
};

export default StockMovements;