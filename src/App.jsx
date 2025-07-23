import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ShopManagement from './pages/Shop'
import ProductManagement from './pages/Products'
import Category from './pages/Cat'  
import Customers from './pages/Customers'
import Sales from './pages/Sales'
import StocksMove from './pages/StocksMovement'
import StockAdjustment from './pages/StocksAdjust'
import Supplier from './pages/Supplier'
import Reports from './pages/advanceReports'
import Promo from './pages/Promo'
import Settings from './pages/Settings'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shop" element={<ShopManagement />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/category" element={<Category />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/sales" element={<Sales/>} />
          <Route path="/stocksMove" element={<StocksMove/>} />
          <Route path="/editStocks" element={<StockAdjustment/>} />
          <Route path="/Supplier" element={<Supplier/>} />
          <Route path="/reports" element={<Reports/>} />
          <Route path="/promo" element={<Promo/>} />
          <Route path="/settings" element={<Settings/>} />
          {/* Catch all route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App