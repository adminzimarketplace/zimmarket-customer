// ProductPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package, MapPin, Phone } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    api.get('/products/' + id)
      .then(r => setProduct(r.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-green-600 font-semibold">Loading...</div></div>;
  if (!product) return <div className="text-center py-16"><p className="text-gray-500">Product not found</p></div>;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition">
        <ArrowLeft size={18}/> Back
      </button>
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-3">
            <div className="bg-gray-100 rounded-xl h-72 flex items-center justify-center overflow-hidden">
              {product.images?.length > 0 ? (
                <img src={product.images[imgIdx]} alt={product.name} className="w-full h-full object-cover rounded-xl"/>
              ) : <span className="text-8xl">📦</span>}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${imgIdx===i ? 'border-green-500' : 'border-gray-200'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Details */}
          <div className="space-y-4">
            <div>
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">{product.category?.name || 'General'}</span>
              <h1 className="text-2xl font-bold text-gray-800 mt-2">{product.name}</h1>
              <p className="text-3xl font-bold text-green-700 mt-2">${product.price?.toFixed(2)}</p>
            </div>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Package size={16}/> <span>{product.stockQty} in stock</span>
            </div>
            {product.seller && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="font-semibold text-gray-700">Sold by: {product.seller.businessName}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={14}/>{product.seller.location}</div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1,q-1))} className="px-4 py-2 text-lg font-bold hover:bg-gray-100 transition">−</button>
                <span className="px-4 py-2 font-semibold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stockQty,q+1))} className="px-4 py-2 text-lg font-bold hover:bg-gray-100 transition">+</button>
              </div>
              <button
                onClick={() => { addToCart(product, qty); toast.success('Added to cart!'); }}
                className="flex-1 bg-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition"
              >
                <ShoppingCart size={18}/> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
