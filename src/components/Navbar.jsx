import { Menu, Bell, Settings } from 'lucide-react';
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

export default Navbar;