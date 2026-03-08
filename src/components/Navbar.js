import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">🛒</span>
          <span>ZimMarket</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-green-200 transition">Home</Link>
          {user && <Link to="/orders" className="hover:text-green-200 transition flex items-center gap-1"><Package size={16}/>My Orders</Link>}
          <Link to="/cart" className="relative hover:text-green-200 transition">
            <ShoppingCart size={22}/>
            {count > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{count}</span>}
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-green-200 text-sm">{user.name}</span>
              <button onClick={logout} className="flex items-center gap-1 hover:text-green-200 transition"><LogOut size={16}/>Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hover:text-green-200 transition">Login</Link>
              <Link to="/register" className="bg-white text-green-700 px-4 py-1.5 rounded-full font-semibold hover:bg-green-100 transition text-sm">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/cart" className="relative">
            <ShoppingCart size={22}/>
            {count > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{count}</span>}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-green-800 px-4 py-3 flex flex-col gap-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-green-200">Home</Link>
          {user && <Link to="/orders" onClick={() => setMenuOpen(false)} className="hover:text-green-200">My Orders</Link>}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="hover:text-green-200">Profile ({user.name})</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left hover:text-green-200">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-green-200">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="hover:text-green-200">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
