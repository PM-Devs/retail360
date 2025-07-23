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

// API Functions
const getProductByQR = async (qrCode) => {
  try {
    const response = await fetch(`/api/products/qr/${qrCode}`);
    if (!response.ok) throw new Error('Product not found');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch product');
  }
};

const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to delete product');
  }
};

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

  // Effect to load products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockCategories = [
          { id: 'cat_123', name: 'Beverages' },
          { id: 'cat_124', name: 'Bakery' },
          { id: 'cat_125', name: 'Snacks' },
          { id: 'cat_126', name: 'Dairy' }
        ];

        const mockProducts = [
          {
            id: "prod_123",
            name: "Coca Cola 500ml",
            sku: "CC500ML",
            barcode: "1234567890123",
            category: {
              id: "cat_123",
              name: "Beverages"
            },
            pricing: {
              costPrice: 1.80,
              sellingPrice: 2.50,
              currency: "GHS"
            },
            stock: {
              currentQuantity: 5,
              minQuantity: 10
            },
            images: ["https://placeholder.co/400"],
            isActive: true
          },
          {
            id: "prod_124",
            name: "Bread Loaf",
            sku: "BREAD001",
            barcode: "1234567890124",
            category: {
              id: "cat_124",
              name: "Bakery"
            },
            pricing: {
              costPrice: 1.20,
              sellingPrice: 1.80,
              currency: "GHS"
            },
            stock: {
              currentQuantity: 15,
              minQuantity: 5
            },
            images: ["https://placeholder.co/400"],
            isActive: true
          },
          {
            id: "prod_125",
            name: "Milk 1L",
            sku: "MILK001",
            barcode: "1234567890125",
            category: {
              id: "cat_126",
              name: "Dairy"
            },
            pricing: {
              costPrice: 2.50,
              sellingPrice: 3.20,
              currency: "GHS"
            },
            stock: {
              currentQuantity: 3,
              minQuantity: 10
            },
            images: ["https://placeholder.co/400"],
            isActive: false
          },
          {
            id: "prod_126",
            name: "Potato Chips",
            sku: "CHIPS001",
            barcode: "1234567890126",
            category: {
              id: "cat_125",
              name: "Snacks"
            },
            pricing: {
              costPrice: 0.80,
              sellingPrice: 1.20,
              currency: "GHS"
            },
            stock: {
              currentQuantity: 25,
              minQuantity: 15
            },
            images: ["https://placeholder.co/400"],
            isActive: true
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCategories(mockCategories);
        setProducts(mockProducts);

      } catch (err) {
        setError('Failed to load products. Please try again.');
      
      }
    };

    fetchData();
  }, []);

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    // Apply search filter
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    // Apply category filter
    if (filters.category && product.category.id !== filters.category) {
      return false;
    }
    // Apply low stock filter
    if (filters.lowStock && product.stock.currentQuantity > product.stock.minQuantity) {
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
            title={ 'Products'}
          />
        </div>


          {/* Main Content */}
          <main className="p-6 flex-1 overflow-y-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
                <p className="text-gray-600">Manage your product inventory efficiently</p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Total Products</p>
                        <p className="text-2xl font-bold text-blue-900">{products.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="text-blue-600" size={24} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600 font-medium">Low Stock</p>
                        <p className="text-2xl font-bold text-orange-900">
                          {products.filter(p => p.stock.currentQuantity <= p.stock.minQuantity).length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <AlertCircle className="text-orange-600" size={24} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">Active Products</p>
                        <p className="text-2xl font-bold text-green-900">
                          {products.filter(p => p.isActive).length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[280px]">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                      <Search size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-500"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowFilterPopup(true)}
                  className="px-6 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 active:bg-gray-200 transition-all flex items-center gap-2 font-medium"
                >
                  <Filter size={20} />
                  <span>Filter</span>
                  {(filters.category || filters.lowStock || filters.inactive) && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </button>
                
                <button
                  onClick={() => setShowAddProductPopup(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all flex items-center gap-2 font-medium"
                >
                  <Plus size={20} />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="space-y-4">
              <FilterChips 
                filters={filters}
                onFilterChange={handleFilterChange}
              />
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-red-800">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertCircle size={20} />
                    </div>
                    <p className="font-medium">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="mt-8">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-white border border-gray-200 rounded-lg p-12 max-w-md mx-auto shadow-sm">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                      <Package size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40">
          {/* ChatBot Button */}
          <button
            onClick={() => setShowChatBot(prev => !prev)}
            className=" flex items-center justify-center shadow-lg
          
                bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
                  >
                    <Bot className="text-white w-6 h-6" />
          </button>

          {/* QR Scanner Button */}
          <button
            onClick={() => setShowQRScanner(true)}
            className="w-16 h-16 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all flex items-center justify-center shadow-lg"
          >
            <Barcode size={28} />
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
        />
        
        <AddProductPopup
          isOpen={showAddProductPopup}
          onClose={() => setShowAddProductPopup(false)}
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
            onEdit={() => {
              setSelectedProduct(null);
              setShowAddProductPopup(true);
            }}
            onDelete={async (productId) => {
              try {
                await deleteProduct(productId);
                setProducts(products.filter(p => p.id !== productId));
                setSelectedProduct(null);
              } catch (error) {
                setError('Failed to delete product. Please try again.');
              }
            }}
          />
        )}
      </div>

  );
};

export default Products;