import { X, BarChart3, Package, ShoppingBag, Users, CreditCard, Bell, Settings, Store, FolderOpen, TrendingUp, Archive, Edit, Truck, FileText, Tag, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
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
    { icon: LogOut, label: 'Logout', path: '/logout', isLogout: true },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Add a small delay for better UX
    setTimeout(() => {
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Close sidebar if open
      onClose();
      
      // Redirect to login page
      navigate('/');
      
      setIsLoggingOut(false);
    }, 500);
  };

  const handleItemClick = (item) => {
    if (item.isLogout) {
      handleLogout();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-black transform transition-all duration-300 ease-in-out z-30 ${isOpen ? 'lg:w-64' : 'lg:w-20'}`}>
        <div className="flex flex-col h-full">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <img src="/vite.svg" alt="Logo" className="w-10 h-10 bg-white rounded-lg p-1 transition-transform duration-200 group-hover:scale-105" />
              <span className={`ml-2 text-xl font-bold text-white transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'}`}>
                Retail360
              </span>
            </Link>
            <button onClick={onClose} className={`p-2 hover:bg-gray-800 rounded-lg transition-all duration-300 hover:scale-105 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 w-0 overflow-hidden'}`}>
              <X size={20} className="text-white" />
            </button>
          </div>
          
          {/* Navigation - Scrollable */}
          <nav className="flex-1 mt-4 overflow-y-auto overflow-x-hidden">
            <div className="px-3 space-y-1 pb-4">
              {sidebarItems.map((item, index) => (
                item.isLogout ? (
                  <button
                    key={item.path}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`w-full flex items-center px-3 py-3 text-red-300 hover:bg-red-900 hover:text-white transition-all duration-200 rounded-lg group relative ${
                      isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <div className="relative flex-shrink-0">
                      <item.icon size={20} className={`transition-transform duration-200 ${isLoggingOut ? 'animate-spin' : 'group-hover:scale-110'}`} />
                    </div>
                    <span className={`ml-3 transition-all duration-300 font-medium text-left ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'}`}>
                      {isLoggingOut ? 'Logging out...' : item.label}
                    </span>
                    
                    {/* Tooltip for collapsed state */}
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}
                  </button>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 rounded-lg group relative ${
                      location.pathname === item.path ? 'bg-gray-800 text-white shadow-lg' : ''
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <div className="relative flex-shrink-0">
                      <item.icon size={20} className="transition-transform duration-200 group-hover:scale-110" />
                      {location.pathname === item.path && (
                        <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <span className={`ml-3 transition-all duration-300 font-medium ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'}`}>
                      {item.label}
                    </span>
                    
                    {/* Tooltip for collapsed state */}
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}
                  </Link>
                )
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isOpen ? '' : 'pointer-events-none'}`}>
        {/* Overlay with blur effect */}
        <div 
          className={`fixed inset-0 bg-black transition-all duration-300 ease-in-out ${
            isOpen ? 'bg-opacity-50 backdrop-blur-sm' : 'bg-opacity-0'
          }`}
          onClick={onClose}
        />

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-black transform transition-all duration-300 ease-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-gray-900 to-black flex-shrink-0">
              <Link to="/" className="flex items-center group" onClick={onClose}>
                <img src="/src/assets/vite.svg" alt="Logo" className="w-10 h-10 bg-white rounded-lg p-1 transition-transform duration-200 group-hover:scale-105" />
                <span className="ml-2 text-xl font-bold text-white">Retail360</span>
              </Link>
              <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-105">
                <X size={20} className="text-white" />
              </button>
            </div>
            
            {/* Navigation - Scrollable */}
            <nav className="flex-1 mt-4 overflow-y-auto overflow-x-hidden">
              <div className="px-4 space-y-2 pb-4">
                {sidebarItems.map((item, index) => (
                  item.isLogout ? (
                    <button
                      key={item.path}
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className={`w-full flex items-center px-4 py-3 text-red-300 hover:bg-red-900 hover:text-white transition-all duration-200 rounded-lg group text-left ${
                        isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{ 
                        transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                        transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
                        opacity: isOpen ? 1 : 0
                      }}
                    >
                      <item.icon size={20} className={`transition-transform duration-200 ${isLoggingOut ? 'animate-spin' : 'group-hover:scale-110'}`} />
                      <span className="ml-3 font-medium">
                        {isLoggingOut ? 'Logging out...' : item.label}
                      </span>
                    </button>
                  ) : (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 rounded-lg group ${
                        location.pathname === item.path ? 'bg-gray-800 text-white shadow-lg' : ''
                      }`}
                      style={{ 
                        transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                        transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
                        opacity: isOpen ? 1 : 0
                      }}
                    >
                      <div className="relative">
                        <item.icon size={20} className="transition-transform duration-200 group-hover:scale-110" />
                        {location.pathname === item.path && (
                          <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <span className="ml-3 font-medium">{item.label}</span>
                    </Link>
                  )
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;


