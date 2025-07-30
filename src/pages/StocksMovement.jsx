// Updated StockMovements.jsx with API integration
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ArrowUp, ArrowDown, Package, Calendar, User, FileText, MessageCircle, Bot, PlusCircle } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatBot from '../components/ChatBot.jsx';

const StockMovements = () => {
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedReason, setSelectedReason] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatBotVisible, setChatBotVisible] = useState(false);
  const [movements, setMovements] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMovement, setNewMovement] = useState({ product: '', shopId: '', type: 'in', quantity: 0, reason: '' });

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

  const baseAPI = 'https://retail360-backend.vercel.app';

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      const res = await axios.get(`${baseAPI}/api/stock/movements/65d8f8a5b4d6f8a5b4d6f8c2?limit=50`);
      if (res.data.success) {
        const mockMovements = res.data.data.map((item, i) => ({
          id: `mov_${i}`,
          product: { name: 'Sample Product' },
          type: item.type,
          quantity: item.quantity,
          previousQuantity: 0,
          newQuantity: item.quantity,
          reason: 'sale',
          reference: 'ref_001',
          user: { name: 'Auto Bot' },
          createdAt: item.createdAt
        }));
        setMovements(mockMovements);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMovement = async () => {
    try {
      const res = await axios.post(`${baseAPI}/api/stock/movements`, newMovement);
      if (res.data.success) {
        setShowAddModal(false);
        fetchMovements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();
  const getMovementIcon = (type) => type === 'in' ? <ArrowUp className="w-5 h-5 text-green-600" /> : <ArrowDown className="w-5 h-5 text-red-600" />;
  const getMovementColor = (type) => type === 'in' ? 'text-green-600' : 'text-red-600';
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

  const filteredMovements = movements.filter(m => {
    const matchesProduct = selectedProduct === 'all' || m.product.name === selectedProduct;
    const matchesType = selectedType === 'all' || m.type === selectedType;
    const matchesReason = selectedReason === 'all' || m.reason === selectedReason;
    const matchesSearch = m.product.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProduct && matchesType && matchesReason && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
       {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        {/* Navbar */}
        <div className={`fixed top-0 right-0 z-30 transition-all duration-300 ${
          sidebarOpen ? 'lg:left-64' : 'lg:left-20'
        } left-0`}>
          <Navbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            title={'Stocks Movement'}
          />
        </div>

        <div className="p-4 sm:p-6 lg:p-8 mt-16">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">Track all inventory changes and transactions</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              <PlusCircle className="w-4 h-4" /> Add Movement
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <select onChange={(e) => setSelectedType(e.target.value)} className="p-2 border rounded">
                  <option value="all">All Types</option>
                  <option value="in">Stock In</option>
                  <option value="out">Stock Out</option>
                </select>
                <select onChange={(e) => setSelectedReason(e.target.value)} className="p-2 border rounded">
                  <option value="all">All Reasons</option>
                  <option value="sale">Sale</option>
                  <option value="restock">Restock</option>
                  <option value="adjustment">Adjustment</option>
                  <option value="delivery">Delivery</option>
                  <option value="return">Return</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredMovements.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No movements found</h3>
              </div>
            ) : (
              filteredMovements.map(m => (
                <div key={m.id} className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${m.type === 'in' ? 'bg-green-50' : 'bg-red-50'}`}>{getMovementIcon(m.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{m.product.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${getReasonBadgeColor(m.reason)}`}>{m.reason}</span>
                      </div>
                      <p className={getMovementColor(m.type)}>{m.type === 'in' ? '+' : '-'}{m.quantity}</p>
                      <div className="text-xs text-gray-500 flex justify-between">
                        <span><User className="inline-block w-3 h-3 mr-1" /> {m.user.name}</span>
                        <span><Calendar className="inline-block w-3 h-3 mr-1" /> {formatDate(m.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ChatBot dashboardData={dashboardData} isVisible={chatBotVisible} onClose={() => setChatBotVisible(false)} />

      <button onClick={() => setChatBotVisible(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 z-30">
        <Bot className="text-white w-6 h-6" />
      </button>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add Stock Movement</h2>
            <input placeholder="Product ID" value={newMovement.product} onChange={(e) => setNewMovement({ ...newMovement, product: e.target.value })} className="w-full mb-3 p-2 border rounded" />
            <input placeholder="Shop ID" value={newMovement.shopId} onChange={(e) => setNewMovement({ ...newMovement, shopId: e.target.value })} className="w-full mb-3 p-2 border rounded" />
            <select value={newMovement.type} onChange={(e) => setNewMovement({ ...newMovement, type: e.target.value })} className="w-full mb-3 p-2 border rounded">
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
            </select>
            <input type="number" placeholder="Quantity" value={newMovement.quantity} onChange={(e) => setNewMovement({ ...newMovement, quantity: parseInt(e.target.value) })} className="w-full mb-3 p-2 border rounded" />
            <input placeholder="Reason" value={newMovement.reason} onChange={(e) => setNewMovement({ ...newMovement, reason: e.target.value })} className="w-full mb-3 p-2 border rounded" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={handleAddMovement} className="px-4 py-2 bg-black text-white rounded">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockMovements;