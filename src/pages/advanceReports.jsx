import React, { useState} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Download, FileText, BarChart3, TrendingUp, ShoppingCart, Users, DollarSign, Printer, Bot } from 'lucide-react';

// Import your existing components
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';

import ChatBot from '../components/ChatBot.jsx';

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Sidebar and modal states
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isChatBotVisible, setIsChatBotVisible] = useState(false);

  // Sample dashboard data for components
  const dashboardData = {
    todayStats: {
      revenue: 625.00,
      transactions: 25,
      averageOrderValue: 25.00
    },
    customers: {
      totalCustomers: 1240
    },
    inventory: {
      lowStockCount: 3,
      lowStockProducts: [
        { name: 'Coca Cola 500ml' },
        { name: 'Bread Loaf' }
      ]
    }
  };

  // Sample data - replace with actual API calls
  const revenueData = [
    { month: 'Jan', revenue: 4000, profit: 1200 },
    { month: 'Feb', revenue: 3000, profit: 900 },
    { month: 'Mar', revenue: 5000, profit: 1500 },
    { month: 'Apr', revenue: 4500, profit: 1350 },
    { month: 'May', revenue: 6000, profit: 1800 },
    { month: 'Jun', revenue: 5500, profit: 1650 }
  ];

  const topProductsData = [
    { name: 'Coca Cola 500ml', sales: 150, revenue: 375 },
    { name: 'Bread Loaf', sales: 120, revenue: 240 },
    { name: 'Milk 1L', sales: 100, revenue: 350 },
    { name: 'Rice 2kg', sales: 80, revenue: 480 },
    { name: 'Cooking Oil', sales: 70, revenue: 420 }
  ];

  const paymentMethodsData = [
    { name: 'Cash', value: 45, color: '#000000' },
    { name: 'Card', value: 30, color: '#4B5563' },
    { name: 'Mobile Money', value: 20, color: '#9CA3AF' },
    { name: 'Bank Transfer', value: 5, color: '#D1D5DB' }
  ];

  const salesAnalytics = {
    totalProductsSold: 150,
    totalRevenue: 3750.00,
    totalProfit: 1125.00,
    topProducts: [
      {
        product: {
          name: "Coca Cola 500ml",
          pricing: { sellingPrice: 2.50 }
        },
        totalQuantitySold: 50,
        totalRevenue: 125.00,
        totalProfit: 35.00,
        salesCount: 25
      },
      {
        product: {
          name: "Bread Loaf",
          pricing: { sellingPrice: 2.00 }
        },
        totalQuantitySold: 40,
        totalRevenue: 80.00,
        totalProfit: 20.00,
        salesCount: 20
      }
    ]
  };

  const dailyReportData = {
    date: selectedDate,
    totalSales: 25,
    totalRevenue: 625.00,
    totalProfit: 187.50,
    totalCustomers: 20,
    topSellingProduct: "Coca Cola 500ml",
    paymentBreakdown: {
      cash: 400.00,
      card: 150.00,
      mobileMoney: 75.00
    }
  };

  // Export functions
  const exportToPDF = (data, filename) => {
    console.log(`Exporting ${filename} to PDF:`, data);
    alert(`${filename} exported to PDF successfully!`);
  };

  const exportToExcel = (data, filename) => {
    console.log(`Exporting ${filename} to Excel:`, data);
    alert(`${filename} exported to Excel successfully!`);
  };

  const exportToWord = (data, filename) => {
    console.log(`Exporting ${filename} to Word:`, data);
    alert(`${filename} exported to Word successfully!`);
  };

  const printReport = (data) => {
    console.log('Printing report:', data);
    window.print();
  };

  const ExportButtons = ({ data, filename }) => (
    <div className="flex gap-2">
      <button
        onClick={() => exportToPDF(data, filename)}
        className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
      >
        <Download className="w-4 h-4" />
        PDF
      </button>
      <button
        onClick={() => exportToExcel(data, filename)}
        className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
      >
        <Download className="w-4 h-4" />
        Excel
      </button>
      <button
        onClick={() => exportToWord(data, filename)}
        className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        <FileText className="w-4 h-4" />
        Word
      </button>
    </div>
  );

  const AnalyticsDashboardTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your retail performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <ExportButtons data={revenueData} filename="Analytics Dashboard" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-black">₵28,000</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">↗ +12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-black">520</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-blue-600 mt-2">↗ +8% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-black">1,240</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-sm text-purple-600 mt-2">↗ +15% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-black">₵53.85</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-sm text-orange-600 mt-2">↗ +5% from last month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-black mb-4">Revenue & Profit Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={2} />
              <Line type="monotone" dataKey="profit" stroke="#6B7280" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-black mb-4">Top Products by Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#000000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const SalesAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">Sales Analytics</h1>
          <p className="text-gray-600 mt-1">Detailed sales performance analysis</p>
        </div>
        <ExportButtons data={salesAnalytics} filename="Sales Analytics" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm text-gray-600 mb-2">Total Products Sold</h3>
          <p className="text-3xl font-bold text-black">{salesAnalytics.totalProductsSold}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-black">₵{salesAnalytics.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm text-gray-600 mb-2">Total Profit</h3>
          <p className="text-3xl font-bold text-black">₵{salesAnalytics.totalProfit.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-black mb-4">Payment Methods Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
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
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-black mb-4">Top Performing Products</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Sold</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesAnalytics.topProducts.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.product.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.totalQuantitySold}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₵{item.totalRevenue.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">Daily Reports</h1>
          <p className="text-gray-600 mt-1">Generate comprehensive daily business reports</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <button
            onClick={() => printReport(dailyReportData)}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <ExportButtons data={dailyReportData} filename={`Daily Report ${selectedDate}`} />
        </div>
      </div>

      {/* Daily Report Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-black text-white px-6 py-4">
          <h2 className="text-xl font-bold">Daily Business Report</h2>
          <p className="text-gray-300">Date: {new Date(selectedDate).toLocaleDateString()}</p>
        </div>
        
        <div className="p-6">
          {/* Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Sales</p>
              <p className="text-2xl font-bold text-black">{dailyReportData.totalSales}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-black">₵{dailyReportData.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Profit</p>
              <p className="text-2xl font-bold text-black">₵{dailyReportData.totalProfit.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Customers Served</p>
              <p className="text-2xl font-bold text-black">{dailyReportData.totalCustomers}</p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Payment Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Cash Payments</span>
                  <span className="font-semibold text-black">₵{dailyReportData.paymentBreakdown.cash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Card Payments</span>
                  <span className="font-semibold text-black">₵{dailyReportData.paymentBreakdown.card.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Mobile Money</span>
                  <span className="font-semibold text-black">₵{dailyReportData.paymentBreakdown.mobileMoney.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Key Insights</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Top Selling Product:</strong> {dailyReportData.topSellingProduct}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Average Order Value:</strong> ₵{(dailyReportData.totalRevenue / dailyReportData.totalSales).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-800">
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

      {/* Main Content with proper margin for sidebar */}
    
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 pt-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black p-6">Analytics & Reports</h1>
              <p className="text-sm text-gray-600">Comprehensive business insights</p>
            </div>
          </div>
          
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sales'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sales Analytics
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
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

        {/* Main Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && <AnalyticsDashboardTab />}
          {activeTab === 'sales' && <SalesAnalyticsTab />}
          {activeTab === 'reports' && <DailyReportsTab />}
        </div>
      </div>

   
      {/* Use your existing ChatBot component */}
      <ChatBot 
        dashboardData={dashboardData}
        isVisible={isChatBotVisible}
        onClose={() => setIsChatBotVisible(false)}
      />

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatBotVisible(true)}
           className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
            >
               <Bot className="text-white w-6 h-6" />
      </button>
    </div>
  );
};

export default AnalyticsDashboard;