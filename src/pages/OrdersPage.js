import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  RECEIVED: 'bg-yellow-100 text-yellow-800',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  OUT_OF_STOCK: 'bg-red-100 text-red-800',
  ASSIGNED: 'bg-purple-100 text-purple-800',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(r => setOrders(r.data.orders))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-green-600 font-semibold">Loading...</div></div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">📦</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
          <Link to="/" className="bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-600 transition inline-block">Shop Now</Link>
        </div>
      ) : (
        orders.map(order => (
          <Link key={order.id} to={`/orders/${order.id}`} className="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-md transition block">
            <div className="bg-green-100 p-3 rounded-xl"><Package className="text-green-700" size={24}/></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-800">#{order.id.slice(0,8).toUpperCase()}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status.replace(/_/g,' ')}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''} · ${order.totalAmount?.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-ZW', { day:'numeric', month:'short', year:'numeric' })}</p>
            </div>
            <ChevronRight className="text-gray-400 flex-shrink-0" size={20}/>
          </Link>
        ))
      )}
    </div>
  );
}
