import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Users, Bot, Package, AlertTriangle, Plus, BarChart3, ShoppingBag, CreditCard, MessageCircle, Bell, Menu, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatBot from '../components/ChatBot';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://retail360-backend.vercel.app';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [showChatBot, setShowChatBot] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasShop, setHasShop] = useState(false);
  const navigate = useNavigate();

  // Get current shop ID from user data with better error handling
  const getCurrentShopId = () => {
    try {
      const userDataString = localStorage.getItem('userData');
      console.log('Raw userData from localStorage:', userDataString);
      
      if (!userDataString) {
        console.log('No userData found in localStorage');
        return null;
      }
      
      const userData = JSON.parse(userDataString);
      console.log('Parsed userData:', userData);
      
      // Based on your actual data structure
      const shopId = userData?.currentShop?._id || 
                    userData?.currentShop?.shopId ||
                    userData?.user?.currentShop?._id || 
                    userData?.user?.currentShop?.shopId ||
                    userData?.shopId ||
                    null;
      
      console.log('Extracted shop ID:', shopId);
      return shopId;
    } catch (error) {
      console.error('Error parsing userData:', error);
      return null;
    }
  };

  // Get authentication token
  const getAuthToken = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    console.log('Auth token available:', !!token);
    return token;
  };

  // Get current shop details for additional context
  const getCurrentShop = () => {
    try {
      const userDataString = localStorage.getItem('userData');
      if (!userDataString) return null;
      
      const userData = JSON.parse(userDataString);
      return userData?.currentShop || null;
    } catch (error) {
      console.error('Error getting current shop:', error);
      return null;
    }
  };

  // Initialize dashboard with default values
  const initializeDashboard = () => {
    return {
      todayStats: {
        revenue: 0,
        transactions: 0,
        averageOrderValue: 0
      },
      inventory: {
        totalProducts: 0,
        lowStockCount: 0,
        lowStockProducts: []
      },
      customers: {
        totalCustomers: 0
      },
      notifications: []
    };
  };

  // API call to get dashboard data - Modified to make request regardless of shopId
  const getDashboardSummary = async (shopId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.log('No auth token available, returning default dashboard');
        return initializeDashboard();
      }

      // Construct URL - use shopId if available, otherwise make a general request
      const url = shopId 
        ? `${API_BASE_URL}/api/dashboard/${shopId}`
        : `${API_BASE_URL}/api/dashboard`;

      console.log('Making dashboard request to:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Dashboard response status:', response.status);

      if (!response.ok) {
        // Log the error but don't throw - return default data instead
        console.error(`Dashboard API error! status: ${response.status}`);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        return initializeDashboard();
      }

      const data = await response.json();
      console.log('Dashboard data received:', data);
      return data.data || data;

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return initializeDashboard();
    }
  };

  // API call to get notifications - Modified to make request regardless of shopId
  const getNotifications = async (shopId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.log('No auth token available for notifications');
        return [];
      }

      // Construct URL - use shopId if available, otherwise get user's notifications
      const url = shopId 
        ? `${API_BASE_URL}/api/notifications/shop/${shopId}?unreadOnly=false`
        : `${API_BASE_URL}/api/notifications?unreadOnly=false`;

      console.log('Making notifications request to:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Notifications response status:', response.status);

      if (!response.ok) {
        console.error(`Notifications API error! status: ${response.status}`);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        return [];
      }

      const data = await response.json();
      console.log('Notifications data received:', data);
      return data.data || data.notifications || [];

    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  };

  // API call to mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.log('No auth token available for marking notification as read');
        return false;
      }

      console.log('Marking notification as read:', notificationId);

      const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`Mark notification as read error! status: ${response.status}`);
        return false;
      }
      
      console.log('Notification marked as read successfully');
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  };

  // Check if user has necessary authentication
  const checkUserAuthentication = () => {
    const token = getAuthToken();
    const userData = localStorage.getItem('userData');
    
    if (!token) {
      console.warn('No authentication token found');
      // Optionally redirect to login
      // navigate('/login');
      return false;
    }
    
    if (!userData) {
      console.warn('No user data found');
      return false;
    }
    
    return true;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('=== Dashboard Initialization Started ===');
      
      try {
        setError(null);
        setLoading(true);
        
        // Check authentication first
        if (!checkUserAuthentication()) {
          console.log('Authentication check failed - using default dashboard');
          setDashboardData(initializeDashboard());
          setLoading(false);
          return;
        }
        
        const shopId = getCurrentShopId();
        const currentShop = getCurrentShop();
        setHasShop(!!shopId);
        
        console.log('Shop ID status:', shopId ? `Found: ${shopId}` : 'Not found');
        console.log('Current shop details:', currentShop?.name || 'No shop name');
        
        // Always make API calls - let the server handle missing shopId
        console.log('Fetching dashboard data...');
        const dashboardResponse = await getDashboardSummary(shopId);
        
        console.log('Fetching notifications...');
        const notifications = await getNotifications(shopId);

        // Format dashboard data with default values
        const formattedData = {
          todayStats: {
            revenue: dashboardResponse?.todayStats?.revenue || 0,
            transactions: dashboardResponse?.todayStats?.transactions || 0,
            averageOrderValue: dashboardResponse?.todayStats?.averageOrderValue || 0
          },
          inventory: {
            totalProducts: dashboardResponse?.inventory?.totalProducts || 0,
            lowStockCount: dashboardResponse?.inventory?.lowStockCount || 0,
            lowStockProducts: dashboardResponse?.inventory?.lowStockProducts || dashboardResponse?.lowStockProducts || []
          },
          customers: {
            totalCustomers: dashboardResponse?.customers?.totalCustomers || 0
          },
          notifications: Array.isArray(notifications) ? notifications.slice(0, 5) : []
        };

        console.log('Final formatted dashboard data:', formattedData);
        setDashboardData(formattedData);
        
      } catch (error) {
        console.error('Error in fetchDashboardData:', error);
        setError(error.message);
        // Still set default dashboard data instead of leaving it null
        setDashboardData(initializeDashboard());
      } finally {
        setLoading(false);
        console.log('=== Dashboard Initialization Complete ===');
      }
    };

    fetchDashboardData();
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleChatBot = () => {
    setShowChatBot(prev => !prev);
  };

  const handleMarkAsRead = async (notificationId) => {
    const success = await markNotificationAsRead(notificationId);
    if (success && dashboardData) {
      // Update local state to mark as read
      setDashboardData({
        ...dashboardData,
        notifications: dashboardData.notifications.map(notif => 
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      });
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const quickActions = [
    { icon: Plus, label: 'New Sale', color: 'bg-yellow-500', path: '/sales' },
    { icon: Package, label: 'Add Product', color: 'bg-red-500', path: '/products' },
    { icon: Users, label: 'Add Customer', color: 'bg-gray-500', path: '/customers' },
    { icon: BarChart3, label: 'View Reports', color: 'bg-orange-500', path: '/reports' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state with more details
  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Dashboard</h2>
          <p className="text-gray-600 mb-2">There was an error loading your dashboard data.</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button 
            onClick={handleRetry}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors mr-2"
          >
            Retry
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
      
      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} ml-0`}>
        {/* Navbar */}
        <div className="fixed top-0 right-0 left-0 lg:left-auto z-30 transition-all duration-300" style={{ left: sidebarOpen ? '0' : '0' }}>
          <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} ml-0`}>
            <Navbar 
              onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
              title={'Dashboard'}
            />
          </div>
        </div>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-6 pt-20">
          {/* Shop selection banner - Only show if no shop but user is authenticated */}
          {!hasShop && getAuthToken() && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>No shop selected.</strong> Some data may be limited without a shop context. 
                    <button 
                      onClick={() => navigate('/shops/new')}
                      className="ml-2 font-medium underline text-yellow-700 hover:text-yellow-600"
                    >
                      Create a new shop
                    </button>
                    <span> or </span>
                    <button 
                      onClick={() => navigate('/shops')}
                      className="font-medium underline text-yellow-700 hover:text-yellow-600"
                    >
                      select an existing shop
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Authentication warning */}
          {!getAuthToken() && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    <strong>Not authenticated.</strong> Please log in to see your actual data.
                    <button 
                      onClick={() => navigate('/login')}
                      className="ml-2 font-medium underline text-red-700 hover:text-red-600"
                    >
                      Go to Login
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-black mb-2 p-5">
       Shop Name 
              {getCurrentShop()?.name && (
                <span className="text-lg font-normal text-gray-600 ml-2">
                  - {getCurrentShop().name}
                </span>
              )}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {getAuthToken() 
                ? "Welcome back! Here's what's happening in your store today." 
                : "Welcome! Please log in to see your actual store data."}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] p-4 lg:p-6 border border-white/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Today's Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {formatCurrency(dashboardData?.todayStats?.revenue)}
                  </p>
                </div>
                <div className="p-2 lg:p-3 bg-green-100 rounded-full">
                  <TrendingUp size={20} className="text-green-600 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Transactions</p>
                  <p className="text-lg sm:text-2xl font-bold text-black">{dashboardData?.todayStats?.transactions || 0}</p>
                </div>
                <div className="p-2 lg:p-3 bg-blue-100 rounded-full">
                  <ShoppingCart size={20} className="text-blue-600 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-lg sm:text-2xl font-bold text-black">
                    {formatCurrency(dashboardData?.todayStats?.averageOrderValue)}
                  </p>
                </div>
                <div className="p-2 lg:p-3 bg-purple-100 rounded-full">
                  <CreditCard size={20} className="text-purple-600 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-lg sm:text-2xl font-bold text-black">{dashboardData?.customers?.totalCustomers || 0}</p>
                </div>
                <div className="p-2 lg:p-3 bg-orange-100 rounded-full">
                  <Users size={20} className="text-orange-600 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Low Stock Alerts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 xl:col-span-1">
              <div className="p-4 lg:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-base lg:text-lg font-semibold text-black">Low Stock Alerts</h2>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {dashboardData?.inventory?.lowStockCount || 0} items
                  </span>
                </div>
              </div>
              <div className="p-4 lg:p-6 max-h-96 overflow-y-auto">
                {dashboardData?.inventory?.lowStockProducts?.length > 0 ? (
                  <div className="space-y-3 lg:space-y-4">
                    {dashboardData.inventory.lowStockProducts.map((product, index) => (
                      <div key={product.id || product._id || `low-stock-${index}`} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="p-2 bg-red-100 rounded-full mr-3">
                            <AlertTriangle size={14} className="text-red-600 sm:w-4 sm:h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-black text-sm lg:text-base">{product.name || 'Product'}</p>
                            <p className="text-xs lg:text-sm text-gray-600">
                              {product.currentQuantity || product.quantity || 0} left (min: {product.minQuantity || 10})
                            </p>
                          </div>
                        </div>
                        <p className="text-xs lg:text-sm font-medium text-black">
                          {formatCurrency(product.pricing?.sellingPrice || product.price || 0)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No low stock items</p>
                )}
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 xl:col-span-1">
              <div className="p-4 lg:p-6 border-b border-gray-200">
                <h2 className="text-base lg:text-lg font-semibold text-black">Recent Notifications</h2>
              </div>
              <div className="p-4 lg:p-6 max-h-96 overflow-y-auto">
                {dashboardData?.notifications?.length > 0 ? (
                  <div className="space-y-3 lg:space-y-4">
                    {dashboardData.notifications.map((notification, index) => (
                      <div 
                        key={notification._id || notification.id || `notification-${index}`} 
                        className={`flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors ${notification.isRead ? 'opacity-70' : ''}`}
                        onClick={() => notification._id && handleMarkAsRead(notification._id)}
                      >
                        <div className="p-2 bg-gray-100 rounded-full">
                          <Bell size={14} className="text-gray-600 sm:w-4 sm:h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-black text-sm lg:text-base truncate">
                              {notification.title || 'Notification'}
                            </p>
                            {notification.priority && (
                              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)} ml-2 flex-shrink-0`}>
                                {notification.priority}
                              </span>
                            )}
                          </div>
                          {notification.message && (
                            <p className="text-xs lg:text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          )}
                          {notification.createdAt && (
                            <p className="text-xs text-gray-500 mt-1">{formatDate(notification.createdAt)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No notifications</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 xl:col-span-1">
              <div className="p-4 lg:p-6 border-b border-gray-200">
                <h2 className="text-base lg:text-lg font-semibold text-black">Quick Actions</h2>
              </div>
              <div className="p-4 lg:p-6">
                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(action.path)}
                      className={`${action.color} text-white p-3 lg:p-4 rounded-lg hover:opacity-90 transition-opacity`}
                    >
                      <action.icon size={20} className="mx-auto mb-2 sm:w-6 sm:h-6" />
                      <p className="text-xs lg:text-sm font-medium">{action.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Chat Bot */}
      <ChatBot
        dashboardData={dashboardData}
        isVisible={showChatBot}
        onClose={() => setShowChatBot(false)}
      />

      {/* Floating Chat Button */}
      {!showChatBot && (
        <button
          onClick={handleToggleChatBot}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
        >
          <Bot className="text-white w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </div>
  );
};

export default Dashboard;