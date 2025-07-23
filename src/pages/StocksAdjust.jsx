import React, { useState } from 'react';
import { Search, Package, Plus, Minus, AlertCircle, Check, Bot} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatBot from '../components/ChatBot.jsx';

const StockAdjustment = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [adjustment, setAdjustment] = useState({
    quantity: '',
    type: 'increase',
    reason: '',
    notes: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Component states for the integrated components
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false);

  // Mock products data
  const products = [
    { id: 1, name: 'Coca Cola 500ml', currentStock: 50, price: 2.50 },
    { id: 2, name: 'Sprite 500ml', currentStock: 30, price: 2.50 },
    { id: 3, name: 'Fanta Orange 500ml', currentStock: 10, price: 2.50 },
    { id: 4, name: 'Water 1L', currentStock: 70, price: 1.50 },
    { id: 5, name: 'Energy Drink 330ml', currentStock: 25, price: 3.00 },
    { id: 6, name: 'Juice Box Apple', currentStock: 40, price: 1.75 }
  ];

  // Mock dashboard data for the components
  const dashboardData = {
    todayStats: {
      revenue: 2500.00,
      transactions: 85,
      averageOrderValue: 29.41
    },
    customers: {
      totalCustomers: 342
    },
    inventory: {
      lowStockCount: 3,
      lowStockProducts: [
        { name: 'Fanta Orange 500ml' },
        { name: 'Energy Drink 330ml' }
      ]
    }
  };

  const reasons = [
    { value: 'damaged', label: 'Damaged/Expired' },
    { value: 'theft', label: 'Theft/Loss' },
    { value: 'recount', label: 'Stock Recount' },
    { value: 'return', label: 'Customer Return' },
    { value: 'promotion', label: 'Promotional Give-away' },
    { value: 'other', label: 'Other' }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSearchTerm('');
  };

  const handleAdjustmentChange = (field, value) => {
    setAdjustment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateNewStock = () => {
    if (!selectedProduct || !adjustment.quantity) return selectedProduct?.currentStock || 0;
    
    const qty = parseInt(adjustment.quantity);
    if (adjustment.type === 'increase') {
      return selectedProduct.currentStock + qty;
    } else {
      return Math.max(0, selectedProduct.currentStock - qty);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mock API call
    console.log('Stock adjustment:', {
      productId: selectedProduct.id,
      adjustment: adjustment,
      previousStock: selectedProduct.currentStock,
      newStock: calculateNewStock()
    });

    // Show success message
    setShowSuccess(true);
    
    // Reset form after delay
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedProduct(null);
      setAdjustment({
        quantity: '',
        type: 'increase',
        reason: '',
        notes: ''
      });
    }, 2000);
  };

  const isFormValid = selectedProduct && adjustment.quantity && adjustment.reason;

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
          title="Stock Adjustment" 
          />
        </div>
       
        
        {/* Page Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showSuccess && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-green-800 font-semibold">Adjustment Successful!</h3>
                  <p className="text-green-700 text-sm">Stock levels have been updated successfully.</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Product Selection */}
            {!selectedProduct ? (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-black mb-4">Select Product</h2>
                
                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for a product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-black hover:shadow-sm transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-black">{product.name}</h3>
                          <p className="text-gray-600 text-sm">Current Stock: {product.currentStock}</p>
                          <p className="text-gray-500 text-sm">${product.price.toFixed(2)}</p>
                        </div>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Package className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Adjustment Form */
              <div>
                {/* Selected Product Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-black">{selectedProduct.name}</h2>
                        <p className="text-gray-600">Current Stock: {selectedProduct.currentStock} units</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      className="text-gray-500 hover:text-black transition-colors"
                    >
                      Change Product
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Adjustment Type */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-3">
                      Adjustment Type
                    </label>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => handleAdjustmentChange('type', 'increase')}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                          adjustment.type === 'increase'
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Increase Stock</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustmentChange('type', 'decrease')}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                          adjustment.type === 'decrease'
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        <Minus className="w-4 h-4" />
                        <span>Decrease Stock</span>
                      </button>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-black mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      value={adjustment.quantity}
                      onChange={(e) => handleAdjustmentChange('quantity', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      placeholder="Enter quantity"
                      required
                    />
                  </div>

                  {/* Stock Preview */}
                  {adjustment.quantity && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Stock Change Preview:</span>
                        <span className="font-semibold text-black">
                          {selectedProduct.currentStock} → {calculateNewStock()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Reason */}
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-black mb-2">
                      Reason for Adjustment *
                    </label>
                    <select
                      id="reason"
                      value={adjustment.reason}
                      onChange={(e) => handleAdjustmentChange('reason', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      required
                    >
                      <option value="">Select a reason</option>
                      {reasons.map(reason => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-black mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      rows="3"
                      value={adjustment.notes}
                      onChange={(e) => handleAdjustmentChange('notes', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none"
                      placeholder="Add any additional details about this adjustment..."
                    />
                  </div>

                  {/* Warning for large decreases */}
                  {adjustment.type === 'decrease' && parseInt(adjustment.quantity) > selectedProduct.currentStock && (
                    <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-red-800 font-medium text-sm">Stock will reach zero</h4>
                        <p className="text-red-700 text-sm">This adjustment will reduce stock below zero. The final stock will be set to 0.</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSubmit}
                      disabled={!isFormValid}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                        isFormValid
                          ? 'bg-black text-white hover:bg-gray-800'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Apply Stock Adjustment
                    </button>
                  </div>
                </div>
              </div>
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

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChatBot(true)}
         className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
            >
              <Bot className="text-white w-6 h-6" />
      </button>

    
      
      <ChatBot 
        dashboardData={dashboardData} 
        isVisible={showChatBot} 
        onClose={() => setShowChatBot(false)} 
      />
    </div>
  );
};

export default StockAdjustment;