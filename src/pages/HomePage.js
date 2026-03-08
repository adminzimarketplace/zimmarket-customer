import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Star } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const img = product.images?.[0];

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden flex flex-col">
      <Link to={`/product/${product.id}`}>
        <div className="bg-gray-100 h-44 flex items-center justify-center overflow-hidden">
          {img ? (
            <img src={img} alt={product.name} className="w-full h-full object-cover"/>
          ) : (
            <span className="text-5xl">📦</span>
          )}
        </div>
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-800 text-sm leading-tight hover:text-green-700 transition line-clamp-2">{product.name}</h3>
        </Link>
        <p className="text-xs text-gray-400 mt-1">{product.seller?.businessName}</p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-green-700 font-bold text-lg">${product.price?.toFixed(2)}</span>
          <button
            onClick={() => { addToCart(product, 1); toast.success('Added to cart!'); }}
            className="bg-green-700 text-white p-2 rounded-lg hover:bg-green-600 transition"
          >
            <ShoppingCart size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = (s = search, cat = selectedCategory, pg = page) => {
    setLoading(true);
    const params = new URLSearchParams({ page: pg, limit: 12 });
    if (s) params.append('search', s);
    if (cat) params.append('categoryId', cat);
    api.get('/products?' + params.toString())
      .then(r => { setProducts(r.data.products); setTotalPages(r.data.pages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/products/categories').then(r => setCategories(r.data)).catch(() => {});
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(search, selectedCategory, 1);
  };

  const handleCategory = (catId) => {
    setSelectedCategory(catId);
    setPage(1);
    fetchProducts(search, catId, 1);
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl p-8 text-white text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome to ZimMarket 🇿🇼</h1>
        <p className="text-green-100 mb-6">Shop from local sellers across Zimbabwe</p>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-4 py-2.5 rounded-xl text-gray-800 focus:outline-none text-sm"
          />
          <button type="submit" className="bg-white text-green-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-green-50 transition">
            <Search size={18}/>
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => handleCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${!selectedCategory ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border hover:border-green-500'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCategory === cat.id ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border hover:border-green-500'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow h-64 animate-pulse"/>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="text-xl font-semibold text-gray-700">No products found</h3>
          <p className="text-gray-400 mt-2">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p}/>)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => { setPage(p => p-1); fetchProducts(search, selectedCategory, page-1); }} disabled={page===1} className="px-4 py-2 bg-white border rounded-lg disabled:opacity-40 hover:border-green-500 transition">Previous</button>
          <span className="px-4 py-2 bg-green-700 text-white rounded-lg font-semibold">{page} / {totalPages}</span>
          <button onClick={() => { setPage(p => p+1); fetchProducts(search, selectedCategory, page+1); }} disabled={page===totalPages} className="px-4 py-2 bg-white border rounded-lg disabled:opacity-40 hover:border-green-500 transition">Next</button>
        </div>
      )}
    </div>
  );
}
