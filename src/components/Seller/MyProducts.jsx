import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSellerProductsAsync,
  createProductAsync,
  updateProductAsync,
  deleteProductAsync,
} from '../../features/productSlice';
import { fetchCategoriesAsync } from '../../features/categorySlice';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://emarketlunaluxe6.vercel.app';
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop";

const getImageUrl = (image) => {
  if (!image) return PLACEHOLDER_IMAGE;
  return image.startsWith('http') ? image : VITE_API_BASE_URL + image;
};

export default function MyProducts() {
  const dispatch = useDispatch();
  const { sellerProducts, status, error: productsError } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);
  
  const [sellerId, setSellerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '0',
    categories: [],
    published: false
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [error, setError] = useState('');
  const [primaryImage, setPrimaryImage] = useState(null);
  const [secondaryImages, setSecondaryImages] = useState([]);
  const [imagePreview, setImagePreview] = useState('');

  const isSaving = status === 'loading';
  const isDeleting = status === 'loading';

  // Fetch seller ID and products
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    try {
      const seller = JSON.parse(storedUser);
      const id = seller?._id || seller?.id;
      
      if (!id) return;
      setSellerId(id);

      dispatch(fetchSellerProductsAsync(id));
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, [dispatch]);

  // Fetch categories
  useEffect(() => {
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      stock: '0',
      categories: [],
      published: false
    });
    setPrimaryImage(null);
    setSecondaryImages([]);
    setImagePreview('');
    setEditingProduct(null);
    setError('');
  };

  const handleOpenModal = (product = null) => {
    resetForm();
    
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '0',
        categories: product.categories?.map(cat => cat._id || cat.id || cat) || [],
        published: product.published || false
      });
      setImagePreview(product.primaryImage || '');
    }
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handlePrimaryImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrimaryImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSecondaryImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSecondaryImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    
    setError('');

    // Validation
    if (!sellerId) {
      setError('Missing seller information. Please sign in again.');
      return;
    }
    if (parseFloat(formData.price) < 0) {
      setError('Price cannot be negative');
      return;
    }
    if (parseInt(formData.stock) < 0) {
      setError('Stock cannot be negative');
      return;
    }
    if (formData.categories.length === 0) {
      setError('Please select at least one category');
      return;
    }

    // Build FormData
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('price', formData.price);
    payload.append('stock', formData.stock);
    payload.append('published', formData.published);
    payload.append('seller_id', sellerId);
    
    formData.categories.forEach(catId => {
      payload.append('categories[]', catId);
    });

    if (primaryImage) {
      payload.append('primaryImage', primaryImage);
    }

    secondaryImages.forEach(file => {
      payload.append('secondaryImages', file);
    });

    try {
      if (editingProduct) {
        // Update existing product
        await dispatch(updateProductAsync({ id: editingProduct._id, productData: payload })).unwrap();
        // Refresh seller products after update
        dispatch(fetchSellerProductsAsync(sellerId));
      } else {
        // Create new product
        await dispatch(createProductAsync(payload)).unwrap();
        // Refresh seller products after creation
        dispatch(fetchSellerProductsAsync(sellerId));
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save product:', error);
      setError(error?.message || error?.response?.data?.message || 'Failed to save product. Please try again.');
    }
  };

  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
    setError('');
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete?._id || isDeleting) return;
    
    setError('');
    
    try {
      await dispatch(deleteProductAsync(productToDelete._id)).unwrap();
      // Refresh seller products after deletion
      if (sellerId) {
        dispatch(fetchSellerProductsAsync(sellerId));
      }
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      setError(error?.message || error?.response?.data?.message || 'Failed to delete product. Please try again.');
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
    setError('');
  };

  return (
    <div className="rounded-3xl border border-brandRed/10 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold font-playfair text-gray-900">
          My Products
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-brandRed text-white rounded-lg hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat text-sm font-medium"
        >
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      {productsError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 font-montserrat">{productsError}</p>
        </div>
      )}

      {sellerProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 font-montserrat border border-dashed border-brandRed/20 rounded-2xl">
          <p className="text-lg font-semibold text-gray-700 mb-2">No products yet</p>
          <p className="text-sm max-w-md">
            Once you add products, they will appear here. Use the "Add New Product" button to create your first listing.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellerProducts.map((product) => (
                <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getImageUrl(product.primaryImage)}
                        onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-semibold font-montserrat text-gray-900">{product.title}</p>
                        <p className="text-sm font-montserrat text-gray-500 line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-montserrat text-gray-900 font-semibold">
                      ${Number(product.price || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-montserrat text-gray-700">{product.stock || 0} units</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-montserrat font-medium ${
                      product.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {product.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(product)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold font-playfair text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                  rows="4"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                  Categories * (Select at least one)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {categories.map((category) => {
                    const categoryId = category._id || category.id;
                    return (
                      <label key={categoryId} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(categoryId)}
                          onChange={() => handleCategoryToggle(categoryId)}
                          className="w-4 h-4 text-brandRed border-gray-300 rounded focus:ring-brandRed"
                        />
                        <span className="font-montserrat text-sm text-gray-700">{category.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                  Primary Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePrimaryImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat file:mr-4 file:rounded-md file:border-none file:bg-brandRed file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-hoverBrandRed"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-lg border border-gray-300"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                  Secondary Images (Multiple)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleSecondaryImagesChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat file:mr-4 file:rounded-md file:border-none file:bg-brandRed file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-hoverBrandRed"
                />
                {secondaryImages.length > 0 && (
                  <p className="mt-2 text-sm font-montserrat text-gray-600">
                    {secondaryImages.length} file(s) selected
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-brandRed border-gray-300 rounded focus:ring-brandRed"
                />
                <label htmlFor="published" className="font-montserrat text-sm text-gray-700 cursor-pointer">
                  Publish this product
                </label>
              </div>

              {error && (
                <p className="text-sm text-red-600 font-montserrat">{error}</p>
              )}

              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-montserrat disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brandRed text-white rounded-lg hover:bg-hoverBrandRed transition-colors font-montserrat disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-semibold font-playfair text-gray-900 mb-2">Delete product?</h3>
            <p className="text-sm text-gray-600 font-montserrat">
              "{productToDelete?.title || 'This product'}" will be removed from your catalog. This action cannot be undone.
            </p>
            
            {error && (
              <p className="mt-3 text-sm text-red-600 font-montserrat">{error}</p>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-montserrat text-sm"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-montserrat text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}