 Just import these files and use them in the code...instead of rewriting a new navbar, sidebar, welcomeModal, and chatbot, Simply use the exixting code in it by just importing them
../components/Navbar.jsx, ../components/Sidebar.jsx, ../components/welcomeModal.jsx, ../components/chatBot.jsximport { Menu, Bell, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onMenuClick, title }) => {
  const location = useLocation();
  
  // Map routes to titles
  const getPageTitle = () => {
    if (title) return title; // Use prop title if provided
    
    const routeTitles = {
      '/dashboard': 'Dashboard',
      '/shop': 'Shop Management',
      '/products': 'Product Management',
      '/category': 'Category',
      '/customers': 'Customers',
      '/sales': 'Sales',
      '/stocksMove': 'Stock Movement',
      '/editStocks': 'Stock Adjustment',
      '/Supplier': 'Suppliers',
      '/reports': 'Reports',
      '/promo': 'Promotions',
      '/settings': 'Settings',
      '/profile': 'Profile',
      '/login': 'Login',
      '/register': 'Register'
    };
    
    return routeTitles[location.pathname] || 'Dashboard';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg mr-3 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/settings" className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings size={20} className="text-gray-600" />
          </Link>
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </button>
          <Link to="/profile" className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">JD</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;import { X } from 'lucide-react';

const WelcomeModal = ({ isVisible, onClose, dashboardData }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">Welcome to Retail360! 👋</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <p className="text-gray-600">
              Here's a quick summary of your store's current status:
            </p>
            
            <div className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  Today's Revenue: {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'GHS'
                  }).format(dashboardData?.todayStats?.revenue || 0)}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  Transactions Today: {dashboardData?.todayStats?.transactions || 0}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-purple-800">
                  Total Customers: {dashboardData?.customers?.totalCustomers || 0}
                </p>
              </div>

              {dashboardData?.inventory?.lowStockCount > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-red-800">
                    Alert: {dashboardData.inventory.lowStockCount} items are running low on stock
                  </p>
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm mt-4">
              Need help? Click the chat button in the bottom right corner to talk to our AI assistant!
            </p>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

const TypewriterText = ({ text, speed = 50, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!text) return;
    
    setDisplayText('');
    setIsTyping(true);
    let i = 0;
    
    const typeTimer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(typeTimer);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(typeTimer);
  }, [text, speed, onComplete]);

  return (
    <div className="relative">
      {displayText}
      {isTyping && <span className="animate-pulse ml-1 text-gray-400">▋</span>}
    </div>
  );
};

