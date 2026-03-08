import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Package, Truck } from 'lucide-react';
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

const STEPS = ['RECEIVED','CONFIRMED','ASSIGNED','OUT_FOR_DELIVERY','DELIVERED'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/' + id)
      .then(r => setOrder(r.data))
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-green-600 font-semibold">Loading...</div></div>;
  if (!order) return <div className="text-center py-16 text-gray-500">Order not found</div>;

  const stepIdx = STEPS.indexOf(order.status);

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition">
        <ArrowLeft size={18}/> My Orders
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Order #{order.id.slice(0,8).toUpperCase()}</h1>
            <p className="text-sm text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString('en-ZW')}</p>
          </div>
          <span className={`px-4 py-2 rounded-full font-semibold text-sm ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
            {order.status.replace(/_/g,' ')}
          </span>
        </div>

        {/* Progress bar */}
        {!['CANCELLED','OUT_OF_STOCK'].includes(order.status) && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {STEPS.map((step, i) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= stepIdx ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {i < stepIdx ? '✓' : i + 1}
                  </div>
                  <span className="text-xs text-gray-400 mt-1 text-center hidden md:block">{step.replace(/_/g,' ')}</span>
                  {i < STEPS.length - 1 && (
                    <div className={`absolute h-0.5 w-full ${i < stepIdx ? 'bg-green-600' : 'bg-gray-200'}`} style={{display:'none'}}/>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-3">
        <h2 className="font-bold text-gray-800 flex items-center gap-2"><Package size={18}/>Items</h2>
        {order.items?.map(item => (
          <div key={item.id} className="flex gap-3 items-center py-2 border-b last:border-0">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {item.product?.images?.[0] ? <img src={item.product.images[0]} alt="" className="w-full h-full object-cover"/> : <span className="text-xl">📦</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{item.product?.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.qty} × ${item.unitPrice?.toFixed(2)}</p>
            </div>
            <span className="font-bold text-gray-800">${item.subtotal?.toFixed(2)}</span>
          </div>
        ))}
        <div className="pt-2 space-y-1">
          <div className="flex justify-between text-sm text-gray-500"><span>Delivery fee</span><span>${order.deliveryFee?.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-green-700">${order.totalAmount?.toFixed(2)}</span></div>
        </div>
      </div>

      {/* Delivery info */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-3">
        <h2 className="font-bold text-gray-800 flex items-center gap-2"><MapPin size={18}/>Delivery Details</h2>
        <p className="text-gray-600">{order.deliveryAddress?.address}, {order.deliveryAddress?.city}</p>
        <p className="text-gray-600 flex items-center gap-2"><Phone size={14}/>{order.deliveryAddress?.phone}</p>
        {order.delivery?.riderName && (
          <div className="bg-green-50 rounded-xl p-3 flex items-center gap-3">
            <Truck className="text-green-600" size={20}/>
            <div>
              <p className="font-semibold text-gray-800">Rider: {order.delivery.riderName}</p>
              {order.delivery.riderPhone && <p className="text-sm text-gray-500">{order.delivery.riderPhone}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
