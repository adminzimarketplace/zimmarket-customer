import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Harare');
  const [phone, setPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('ecocash');
  const [loading, setLoading] = useState(false);

  const deliveryFee = 5;
  const grandTotal = total + deliveryFee;

  const handleOrder = async () => {
    if (!address) return toast.error('Enter your delivery address');
    if (!phone) return toast.error('Enter your phone number');
    setLoading(true);
    try {
      const items = cart.map(i => ({ productId: i.id, qty: i.qty }));
      const { data } = await api.post('/orders', {
        items,
        deliveryAddress: { address, city, phone },
        deliveryFee,
        paymentMethod,
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders/' + data.order.id);
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

      {/* Delivery details */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">📍 Delivery Details</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="e.g. 15 Samora Machel Ave, CBD"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option>Harare</option>
            <option>Bulawayo</option>
            <option>Chitungwiza</option>
            <option>Mutare</option>
            <option>Gweru</option>
            <option>Kwekwe</option>
            <option>Masvingo</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+263771234567"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Payment method */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-3">
        <h2 className="text-lg font-bold text-gray-800">💳 Payment Method</h2>
        {[
          { value: 'ecocash', label: '📱 EcoCash', desc: 'Pay with your EcoCash wallet' },
          { value: 'onemoney', label: '📱 OneMoney', desc: 'Pay with OneMoney' },
          { value: 'cash', label: '💵 Cash on Delivery', desc: 'Pay when your order arrives' },
        ].map(opt => (
          <label key={opt.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === opt.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
            <input type="radio" value={opt.value} checked={paymentMethod === opt.value} onChange={e => setPaymentMethod(e.target.value)} className="accent-green-600"/>
            <div>
              <div className="font-semibold text-gray-800">{opt.label}</div>
              <div className="text-sm text-gray-500">{opt.desc}</div>
            </div>
          </label>
        ))}
      </div>

      {/* Order summary */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-3">
        <h2 className="text-lg font-bold text-gray-800">🧾 Order Summary</h2>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between text-sm text-gray-600">
            <span className="truncate flex-1 mr-2">{item.name} × {item.qty}</span>
            <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-3 space-y-1">
          <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm text-gray-500"><span>Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-green-700">${grandTotal.toFixed(2)}</span></div>
        </div>
      </div>

      <button
        onClick={handleOrder}
        disabled={loading}
        className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 disabled:opacity-50 transition"
      >
        {loading ? 'Placing Order...' : `Place Order — $${grandTotal.toFixed(2)}`}
      </button>
    </div>
  );
}
