import { useState, useEffect } from 'react';
import { 
  Search,
  Filter,
  Plus,
  Barcode,
  AlertCircle,
  MessageSquare,
  Package, 
  Bot
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// Import existing components
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatBot from '../components/ChatBot';

// Import product-specific components
import { 
  FilterPopup, 
  ProductCard, 
  FilterChips, 
  AddProductPopup,
  QRScanner,
  ProductDetails 
} from '../components/Product';

// API base URL
const API_BASE = 'https://retail360-backend.vercel.app';

const Products = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    lowStock: false,
    active: true,
    inactive: false,
    search: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData'));
  const shopId = userData?.currentShop?._id;
  const authToken = localStorage.getItem('authToken');

  // API Functions
  const fetchProducts = async () => {
    if (!shopId) {
      toast.error('No shop selected');
      return [];
    }

    try {
      setIsLoading(true);
      let url = `${API_BASE}/api/products/shop/${shopId}?`;
      
      // Add query parameters based on filters
      if (filters.search) url += `search=${filters.search}&`;
      if (filters.lowStock) url += `lowStock=true&`;
      if (filters.category) url += `category=${filters.category}&`;
      if (!filters.active && filters.inactive) url += `active=false&`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      setError('Failed to load products. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (!shopId) {
      toast.error('No shop selected');
      return [];
    }

    try {
      const response = await fetch(`${API_BASE}/api/categories/shop/${shopId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      setError('Failed to load categories. Please try again.');
      return [];
    }
  };

  const createProduct = async (productData) => {
    if (!shopId) {
      toast.error('No shop selected');
      return null;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          ...productData,
          shopId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      setError(error.message || 'Failed to create product');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      setError(error.message || 'Failed to update product');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getProductByQR = async (qrCode) => {
    try {
      const response = await fetch(`${API_BASE}/api/products/qr/${qrCode}?shopId=${shopId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch product');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch product');
    }
  };

  const deleteProduct = async (productId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete product');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock dashboard data for ChatBot
  const dashboardData = {
    todayStats: {
      revenue: 1250.75,
      transactions: 23,
      averageOrderValue: 54.38
    },
    inventory: {
      lowStockCount: products.filter(p => p.stock.currentQuantity <= p.stock.minQuantity).length,
      lowStockProducts: products.filter(p => p.stock.currentQuantity <= p.stock.minQuantity)
    },
    customers: {
      totalCustomers: 145
    }
  };

  // Handler for filter changes
  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({
        category: '',
        lowStock: false,
        active: true,
        inactive: false,
        search: ''
      });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  // Effect to load products and categories
  useEffect(() => {
    const fetchData = async () => {
      if (!shopId) {
        setError('No shop selected. Please select a shop first.');
        return;
      }

      try {
        setIsLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        
        setCategories(categoriesData);
        setProducts(productsData);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [shopId, filters]);

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    // Apply search filter
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    // Apply category filter
    if (filters.category && product.category?._id !== filters.category) {
      return false;
    }
    // Apply low stock filter
    if (filters.lowStock && product.stock?.currentQuantity > product.stock?.minQuantity) {
      return false;
    }
    // Apply active/inactive filters
    if (filters.active && !filters.inactive && !product.isActive) {
      return false;
    }
    if (filters.inactive && !filters.active && product.isActive) {
      return false;
    }
    if (!filters.active && !filters.inactive) {
      return false;
    }
    return true;
  });

  const handleCreateProduct = async (productData) => {
    const newProduct = await createProduct(productData);
    if (newProduct) {
      setProducts([...products, newProduct]);
      toast.success('Product created successfully');
      return true;
    }
    return false;
  };

  const handleUpdateProduct = async (productId, productData) => {
    const updatedProduct = await updateProduct(productId, productData);
    if (updatedProduct) {
      setProducts(products.map(p => 
        p._id === productId ? updatedProduct : p
      ));
      toast.success('Product updated successfully');
      return true;
    }
    return false;
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p._id !== productId));
      toast.success('Product deleted successfully');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
  
        {/* Sidebar - Fixed positioning with proper z-index and responsive behavior */}
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
      
      {/* Main content area - Adjusted for sidebar with responsive margins */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} ml-0`}>
        {/* Navbar - Fixed at top with proper z-index and responsive positioning */}
        <div className="fixed top-0 right-0 left-0 lg:left-auto z-30 transition-all duration-300" style={{ left: sidebarOpen ? '0' : '0' }}>
          <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} ml-0`}>
            <Navbar 
              onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
              title={'Products'}
            />
          </div>
        </div>

        {/* Main Content - Added top padding to account for fixed navbar */}
        <main className="p-3 sm:p-4 lg:p-6 flex-1 overflow-y-auto pt-20 lg:pt-24">
          {/* Header Section - Responsive padding and text sizes */}
          <div className="mb-6 lg:mb-8">
            <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-sm">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Products</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your product inventory efficiently</p>
              
              {/* Quick Stats - Responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
                <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-blue-600 font-medium">Total Products</p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-900">{products.length}</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="text-blue-600" size={20} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 sm:p-6 border border-orange-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-orange-600 font-medium">Low Stock</p>
                      <p className="text-xl sm:text-2xl font-bold text-orange-900">
                        {products.filter(p => p.stock?.currentQuantity <= p.stock?.minQuantity).length}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="text-orange-600" size={20} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 sm:p-6 border border-green-100 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-green-600 font-medium">Active Products</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-900">
                        {products.filter(p => p.isActive).length}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section - Responsive layout */}
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                    <Search size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 sm:gap-4">
                <button 
                  onClick={() => setShowFilterPopup(true)}
                  className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 active:bg-gray-200 transition-all flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                >
                  <Filter size={18} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Filter</span>
                  {(filters.category || filters.lowStock || filters.inactive) && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </button>
                
                <button
                  onClick={() => setShowAddProductPopup(true)}
                  className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                >
                  <Plus size={18} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Add Product</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="space-y-4">
            <FilterChips 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3 text-red-800">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <p className="font-medium text-sm sm:text-base">{error}</p>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

          {/* Products Grid - Responsive grid columns */}
          <div className="mt-6 sm:mt-8">
            {!isLoading && filteredProducts.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 max-w-md mx-auto shadow-sm">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Package size={28} className="sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-sm sm:text-base text-gray-600">Try adjusting your search or filters</p>
                  <button
                    onClick={() => setShowAddProductPopup(true)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Product
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Bottom padding for floating buttons */}
          <div className="h-20 sm:h-24"></div>
        </main>
      </div>

      {/* Floating Action Buttons - Responsive positioning and sizing */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 flex flex-col gap-3 sm:gap-4 z-40">
        {/* ChatBot Button */}
        <button
          onClick={() => setShowChatBot(prev => !prev)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
        >
          <Bot className="text-white w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* QR Scanner Button */}
        <button
          onClick={() => setShowQRScanner(true)}
          className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all flex items-center justify-center shadow-lg"
        >
          <Barcode size={24} className="sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* ChatBot Component */}
      <ChatBot
        dashboardData={dashboardData}
        isVisible={showChatBot}
        onClose={() => setShowChatBot(false)}
      />

      {/* All Popups */}
      <FilterPopup
        isOpen={showFilterPopup}
        onClose={() => setShowFilterPopup(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
        isLoading={isLoading}
      />
      
      <AddProductPopup
        isOpen={showAddProductPopup}
        onClose={() => setShowAddProductPopup(false)}
        onCreate={handleCreateProduct}
        categories={categories}
        isLoading={isLoading}
      />

      {/* QR Scanner */}
      {showQRScanner && (
        <QRScanner
          onScan={async (qrCode) => {
            try {
              const product = await getProductByQR(qrCode);
              setSelectedProduct(product);
              setShowQRScanner(false);
            } catch (error) {
              setError('Failed to find product. Please try again.');
              setShowQRScanner(false);
            }
          }}
          onClose={() => setShowQRScanner(false)}
        />
      )}

      {/* Product Details */}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={async (updatedProduct) => {
            const success = await handleUpdateProduct(selectedProduct._id, updatedProduct);
            if (success) {
              setSelectedProduct(null);
            }
          }}
          onDelete={async () => {
            const success = await handleDeleteProduct(selectedProduct._id);
            if (success) {
              setSelectedProduct(null);
            }
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default Products;