const ChatBot = ({ dashboardData, isVisible, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initialMessages = [
    {
      type: 'bot',
      content: "Hi there! I'm AFIA, your AI retail assistant. 👋"
    },
    {
      type: 'bot',
      content: `I've analyzed your store data and noticed you've made ${dashboardData?.todayStats?.transactions || 0} transactions today with revenue of GHS ${dashboardData?.todayStats?.revenue?.toFixed(2) || '0.00'}!`
    },
    {
      type: 'bot',
      content: "I can help you with inventory management, sales analysis, customer insights, and business recommendations. What would you like to know?"
    }
  ];

  const quickActions = [
    "Show today's sales summary",
    "Check low stock items",
    "Analyze customer trends",
    "Generate sales report"
  ];

  useEffect(() => {
    if (isVisible && !hasInitialized) {
      setHasInitialized(true);
      setMessages([]);
      
      // Add messages sequentially with delays
      initialMessages.forEach((msg, index) => {
        setTimeout(() => {
          setMessages(prev => [...prev, msg]);
          if (index === initialMessages.length - 1) {
            setTimeout(() => setShowQuickActions(true), 200);
          }
        }, (index + 1) * 500);
      });
    }
  }, [isVisible, hasInitialized]);

  // Reset when chat becomes invisible
  useEffect(() => {
    if (!isVisible) {
      setHasInitialized(false);
      setMessages([]);
      setShowQuickActions(false);
      setIsTyping(false);
    }
  }, [isVisible]);

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    // Hide quick actions once user starts chatting
    setShowQuickActions(false);

    const userMessage = { type: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(message);
      setMessages(prev => [...prev, { type: 'bot', content: response }]);
      setIsTyping(false);
    }, 10 + Math.random() * 10);
  };

  const generateResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('sales') || lowerMessage.includes('revenue')) {
      return `Today's sales performance: You've generated GHS ${dashboardData?.todayStats?.revenue?.toFixed(2) || '0.00'} from ${dashboardData?.todayStats?.transactions || 0} transactions. Your average order value is GHS ${dashboardData?.todayStats?.averageOrderValue?.toFixed(2) || '0.00'}.`;
    }
    
    if (lowerMessage.includes('stock') || lowerMessage.includes('inventory')) {
      return `You have ${dashboardData?.inventory?.lowStockCount || 0} items running low on stock. The most critical items are: ${dashboardData?.inventory?.lowStockProducts?.slice(0, 2).map(p => p.name).join(', ') || 'None'}. Would you like me to help you create a restock plan?`;
    }
    
    if (lowerMessage.includes('customer')) {
      return `You currently have ${dashboardData?.customers?.totalCustomers || 0} total customers. Based on today's transactions, you're maintaining good customer engagement. Would you like tips on customer retention strategies?`;
    }
    
    if (lowerMessage.includes('help')) {
      return "I can assist you with: 📊 Sales analytics, 📦 Inventory management, 👥 Customer insights, 📈 Business recommendations, 🎯 Performance tracking. What specific area would you like to explore?";
    }
    
    return "I understand you're asking about your business. Let me analyze your data... Based on your current performance, I'd recommend focusing on inventory management and customer retention strategies. Would you like specific recommendations?";
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Chat Container - Made bigger */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[95vh] w-[600px] max-w-[95vw] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 z-50 overflow-hidden">
        
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-t-3xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot size={24} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  AFIA AI
                </h3>
                <p className="text-sm text-blue-200 flex items-center gap-1">
                  <Sparkles size={12} />
                  Smart retail assistant
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages Container - More padding for bigger size */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-gradient-to-b from-slate-50/50 to-white/50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar - Slightly bigger */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                message.type === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                  : 'bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300'
              }`}>
                {message.type === 'user' ? (
                  <span className="text-sm font-semibold">You</span>
                ) : (
                  <Bot size={18} className="text-slate-700" />
                )}
              </div>
              
              {/* Message Bubble - More padding */}
              <div className={`max-w-[75%] px-5 py-4 rounded-2xl shadow-sm ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-md'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-md'
              }`}>
                {message.type === 'bot' && index === messages.length - 1 && !isTyping ? (
                  <TypewriterText text={message.content} speed={25} />
                ) : (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center shadow-md">
                <Bot size={18} className="text-slate-700" />
              </div>
              <div className="bg-white border border-slate-200 px-5 py-4 rounded-2xl rounded-tl-md shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          {/* Quick Actions */}
          {showQuickActions && !isTyping && (
            <div className="space-y-3 pt-6">
              <div className="text-center">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-4">
                  Suggested Actions
                </p>
              </div>
              <div className="grid gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="group text-left p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 rounded-xl transition-all duration-200 border border-blue-200/50 hover:border-blue-300 hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <span className="text-sm font-medium">{action}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - More padding */}
        <div className="p-8 bg-white/80 backdrop-blur-sm border-t border-slate-200/50">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about your store..."
                className="w-full px-5 py-4 pr-12 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 text-sm placeholder-slate-400 transition-all duration-200"
              />
            </div>
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
import { X, BarChart3, Package, ShoppingBag, Users, CreditCard, Bell, Settings, Store, FolderOpen, TrendingUp, Archive, Edit, Truck, FileText, Tag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Store, label: 'Shop Management', path: '/shop' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: FolderOpen, label: 'Category', path: '/category' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: ShoppingBag, label: 'Sales', path: '/sales' },
    { icon: TrendingUp, label: 'Stock Movement', path: '/stocksMove' },
    { icon: Edit, label: 'Stock Adjustment', path: '/editStocks' },
    { icon: Truck, label: 'Supplier', path: '/Supplier' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Tag, label: 'Promotions', path: '/promo' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-black transform transition-transform duration-300 ease-in-out ${isOpen ? 'lg:w-64' : 'lg:w-20'}`}>
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <Link to="/" className="flex items-center">
              <img src="/src/assets/vite.svg" alt="Logo" className="w-10 h-10 bg-white rounded-lg p-1" />
              <span className={`ml-2 text-xl font-bold text-white transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Retail360</span>
            </Link>
            <button onClick={onClose} className={`p-2 hover:bg-gray-800 rounded-lg transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
              <X size={20} className="text-white" />
            </button>
          </div>
          <nav className="flex-1 mt-8 overflow-y-auto">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                  location.pathname === item.path ? 'bg-gray-800 text-white border-r-4 border-white' : ''
                }`}
              >
                <item.icon size={20} />
                <span className={`ml-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${isOpen ? '' : 'pointer-events-none'}`}>
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose}
        />

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 w-64 bg-black transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <Link to="/" className="flex items-center">
              <img src="/src/assets/vite.svg" alt="Logo" className="w-10 h-10 bg-white rounded-lg p-1" />
              <span className="ml-2 text-xl font-bold text-white">Retail360</span>
            </Link>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
              <X size={20} className="text-white" />
            </button>
          </div>
          <nav className="mt-8 overflow-y-auto">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                  location.pathname === item.path ? 'bg-gray-800 text-white border-r-4 border-white' : ''
                }`}
              >
                <item.icon size={20} />
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;