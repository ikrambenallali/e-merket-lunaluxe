import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../config/api';
import API_ENDPOINTS from '../../config/api';
import { Link } from 'react-router-dom';

const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.PRODUCTS.GET_ALL);
      return res.data.data || res.data || [];
    },
  });

export default function AdminProducts() {
  const { data: products = [], isLoading } = useProducts();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return products;
    return products.filter((p) => (p.title || '').toLowerCase().includes(search.toLowerCase()) || (p.sku || '').toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  if (isLoading) return <p>Loading products...</p>;

  return (
    <div className="flex flex-col gap-10">
      <header>
        <p className="text-sm font-montserrat uppercase tracking-widest text-brandRed">Product Management</p>
        <h1 className="mt-2 text-3xl font-playfair font-semibold text-gray-900">Catalogue</h1>
        <p className="mt-2 text-sm font-montserrat text-gray-600">Browse and inspect products from the database.</p>
      </header>

      <section className="rounded-3xl border border-brandRed/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-playfair font-semibold text-gray-900">All Products</h2>
            <p className="text-sm font-montserrat text-gray-500">Click "View" to inspect product details.</p>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or SKU"
            className="w-full max-w-sm rounded-2xl border border-gray-200 px-4 py-2 text-sm font-montserrat text-gray-700 placeholder:text-gray-400 focus:border-brandRed focus:outline-none focus:ring-1 focus:ring-brandRed"
          />
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-left text-sm font-montserrat">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">Product</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">SKU</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">Price</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">Stock</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">Seller</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product) => (
                <tr key={product._id} className="align-top">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 overflow-hidden rounded-md bg-gray-100">
                        <img src={ product.primaryImage? import.meta.env.VITE_BASE_URL + product.primaryImage : (product.secondaryImages && product.secondaryImages.length > 0 
                                 ? import.meta.env.VITE_BASE_URL + product.secondaryImages[0] : 'https://placehold.co/600x400')} alt={product.title} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{product.title}</p>
                        <p className="text-xs text-gray-400">{product.categories?.map(c => c.name).join(', ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.sku || '-'}</td>
                  <td className="px-4 py-3 text-gray-800">{typeof product.price === 'number' ? product.price.toFixed(2) + '$' : product.price}</td>
                  <td className="px-4 py-3 text-gray-600">{product.stock ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{product.seller_id? product.seller_id : '-'}</td>
                  <td className="px-4 py-3">
                      <div className="flex gap-2">
                      <Link to={`/admin/products/${product._id}`} className="rounded-full border border-brandRed px-3 py-1 text-xs font-semibold font-montserrat text-brandRed hover:bg-brandRed hover:text-white transition">View</Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm font-montserrat text-gray-400">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

