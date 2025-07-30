import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Download, FileText, BarChart3, TrendingUp, ShoppingCart, Users, DollarSign, Printer, Bot, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import your existing components
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatBot from '../components/ChatBot.jsx';

// Add this Modal component since it was missing
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};


const API_BASE_URL = 'https://retail360-backend.vercel.app';

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isChatBotVisible, setIsChatBotVisible] = useState(false);
  const [isCrossShopModalOpen, setIsCrossShopModalOpen] = useState(false);
  const [crossShopData, setCrossShopData] = useState({
    fromShop: '',
    toShop: '',
    user: '',
    transactionType: 'payment',
    amount: 0,
    description: ''
  });
  const [shops, setShops] = useState([]);
  const [users, setUsers] = useState([]);

  // Dashboard data states
  const [dashboardData, setDashboardData] = useState({
    todayStats: { revenue: 0, transactions: 0, averageOrderValue: 0 },
    customers: { totalCustomers: 0 },
    inventory: { lowStockCount: 0, lowStockProducts: [] }
  });
  
  const [revenueData, setRevenueData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState([]);
  const [salesAnalytics, setSalesAnalytics] = useState({
    totalProductsSold: 0,
    totalRevenue: 0,
    totalProfit: 0,
    topProducts: []
  });
  const [dailyReportData, setDailyReportData] = useState({
    date: '',
    totalSales: 0,
    totalRevenue: 0,
    totalProfit: 0,
    totalCustomers: 0,
    topSellingProduct: '',
    paymentBreakdown: { cash: 0, card: 0, mobileMoney: 0 }
  });

  // Get shopId and token from localStorage
  const shopId = localStorage.getItem('shopId');
  const token = localStorage.getItem('token');

  // Fetch all data
  useEffect(() => {
    if (shopId && token) {
      fetchDashboardData();
      fetchRevenueData();
      fetchTopProductsData();
      fetchPaymentMethodsData();
      fetchSalesAnalytics();
      fetchDailyReportData();
      fetchShops();
      fetchUsers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, selectedDate]);

  // API fetch functions
  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/${shopId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
  };

  const fetchRevenueData = async () => {
    try {
      const { startDate, endDate } = dateRange;
      const response = await fetch(
        `${API_BASE_URL}/api/analytics/revenue?startDate=${startDate}&endDate=${endDate}&shopId=${shopId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        setRevenueData(data.data);
      }
    } catch (error) {
      toast.error('Failed to load revenue data');
    }
  };

  const fetchTopProductsData = async () => {
    try {
      const { startDate, endDate } = dateRange;
      const response = await fetch(
        `${API_BASE_URL}/api/analytics/top-products?startDate=${startDate}&endDate=${endDate}&shopId=${shopId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        setTopProductsData(data.data);
      }
    } catch (error) {
      toast.error('Failed to load top products data');
    }
  };

  const fetchPaymentMethodsData = async () => {
    try {
      const { startDate, endDate } = dateRange;
      const response = await fetch(
        `${API_BASE_URL}/api/analytics/payment-methods?startDate=${startDate}&endDate=${endDate}&shopId=${shopId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        setPaymentMethodsData(data.data);
      }
    } catch (error) {
      toast.error('Failed to load payment methods data');
    }
  };

  const fetchSalesAnalytics = async () => {
    try {
      const { startDate, endDate } = dateRange;
      const response = await fetch(
        `${API_BASE_URL}/api/analytics/sales?startDate=${startDate}&endDate=${endDate}&shopId=${shopId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        setSalesAnalytics(data.data);
      }
    } catch (error) {
      toast.error('Failed to load sales analytics');
    }
  };

  const fetchDailyReportData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reports/daily?date=${selectedDate}&shopId=${shopId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        setDailyReportData(data.data);
      }
    } catch (error) {
      toast.error('Failed to load daily report');
    }
  };

  const fetchShops = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/shops`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setShops(data.data);
      }
    } catch (error) {
      toast.error('Failed to load shops');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  // Export functions
  const exportToPDF = async (data, filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/exports/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ data, filename })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast.success('Exported to PDF successfully');
      } else {
        toast.error('Failed to export to PDF');
      }
    } catch (error) {
      toast.error('Failed to export to PDF');
    }
  };

  const exportToExcel = async (data, filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/exports/excel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ data, filename })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast.success('Exported to Excel successfully');
      } else {
        toast.error('Failed to export to Excel');
      }
    } catch (error) {
      toast.error('Failed to export to Excel');
    }
  };

  const exportToWord = async (data, filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/exports/word`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ data, filename })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.docx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast.success('Exported to Word successfully');
      } else {
        toast.error('Failed to export to Word');
      }
    } catch (error) {
      toast.error('Failed to export to Word');
    }
  };

  const printReport = (data) => {
    console.log('Printing report:', data);
    window.print();
  };

  // Cross-shop transaction functions
  const handleCrossShopSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/cross-shop-transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(crossShopData)
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Cross-shop transaction created successfully');
        setIsCrossShopModalOpen(false);
        setCrossShopData({
          fromShop: '',
          toShop: '',
          user: '',
          transactionType: 'payment',
          amount: 0,
          description: ''
        });
      } else {
        toast.error(data.message || 'Failed to create transaction');
      }
    } catch (error) {
      toast.error('Failed to create transaction');
    }
  };

  const handleCrossShopChange = (e) => {
    const { name, value } = e.target;
    setCrossShopData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  // Execute daily tasks
  const executeDailyTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/daily`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        // Refresh data
        fetchDashboardData();
        fetchRevenueData();
        fetchTopProductsData();
        fetchPaymentMethodsData();
        fetchSalesAnalytics();
        fetchDailyReportData();
      } else {
        toast.error(data.message || 'Failed to execute tasks');
      }
    } catch (error) {
      toast.error('Failed to execute daily tasks');
    }
  };

  const ExportButtons = ({ data, filename }) => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => exportToPDF(data, filename)}
        className="flex items-center gap-2 bg-red-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
      >
        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">PDF</span>
      </button>
      <button
        onClick={() => exportToExcel(data, filename)}
        className="flex items-center gap-2 bg-green-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
      >
        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Excel</span>
      </button>
      <button
        onClick={() => exportToWord(data, filename)}
        className="flex items-center gap-2 bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
      >
        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Word</span>
      </button>
    </div>
  );

  // Tab components
  const AnalyticsDashboardTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Overview of your retail performance</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm w-full sm:w-auto"
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm w-full sm:w-auto"
            />
          </div>
          <ExportButtons data={revenueData} filename="Analytics Dashboard" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white p-3 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-black">₵{dashboardData.todayStats.revenue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
          <p className="text-xs sm:text-sm text-green-600 mt-2">Today's Revenue</p>
        </div>

        <div className="bg-white p-3 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Sales</p>
              <p className="text-lg sm:text-2xl font-bold text-black">{dashboardData.todayStats.transactions}</p>
            </div>
            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
          <p className="text-xs sm:text-sm text-blue-600 mt-2">Today's Transactions</p>
        </div>

        <div className="bg-white p-3 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Customers</p>
              <p className="text-lg sm:text-2xl font-bold text-black">{dashboardData.customers.totalCustomers}</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>
          <p className="text-xs sm:text-sm text-purple-600 mt-2">Total Customers</p>
        </div>

        <div className="bg-white p-3 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Avg Order Value</p>
              <p className="text-lg sm:text-2xl font-bold text-black">₵{dashboardData.todayStats.averageOrderValue.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
          </div>
          <p className="text-xs sm:text-sm text-orange-600 mt-2">Today's Average</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Revenue & Profit Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={2} />
              <Line type="monotone" dataKey="profit" stroke="#6B7280" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Top Products by Sales</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={60} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="sales" fill="#000000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const SalesAnalyticsTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Sales Analytics</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Detailed sales performance analysis</p>
        </div>
        <ExportButtons data={salesAnalytics} filename="Sales Analytics" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xs sm:text-sm text-gray-600 mb-2">Total Products Sold</h3>
          <p className="text-2xl sm:text-3xl font-bold text-black">{salesAnalytics.totalProductsSold}</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xs sm:text-sm text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-2xl sm:text-3xl font-bold text-black">₵{salesAnalytics.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xs sm:text-sm text-gray-600 mb-2">Total Profit</h3>
          <p className="text-2xl sm:text-3xl font-bold text-black">₵{salesAnalytics.totalProfit.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Payment Methods Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Payment Methods Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={paymentMethodsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethodsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Table */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Top Performing Products</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Sold</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesAnalytics.topProducts.map((item, index) => (
                  <tr key={index}>
                    <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      {item.product.name}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {item.totalQuantitySold}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      ₵{item.totalRevenue.toFixed(2)}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      ₵{item.totalProfit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const DailyReportsTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Daily Reports</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Generate comprehensive daily business reports</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm w-full sm:w-auto"
          />
          <div className="flex gap-2">
            <button
              onClick={() => printReport(dailyReportData)}
              className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm"
            >
              <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <ExportButtons data={dailyReportData} filename={`Daily Report ${selectedDate}`} />
          </div>
        </div>
      </div>

      {/* Daily Report Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-black text-white px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-lg sm:text-xl font-bold">Daily Business Report</h2>
          <p className="text-gray-300 text-sm">Date: {new Date(selectedDate).toLocaleDateString()}</p>
        </div>
        
        <div className="p-4 sm:p-6">
          {/* Summary Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Sales</p>
              <p className="text-lg sm:text-2xl font-bold text-black">{dailyReportData.totalSales}</p>
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-black">₵{dailyReportData.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Profit</p>
              <p className="text-lg sm:text-2xl font-bold text-black">₵{dailyReportData.totalProfit.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Customers Served</p>
              <p className="text-lg sm:text-2xl font-bold text-black">{dailyReportData.totalCustomers}</p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Payment Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 text-sm sm:text-base">Cash Payments</span>
                  <span className="font-semibold text-black text-sm sm:text-base">₵{dailyReportData.paymentBreakdown.cash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 text-sm sm:text-base">Card Payments</span>
                  <span className="font-semibold text-black text-sm sm:text-base">₵{dailyReportData.paymentBreakdown.card.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 text-sm sm:text-base">Mobile Money</span>
                  <span className="font-semibold text-black text-sm sm:text-base">₵{dailyReportData.paymentBreakdown.mobileMoney.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Key Insights</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs sm:text-sm text-green-800">
                    <strong>Top Selling Product:</strong> {dailyReportData.topSellingProduct}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs sm:text-sm text-blue-800">
                    <strong>Average Order Value:</strong> ₵{(dailyReportData.totalRevenue / dailyReportData.totalSales).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-xs sm:text-sm text-purple-800">
                    <strong>Profit Margin:</strong> {((dailyReportData.totalProfit / dailyReportData.totalRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Cross-Shop Transaction Modal
  const CrossShopModal = () => (
    <Modal isOpen={isCrossShopModalOpen} onClose={() => setIsCrossShopModalOpen(false)} title="Create Cross-Shop Transaction">
      <form onSubmit={handleCrossShopSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Shop</label>
          <select
            name="fromShop"
            value={crossShopData.fromShop}
            onChange={handleCrossShopChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
          >
            <option value="">Select Shop</option>
            {shops.map(shop => (
              <option key={shop._id} value={shop._id}>{shop.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Shop</label>
          <select
            name="toShop"
            value={crossShopData.toShop}
            onChange={handleCrossShopChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
          >
            <option value="">Select Shop</option>
            {shops.map(shop => (
              <option key={shop._id} value={shop._id}>{shop.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
          <select
            name="user"
            value={crossShopData.user}
            onChange={handleCrossShopChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
          >
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
          <select
            name="transactionType"
            value={crossShopData.transactionType}
            onChange={handleCrossShopChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
          >
            <option value="payment">Payment</option>
            <option value="transfer">Transfer</option>
            <option value="adjustment">Adjustment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₵)</label>
          <input
            type="number"
            name="amount"
            value={crossShopData.amount}
            onChange={handleCrossShopChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={crossShopData.description}
            onChange={handleCrossShopChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsCrossShopModalOpen(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Create Transaction
          </button>
        </div>
      </form>
    </Modal>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className={`fixed top-0 right-0 z-30 transition-all duration-300 ${sidebarOpen ? 'lg:left-64' : 'lg:left-20'} left-0`}>
          <Navbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            title={'Analytics & Reports'}
          /> 
        </div>

        <div className="bg-white border-b border-gray-200 px-3 sm:px-6 pt-16 lg:pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-black">Analytics & Reports</h1>
                <p className="text-xs sm:text-sm text-gray-600">Comprehensive business insights</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={executeDailyTasks}
                className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Run Daily Tasks</span>
              </button>
              
              <button
                onClick={() => setIsCrossShopModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Cross-Shop Transaction</span>
              </button>
            </div>
          </div>
          
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'sales'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sales Analytics
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'reports'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Daily Reports
              </button>
            </nav>
          </div>
        </div>

        <div className="p-3 sm:p-6">
          {activeTab === 'dashboard' && <AnalyticsDashboardTab />}
          {activeTab === 'sales' && <SalesAnalyticsTab />}
          {activeTab === 'reports' && <DailyReportsTab />}
        </div>
      </div>

      <CrossShopModal />
      
      <ChatBot 
        dashboardData={dashboardData}
        isVisible={isChatBotVisible}
        onClose={() => setIsChatBotVisible(false)}
      />

      <button
        onClick={() => setIsChatBotVisible(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
      >
        <Bot className="text-white w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};

export default AnalyticsDashboard;