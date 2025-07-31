import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Plus, Minus, X, CreditCard, Banknote, Smartphone, Receipt, Printer, Share2, QrCode, Camera, User, MapPin, Mail, Phone, Bot } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatBot from '../components/ChatBot';

const BASE_API = 'https://retail360-backend.vercel.app';

const POS = () => {
  const [currentPage, setCurrentPage] = useState('pos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  
  // State for integrated components
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatBotOpen, setChatBotOpen] = useState(false);

  // Mobile responsiveness state
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);

  // Data states
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);

  // User data from localStorage
  const [userData, setUserData] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Check for mobile/tablet screen sizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Initialize user data and fetch initial data
  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem('userData');
      const storedAuthToken = localStorage.getItem('authToken');

      if (storedUserData && storedAuthToken) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        setAuthToken(storedAuthToken);
      }
    } catch (err) {
      console.error('Error parsing userData from localStorage:', err);
    }
  }, []);

  // Fetch data when user data is available
  useEffect(() => {
    if (userData?.currentShop?._id && authToken) {
      fetchProducts();
      fetchCustomers();
      fetchDashboardData();
    }
  }, [userData, authToken]);

  // API helper function
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${BASE_API}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiCall(`/api/products/shop/${userData.currentShop._id}`);
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const searchProducts = async (query) => {
    if (!query.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      const response = await apiCall('/api/products/search', {
        method: 'POST',
        body: JSON.stringify({ 
          query, 
          shopId: userData.currentShop._id
        })
      });
      
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to search products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch product by barcode
  const fetchProductByBarcode = async (barcode) => {
    try {
      const response = await apiCall(`/api/products/barcode/${barcode}`);
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('Failed to fetch product by barcode:', error);
      return null;
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await apiCall(`/api/customers/shop/${userData.currentShop._id}`);
      if (response.success) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  // Create customer
  const createCustomer = async (customerData) => {
    try {
      const response = await apiCall('/api/customers', {
        method: 'POST',
        body: JSON.stringify({ 
          ...customerData, 
          shopId: userData.currentShop._id
        })
      });
      
      if (response.success) {
        setCustomers([...customers, response.data]);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw error;
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await apiCall(`/api/dashboard/${userData.currentShop._id}`);
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  // Create sale
  const createSale = async (saleData) => {
    try {
      const response = await apiCall('/api/sales', {
        method: 'POST',
        body: JSON.stringify(saleData)
      });
      
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('Failed to create sale:', error);
      throw error;
    }
  };

  // Update product stock
  const updateProductStock = async (stockUpdates) => {
    try {
      const response = await apiCall('/api/products/stock', {
        method: 'PUT',
        body: JSON.stringify(stockUpdates)
      });
      
      return response.success;
    } catch (error) {
      console.error('Failed to update stock:', error);
      return false;
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchProducts(searchQuery);
      } else {
        fetchProducts();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.barcode && product.barcode.includes(searchQuery))
  );

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.product === product._id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.product === product._id
          ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
          : item
      ));
    } else {
      setCartItems([...cartItems, {
        product: product._id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.pricing.sellingPrice,
        totalPrice: product.pricing.sellingPrice
      }]);
    }

    // Show cart on mobile after adding item
    if (isMobile) {
      setShowMobileCart(true);
    }
  };

  const handleBarcodeSearch = async (barcode) => {
    try {
      const product = await fetchProductByBarcode(barcode);
      if (product) {
        addToCart(product);
        setSearchQuery('');
        setShowScanModal(false);
      } else {
        alert('Product not found with barcode: ' + barcode);
      }
    } catch (error) {
      alert('Failed to search product by barcode');
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.product !== productId));
    } else {
      setCartItems(cartItems.map(item =>
        item.product === productId
          ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice }
          : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.product !== productId));
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const addNewCustomer = async () => {
    if (newCustomer.name && newCustomer.phone) {
      try {
        const customer = await createCustomer(newCustomer);
        setSelectedCustomer(customer);
        setNewCustomer({ name: '', phone: '', email: '', address: '' });
        setShowCustomerModal(false);
      } catch (error) {
        alert('Failed to create customer');
      }
    }
  };

  const processSale = async () => {
    if (cartItems.length === 0) return;
    
    try {
      setLoading(true);
      const totals = calculateTotals();
      const paid = parseFloat(amountPaid) || totals.total;
      const change = paid - totals.total;

      const saleData = {
        shopId: userData.currentShop._id,
        customerId: selectedCustomer?._id,
        cashier: userData.id,
        items: cartItems.map(item => ({
          product: item.product,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        totals,
        payment: {
          method: paymentMethod,
          amount: paid,
          change: Math.max(0, change),
          status: 'completed'
        }
      };

      const sale = await createSale(saleData);
      
      // Update stock
      const stockUpdates = cartItems.map(item => ({
        productId: item.product,
        quantitySold: item.quantity
      }));
      
      await updateProductStock(stockUpdates);
      
      // Clear cart after sale
      setCartItems([]);
      setSelectedCustomer(null);
      setAmountPaid('');
      setShowMobileCart(false);
      
      // Show receipt
      setSelectedSale(sale);
      setCurrentPage('receipt');
      
      alert('Sale processed successfully!');
      
      // Refresh data
      fetchProducts();
      fetchDashboardData();
      
    } catch (error) {
      alert('Failed to process sale');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => `GHS ${amount?.toFixed(2) || '0.00'}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  // Scanner Modal Component
  const ScannerModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-sm md:max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Scan Product</h3>
          <button
            onClick={() => setShowScanModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <Camera className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-4">Position barcode/QR code in the camera view</p>
          </div>
          
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Or enter barcode manually:</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter barcode..."
                className="flex-1 p-2 md:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    handleBarcodeSearch(e.target.value);
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.target.parentElement.querySelector('input');
                  if (input.value) {
                    handleBarcodeSearch(input.value);
                  }
                }}
                className="bg-black text-white px-3 md:px-4 py-2 md:py-3 rounded-lg hover:bg-gray-800 text-sm md:text-base"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Customer Modal Component
  const CustomerModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-sm md:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Customer</h3>
          <button
            onClick={() => setShowCustomerModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
              className="w-full p-2 md:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
              placeholder="Customer name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              type="tel"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
              className="w-full p-2 md:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
              placeholder="+233..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
              className="w-full p-2 md:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
              placeholder="customer@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
              className="w-full p-2 md:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
              placeholder="Customer address"
              rows="2"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowCustomerModal(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 md:py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              onClick={addNewCustomer}
              className="flex-1 bg-black text-white py-2 md:py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm md:text-base"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Customer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Cart Modal
  const MobileCartModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 lg:hidden">
      <div className="bg-white rounded-t-2xl w-full h-5/6 overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart ({cartItems.length})
            </h2>
            <button
              onClick={() => setShowMobileCart(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {/* Customer Section */}
          <div className="mb-4">
            <div className="flex space-x-2">
              <select
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCustomer?._id || ''}
                onChange={(e) => setSelectedCustomer(customers.find(c => c._id === e.target.value))}
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowCustomerModal(true)}
                className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {selectedCustomer && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <User className="w-4 h-4 text-blue-600 mt-1" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">{selectedCustomer.name}</p>
                    <p className="text-blue-700 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {selectedCustomer.phone}
                    </p>
                    {selectedCustomer.email && (
                      <p className="text-blue-700 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {selectedCustomer.email}
                      </p>
                    )}
                    {selectedCustomer.address && (
                      <p className="text-blue-700 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {selectedCustomer.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="mb-6">
            {cartItems.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-900">{item.productName}</h4>
                      <p className="text-xs text-gray-500">{formatCurrency(item.unitPrice)} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product)}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right text-sm font-medium ml-4">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Totals & Payment - Fixed at bottom */}
        {cartItems.length > 0 && (
          <div className="border-t bg-white p-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(calculateTotals().subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-medium">{formatCurrency(calculateTotals().tax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatCurrency(calculateTotals().total)}</span>
              </div>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-lg flex flex-col items-center justify-center text-sm ${
                      paymentMethod === 'cash' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Banknote className="w-5 h-5 mb-1" />
                    Cash
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-lg flex flex-col items-center justify-center text-sm ${
                      paymentMethod === 'card' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-1" />
                    Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('mobile')}
                    className={`p-3 rounded-lg flex flex-col items-center justify-center text-sm ${
                      paymentMethod === 'mobile' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mb-1" />
                    Mobile
                  </button>
                </div>
              </div>

              {paymentMethod === 'cash' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount..."
                  />
                  {amountPaid && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-600">Change: </span>
                      <span className="font-medium">
                        {formatCurrency(Math.max(0, parseFloat(amountPaid) - calculateTotals().total))}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={processSale}
              className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
              disabled={loading || (paymentMethod === 'cash' && (!amountPaid || parseFloat(amountPaid) < calculateTotals().total))}
            >
              <Receipt className="w-5 h-5 mr-2" />
              {loading ? 'Processing...' : 'Complete Sale'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // POS Page Component
  const POSPage = () => (
    <div className={`${isMobile ? 'block' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'} h-full`}>
      {/* Products Section */}
      <div className={`${isMobile ? 'mb-4' : 'lg:col-span-2'} bg-white rounded-lg p-3 md:p-6`}>
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
              <input
                type="text"
                placeholder="Search products or scan barcode..."
                className="w-full pl-8 md:pl-10 pr-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={async (e) => {
                  if (e.key === 'Enter' && searchQuery) {
                    // Check if it's a barcode
                    const product = await fetchProductByBarcode(searchQuery);
                    if (product) {
                      addToCart(product);
                      setSearchQuery('');
                    }
                  }
                }}
              />
            </div>
            <button
              onClick={() => setShowScanModal(true)}
              className="bg-black text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center text-sm md:text-base"
            >
              <QrCode className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Scan
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 max-h-64 md:max-h-96 overflow-y-auto">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => addToCart(product)}
            >
              <div className="mb-2 md:mb-3">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-12 md:h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-12 md:h-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-start mb-1 md:mb-2">
                <h3 className="font-medium text-gray-900 text-xs md:text-sm leading-tight">{product.name}</h3>
                <span className="text-sm md:text-lg font-bold text-gray-900 ml-1">{formatCurrency(product.pricing.sellingPrice)}</span>
              </div>
              {/* FIX: Access currentQuantity property */}
              <div className="text-xs text-gray-500 mb-1 md:mb-2">Stock: {product.stock?.currentQuantity || 0}</div>
              <div className="flex justify-between items-center">
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  {product.category?.name || 'Uncategorized'}
                </span>
                <span className="text-xs text-gray-400 hidden md:inline">{product.barcode || 'N/A'}</span>
              </div>
            </div>
          ))}
          
          {!loading && filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Cart Section */}
      {!isMobile && (
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart ({cartItems.length})
            </h2>
          </div>

          {/* Customer Section */}
          <div className="mb-4">
            <div className="flex space-x-2">
              <select
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCustomer?._id || ''}
                onChange={(e) => setSelectedCustomer(customers.find(c => c._id === e.target.value))}
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowCustomerModal(true)}
                className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {selectedCustomer && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <User className="w-4 h-4 text-blue-600 mt-1" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">{selectedCustomer.name}</p>
                    <p className="text-blue-700 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {selectedCustomer.phone}
                    </p>
                    {selectedCustomer.email && (
                      <p className="text-blue-700 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {selectedCustomer.email}
                      </p>
                    )}
                    {selectedCustomer.address && (
                      <p className="text-blue-700 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {selectedCustomer.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="mb-6 max-h-48 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-900">{item.productName}</h4>
                      <p className="text-xs text-gray-500">{formatCurrency(item.unitPrice)} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product)}
                        className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right text-sm font-medium ml-4">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals & Payment */}
          <div className="border-t pt-4">
            <div className="space-y-2 mb-4">
              {cartItems.length > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(calculateTotals().subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">{formatCurrency(calculateTotals().tax)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(calculateTotals().total)}</span>
                  </div>
                </>
              )}
            </div>

            {cartItems.length > 0 && (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-3 rounded-lg flex flex-col items-center justify-center text-sm ${
                          paymentMethod === 'cash' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Banknote className="w-5 h-5 mb-1" />
                        Cash
                      </button>
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-lg flex flex-col items-center justify-center text-sm ${
                          paymentMethod === 'card' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 mb-1" />
                        Card
                      </button>
                      <button
                        onClick={() => setPaymentMethod('mobile')}
                        className={`p-3 rounded-lg flex flex-col items-center justify-center text-sm ${
                          paymentMethod === 'mobile' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Smartphone className="w-5 h-5 mb-1" />
                        Mobile
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'cash' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                      <input
                        type="number"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter amount..."
                      />
                      {amountPaid && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-600">Change: </span>
                          <span className="font-medium">
                            {formatCurrency(Math.max(0, parseFloat(amountPaid) - calculateTotals().total))}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={processSale}
                  className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                  disabled={loading || (paymentMethod === 'cash' && (!amountPaid || parseFloat(amountPaid) < calculateTotals().total))}
                >
                  <Receipt className="w-5 h-5 mr-2" />
                  {loading ? 'Processing...' : 'Complete Sale'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile Cart Button */}
      {isMobile && (
        <div className="fixed bottom-20 right-4 z-20">
          <button
            onClick={() => setShowMobileCart(true)}
            className="bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors relative"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );

  // Receipt Page Component
  const ReceiptPage = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-lg p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 md:mb-8 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-2">Sales Receipt</h2>
          <p className="text-gray-600">{selectedSale?.saleNumber}</p>
          <p className="text-gray-600">{selectedSale && formatDate(selectedSale.createdAt)}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => window.print()}
            className="bg-gray-100 text-gray-600 px-3 md:px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center"
          >
            <Printer className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={() => {/* Handle share */}}
            className="bg-gray-100 text-gray-600 px-3 md:px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center"
          >
            <Share2 className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {selectedSale && (
        <>
          <div className="border-t border-b py-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Customer</h3>
                <p>{selectedSale.customer?.name || 'Walk-in Customer'}</p>
                <p>{selectedSale.customer?.phone || 'N/A'}</p>
                {selectedSale.customer?.email && <p>{selectedSale.customer.email}</p>}
              </div>
              <div className="sm:text-right">
                <h3 className="font-medium mb-2">Payment</h3>
                <p className="capitalize">{selectedSale.payment?.method}</p>
                <p>{selectedSale.payment?.status}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm md:text-base">Item</th>
                  <th className="text-right py-2 text-sm md:text-base">Qty</th>
                  <th className="text-right py-2 text-sm md:text-base">Price</th>
                  <th className="text-right py-2 text-sm md:text-base">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedSale.items?.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 text-sm md:text-base">{item.product?.name || item.productName}</td>
                    <td className="text-right text-sm md:text-base">{item.quantity}</td>
                    <td className="text-right text-sm md:text-base">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right text-sm md:text-base">{formatCurrency(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm md:text-base">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(selectedSale.totals?.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm md:text-base">
              <span className="text-gray-600">Tax</span>
              <span>{formatCurrency(selectedSale.totals?.tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(selectedSale.totals?.total)}</span>
            </div>
            {selectedSale.payment?.method === 'cash' && selectedSale.payment?.change > 0 && (
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-gray-600">Change</span>
                <span>{formatCurrency(selectedSale.payment.change)}</span>
              </div>
            )}
          </div>
        </>
      )}

      <div className="mt-8">
        <button
          onClick={() => {
            setCurrentPage('pos');
            setSelectedSale(null);
          }}
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"
        >
          New Sale
        </button>
      </div>
    </div>
  );

  if (!userData || !authToken) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!userData.currentShop) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No shop selected. Please select a shop to continue.</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - Responsive positioning */}
      <div className={`${isMobile ? 'fixed' : 'fixed'} left-0 top-0 h-full z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} ${isMobile && !sidebarOpen ? 'hidden' : ''}`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Sidebar overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main content area - Responsive margins */}
      <div className={`flex-1 transition-all duration-300 ${!isMobile && sidebarOpen ? 'ml-64' : !isMobile ? 'ml-20' : 'ml-0'}`}>
        {/* Navbar - Responsive positioning */}
        <div className={`fixed top-0 right-0 z-30 transition-all duration-300 ${!isMobile && sidebarOpen ? 'left-64' : !isMobile ? 'left-20' : 'left-0'}`}>
          <Navbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            title={currentPage === 'pos' ? 'Point of Sale' : 'Receipt'}
          />
        </div>
        
        {/* Main Content - Responsive padding */}
        <main className="pt-16 p-3 md:p-6 min-h-screen pb-20 md:pb-6">
          {showScanModal && <ScannerModal />}
          {showCustomerModal && <CustomerModal />}
          {showMobileCart && <MobileCartModal />}
          {currentPage === 'pos' ? <POSPage /> : <ReceiptPage />}
        </main>
      </div>
      
      {/* ChatBot */}
      <ChatBot 
        dashboardData={dashboardData} 
        isVisible={chatBotOpen} 
        onClose={() => setChatBotOpen(false)}
      />
      
      {/* Chatbot toggle button - Responsive positioning */}
      <button 
        onClick={() => setChatBotOpen(true)}
        className={`fixed ${isMobile ? 'bottom-6 left-6' : 'bottom-6 right-6'} w-12 h-12 md:w-14 md:h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30`}
      >
        <Bot className="text-white w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );
};

export default POS;