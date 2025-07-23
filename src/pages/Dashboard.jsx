import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Users,Bot, Package, AlertTriangle, Plus, BarChart3, ShoppingBag, CreditCard, MessageCircle, Bell } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatBot from '../components/ChatBot';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [showChatBot, setShowChatBot] = useState(false);
  const navigate = useNavigate();
  // Mock function to get dashboard data
  const getDashboardSummary = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          todayStats: {
            revenue: 1250.50,
            transactions: 45,
            averageOrderValue: 27.79
          },
          inventory: {
            totalProducts: 150,
            lowStockCount: 8,
            lowStockProducts: [
              {
                id: "prod_123",
                name: "Coca Cola 500ml",
                currentQuantity: 5,
                minQuantity: 10,
                pricing: {
                  sellingPrice: 2.50
                }
              },
              {
                id: "prod_124",
                name: "Bread Loaf",
                currentQuantity: 3,
                minQuantity: 15,
                pricing: {
                  sellingPrice: 1.80
                }
              },
              {
                id: "prod_125",
                name: "Milk 1L",
                currentQuantity: 2,
                minQuantity: 20,
                pricing: {
                  sellingPrice: 3.20
                }
              }
            ]
          },
          customers: {
            totalCustomers: 89
          },
          notifications: [
            {
              id: "notif_123",
              type: "low-stock",
              title: "Low Stock Alert",
              message: "Coca Cola 500ml is running low",
              priority: "high",
              isRead: false,
              createdAt: "2024-01-15T10:30:00Z"
            },
            {
              id: "notif_124",
              type: "sale",
              title: "Daily Sales Target",
              message: "You're 80% towards your daily target",
              priority: "medium",
              isRead: false,
              createdAt: "2024-01-15T09:15:00Z"
            },
            {
              id: "notif_125",
              type: "customer",
              title: "New Customer",
              message: "Welcome John Doe to your store",
              priority: "low",
              isRead: true,
              createdAt: "2024-01-15T08:45:00Z"
            }
          ]
        });
      }, 1000);
    });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardSummary("shop_12345");
        setDashboardData(data);
       
        
       
       
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
     
      }
    };

    fetchDashboardData();
  }, []);



  const handleToggleChatBot = () => {
    setShowChatBot(prev => !prev);
    
  };



  const quickActions = [
    { icon: Plus, label: 'New Sale', color: 'bg-blue-500',path: '/sales' },
    { icon: Package, label: 'Add Product', color: 'bg-green-500',path: '/products' },
    { icon: Users, label: 'Add Customer', color: 'bg-purple-500',path: '/customers' },
    { icon: BarChart3, label: 'View Reports', color: 'bg-orange-500' ,path: '/reports'}
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  const formatDate = (dateString) => {
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
            title={ 'Dashboard'}
          />
        </div>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-black mb-2 p-5">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening in your store today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] p-6 border border-white/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{formatCurrency(dashboardData?.todayStats?.revenue)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-black">{dashboardData?.todayStats?.transactions}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ShoppingCart size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-black">{formatCurrency(dashboardData?.todayStats?.averageOrderValue)}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <CreditCard size={24} className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-black">{dashboardData?.customers?.totalCustomers}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users size={24} className="text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Low Stock Alerts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-black">Low Stock Alerts</h2>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {dashboardData?.inventory?.lowStockCount} items
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData?.inventory?.lowStockProducts?.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-full mr-3">
                          <AlertTriangle size={16} className="text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-black">{product.name}</p>
                          <p className="text-sm text-gray-600">
                            {product.currentQuantity} left (min: {product.minQuantity})
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-black">{formatCurrency(product.pricing.sellingPrice)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-black">Recent Notifications</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData?.notifications?.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <Bell size={16} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-black">{notification.title}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(notification.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-black">Quick Actions</h2>
              </div>
              <div className="p-6">
                
                
<div className="grid grid-cols-2 gap-4">
  {quickActions.map((action, index) => (
    <button
      key={index}
      onClick={() => navigate(action.path)}
      className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
    >
      <action.icon size={24} className="mx-auto mb-2" />
      <p className="text-sm font-medium">{action.label}</p>
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
           className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
             >
               <Bot className="text-white w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Dashboard;