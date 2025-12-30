import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {  Trash2, ArrowLeft } from 'lucide-react';
import API_ENDPOINTS, { api } from '../../config/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%239ca3af">No Image</text></svg>';

export default function AdminProductDetails(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellerName, setSellerName] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [form, setForm] = useState({ title: '', price: '', stock: '', description: '' });
  const navigate = useNavigate();

  useEffect(()=>{
    let mounted = true;
    const fetchProduct = async ()=>{
      try{
        setLoading(true);
        const res = await api.get(API_ENDPOINTS.PRODUCTS.GET_ONE.replace(':id', id));
        const data = res.data?.data || res.data;
        if (mounted) {
          setProduct(data);
          setForm({
            title: data.title || '',
            price: data.price ?? '',
            stock: data.stock ?? '',
            description: data.description || ''
          });
        }
      }catch(err){
        console.error('Failed to load product', err);
        if (mounted) setError('Failed to load product');
      }finally{
        if (mounted) setLoading(false);
      }
    };
    if (id) fetchProduct();
    return ()=>{ mounted = false; };
  },[id]);

  // fetch seller name if only id is present
  useEffect(()=>{
    if (!product) return;
    const sellerId = product.seller_id || product.sellerId || product.seller?._id || null;
    if (!sellerId) return;
    let mounted = true;
    (async ()=>{
      try{
        const res = await api.get(`/users/public/${sellerId}/username`);
        const d = res.data?.data || res.data;
        if (mounted) setSellerName(d?.name || d?.fullname || null);
      }catch(e){
        console.error('Failed to fetch seller name', e);
      }
    })();
    return ()=>{ mounted = false; };
  },[product]);

  const onDeleteConfirmed = async ()=>{
    try{
      await api.delete(API_ENDPOINTS.SELLER.DELETE_PRODUCT(product._id));
      toast.success('Product deleted');
      navigate('/admin/products');
    }catch(err){
      console.error('Delete failed', err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Failed to delete product';
      toast.error(msg);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">Loading...</div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">{error}</div>
  );

  if (!product) return null;

  const gallery = [product.primaryImage, ...(Array.isArray(product.secondaryImages)? product.secondaryImages : [])].filter(Boolean);
  const img = gallery.length ? (gallery[0].startsWith('http') ? gallery[0] : (import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL + gallery[0] : gallery[0])) : PLACEHOLDER;

  return (
      <div className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={()=>navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600"><ArrowLeft size={18}/>Back</button>
          <h1 className="text-2xl font-semibold">Admin Product Details</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="rounded-lg overflow-hidden border bg-white">
              <img src={img} alt={product.title} className="w-full h-64 object-cover" />
              <div className="p-4">
                <p className="text-sm text-gray-500">SKU: {product.sku || '-'}</p>
                <p className="mt-2 text-lg font-semibold">{product.title}</p>
                <p className="mt-1 text-sm text-gray-600">{product.categories?.map(c=>c.name).join(', ')}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={()=>setShowDeleteConfirm(true)} className="flex items-center w-full gap-2 px-4 py-2 bg-red-600 text-white rounded-md"><Trash2 size={16}/>Delete</button>
            </div>
          </div>

          <div className="md:col-span-2 bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase">Price</p>
                <p className="font-semibold">{typeof product.price==='number'? product.price.toFixed(2)+'$' : product.price}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Stock</p>
                <p className="font-semibold">{product.stock ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Status</p>
                <p className="font-semibold">{product.status || 'active'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Seller</p>
                <p className="font-semibold">{sellerName || product.seller?.fullname || product.seller?.name || product.seller_id || '-'}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs text-gray-400 uppercase">Description</p>
              <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{product.description || '-'}</div>
            </div>
          </div>
        </div>

        {/* Delete Confirm */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
              <p className="text-sm text-gray-600 mb-4">Are you sure you want to permanently delete this product?</p>
              <div className="flex justify-end gap-2">
                <button onClick={()=>setShowDeleteConfirm(false)} className="px-4 py-2 rounded border">Cancel</button>
                <button onClick={()=>{ setShowDeleteConfirm(false); onDeleteConfirmed(); }} className="px-4 py-2 rounded bg-red-600 text-white">Delete</button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
  );
}
