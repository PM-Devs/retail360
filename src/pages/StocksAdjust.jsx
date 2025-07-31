// StockAdjustment.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Package, Plus, Minus, AlertCircle, Check, Bot, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatBot from '../components/ChatBot.jsx';

const BASE_API = 'https://retail360-backend.vercel.app';

const StockAdjustment = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [adjustment, setAdjustment] = useState({ quantity: '', type: 'increase', reason: '', notes: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [adjustmentError, setAdjustmentError] = useState('');
  const successTimeout = useRef(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        
        // Get shopId from localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.currentShop || !userData.currentShop._id) {
          throw new Error('Shop information not found');
        }
        const shopId = userData.currentShop._id;
        
        const response = await axios.get(`${BASE_API}/api/products/shop/${shopId}`);
        // Access response.data.data instead of response.data
        const productsData = response.data.data || [];
        
        // Map products to expected format
        const mappedProducts = productsData.map(product => ({
          ...product,
          id: product._id,  // Use _id as id
          currentStock: product.stock.currentQuantity, // Map stock.currentQuantity to currentStock
          price: product.pricing.sellingPrice // Map pricing.sellingPrice to price
        }));
        
        setProducts(mappedProducts);
        setError('');
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();

    // Cleanup function
    return () => {
      if (successTimeout.current) {
        clearTimeout(successTimeout.current);
      }
    };
  }, []);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

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

  const handleProductSelect = product => {
    setSelectedProduct(product);
    setSearchTerm('');
    setAdjustmentError(''); // Reset previous errors
  };

  const handleAdjustmentChange = (field, value) => {
    if (field === 'quantity') {
      // Ensure quantity is positive integer
      const numValue = parseInt(value);
      if ( !isNaN(numValue) ){
        setAdjustment(prev => ({ ...prev, [field]: Math.max(0, numValue).toString() })
      );
      }
      
      else if (numValue === '') {
        setAdjustment(prev => ({ ...prev, [field]: '' }));
      }
    }
    
    
    else {
      setAdjustment(prev => ({ ...prev, [field]: value }));
    }
  };

  const calculateNewStock = () => {
    if (!selectedProduct || adjustment.quantity === '') return selectedProduct?.currentStock || 0;
    
    const qty = parseInt(adjustment.quantity);
    if (isNaN(qty)) return selectedProduct.currentStock;
    
    return adjustment.type === 'increase' ? 
      selectedProduct.currentStock + qty : 
      Math.max(0, selectedProduct.currentStock - qty);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setAdjustmentError('');
    
    // Validate form
    if (!selectedProduct) {
      setAdjustmentError('Please select a product');
      return;
    }
    
    if (!adjustment.quantity || parseInt(adjustment.quantity) <= 0) {
      setAdjustmentError('Please enter a valid quantity');
      return;
    }
    
    if (!adjustment.reason) {
      setAdjustmentError('Please select a reason');
      return;
    }
    
    try {
      setLoading(true);
      const payload = {
        quantity: adjustment.type === 'increase' ? 
          parseInt(adjustment.quantity) : 
          -parseInt(adjustment.quantity),
        reason: adjustment.reason,
        notes: adjustment.notes
      };
      
      const response = await axios.post(
        `${BASE_API}/api/stock/adjust/${selectedProduct.id}`, 
        payload
      );
      
      if (response.data.success) {
        setShowSuccess(true);
        successTimeout.current = setTimeout(() => {
          setShowSuccess(false);
          setSelectedProduct(null);
          setAdjustment({ quantity: '', type: 'increase', reason: '', notes: '' });
          
          // Refresh product data with shopId from localStorage
          const userData = JSON.parse(localStorage.getItem('userData'));
          if (userData && userData.currentShop && userData.currentShop._id) {
            const shopId = userData.currentShop._id;
            axios.get(`${BASE_API}/api/products/shop/${shopId}`)
              .then(res => {
                // Map refreshed products to expected format
                const refreshedProducts = (res.data.data || []).map(product => ({
                  ...product,
                  id: product._id,
                  currentStock: product.stock.currentQuantity,
                  price: product.pricing.sellingPrice
                }));
                setProducts(refreshedProducts);
              })
              .catch(console.error);
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Stock adjustment failed:', err);
      setAdjustmentError('Failed to adjust stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = selectedProduct && adjustment.quantity && adjustment.reason;

  return (
    <div className={`min-h-screen bg-gray-50 ${sidebarOpen ? 'lg:overflow-auto overflow-hidden' : ''}`}>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} ${sidebarOpen ? 'lg:block' : 'lg:block'} ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Navbar */}
      <div className="fixed top-0 right-0 left-0 z-30 transition-all duration-300" style={{ left: sidebarOpen ? '0' : '0' }}>
        <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} ml-0`}>
          <Navbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            title={'Stock Adjustment'}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} ml-0 pt-24`}>
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

          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-red-800 font-semibold">Error Loading Data</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {!selectedProduct ? (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-black mb-4">Select Product</h2>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for a product..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                
                {productsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <Package className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Products Available</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      There are currently no products in inventory. Add products first to manage stock.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <button
                          key={product.id}
                          onClick={() => handleProductSelect(product)}
                          className="p-4 border border-gray-200 rounded-lg hover:border-black hover:shadow-sm text-left transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-black">{product.name}</h3>
                              <p className="text-gray-600 text-sm">Current Stock: {product.currentStock}</p>
                              <p className="text-gray-500 text-sm">GHs{product.price.toFixed(2)}</p>
                            </div>
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Package className="w-4 h-4 text-gray-600" />
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8">
                        <div className="mx-auto bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                          <Search className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No Products Found</h3>
                        <p className="text-gray-500">
                          No products match your search. Try a different search term.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-black">{selectedProduct.name}</h2>
                      <p className="text-gray-600">Current Stock: {selectedProduct.currentStock}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedProduct(null)} 
                    className="text-gray-500 hover:text-black transition-colors"
                  >
                    Change Product
                  </button>
                </div>

                <div className="flex bg-gray-100 rounded-lg p-1">
                  {['increase', 'decrease'].map(type => (
                    <button
                      key={type}
                      onClick={() => handleAdjustmentChange('type', type)}
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                        adjustment.type === type 
                          ? 'bg-black text-white' 
                          : 'text-gray-600 hover:text-black hover:bg-gray-200'
                      }`}
                    >
                      {type === 'increase' ? 
                        <Plus className="w-4 h-4 mr-1" /> : 
                        <Minus className="w-4 h-4 mr-1" />}
                      {type === 'increase' ? 'Increase Stock' : 'Decrease Stock'}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={adjustment.quantity}
                  onChange={e => handleAdjustmentChange('quantity', e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />

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

                <select
                  value={adjustment.reason}
                  onChange={e => handleAdjustmentChange('reason', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select a reason</option>
                  {reasons.map(r => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>

                <textarea
                  rows="3"
                  value={adjustment.notes}
                  onChange={e => handleAdjustmentChange('notes', e.target.value)}
                  placeholder="Additional notes..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-black focus:border-transparent"
                />

                {adjustmentError && (
                  <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-red-800 font-medium text-sm">Error</h4>
                      <p className="text-red-700 text-sm">{adjustmentError}</p>
                    </div>
                  </div>
                )}

                {adjustment.type === 'decrease' && parseInt(adjustment.quantity) > selectedProduct.currentStock && (
                  <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-red-800 font-medium text-sm">Stock will reach zero</h4>
                      <p className="text-red-700 text-sm">This adjustment will reduce stock below zero. Final stock will be 0.</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid || loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isFormValid 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adjusting...
                    </span>
                  ) : (
                    'Apply Stock Adjustment'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <button 
        onClick={() => setShowChatBot(true)} 
        className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 z-30 transition-colors"
      >
        <Bot className="text-white w-6 h-6" />
      </button>

      <ChatBot isVisible={showChatBot} onClose={() => setShowChatBot(false)} />
    </div>
  );
};

export default StockAdjustment;