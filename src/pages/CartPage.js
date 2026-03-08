import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div className="text-center py-20">
      <div className="text-7xl mb-4">🛒</div>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
      <p className="text-gray-400 mb-6">Add some products to get started</p>
      <Link to="/" className="bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-600 transition inline-block">Shop Now</Link>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition"><ArrowLeft size={18}/> Continue Shopping</button>
        <button onClick={clearCart} className="text-red-500 text-sm hover:underline">Clear Cart</button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          {cart.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.images?.[0] ? <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover"/> : <span className="text-2xl">📦</span>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                <p className="text-green-700 font-bold">${item.price?.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button onClick={() => updateQty(item.id, item.qty-1)} className="px-2 py-1 hover:bg-gray-100 font-bold">−</button>
                  <span className="px-3 py-1 font-semibold">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty+1)} className="px-2 py-1 hover:bg-gray-100 font-bold">+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 transition p-1"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-6 h-fit space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
          <div className="space-y-2 text-sm">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-gray-600">
                <span className="truncate flex-1 mr-2">{item.name} x{item.qty}</span>
                <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Subtotal</span><span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-3">
              <span>Delivery fee</span><span>$5.00</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span><span className="text-green-700">${(total + 5).toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => user ? navigate('/checkout') : navigate('/login')}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition"
          >
            <ShoppingBag size={18}/> {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
