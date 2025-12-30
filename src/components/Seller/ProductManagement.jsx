import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const staticProducts = [
  {
    id: 1,
    title: "Modern Ceramic Computer",
    description: "Dibbert, Moore and Thiel's most advanced Hat technology",
    price: 35.37,
    stock: 58,
    category: "Electronics"
  },
  {
    id: 2,
    title: "Licensed Rubber Shoes",
    description: "Soft Shirt designed with Aluminum for glossy performance",
    price: 14.74,
    stock: 98,
    category: "Footwear"
  },
  {
    id: 3,
    title: "Fresh Gold Pants",
    description: "New cyan Bacon with ergonomic design for defenseless comfort",
    price: 60.32,
    stock: 21,
    category: "Clothing"
  },
];

export default function ProductManagement() {
  const [products, setProducts] = useState(staticProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        stock: '',
        category: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      stock: '',
      category: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      // Update product
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...editingProduct, ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) }
          : p
      ));
    } else {
      // Create new product
      const newProduct = {
        id: products.length + 1,
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };
      setProducts([...products, newProduct]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="rounded-3xl border border-brandRed/10 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold font-playfair text-gray-900">
          Product Management
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-brandRed text-white rounded-lg hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat text-sm font-medium"
        >
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div>
                    <p className="font-semibold font-montserrat text-gray-900">{product.title}</p>
                    <p className="text-sm font-montserrat text-gray-500 line-clamp-1">{product.description}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="font-montserrat text-gray-700">{product.category}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="font-montserrat font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="font-montserrat text-gray-700">{product.stock} units</span>
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
                      onClick={() => handleDelete(product.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold font-playfair text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                  Product Title
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
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Home">Home</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-montserrat"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brandRed text-white rounded-lg hover:bg-hoverBrandRed transition-colors font-montserrat"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

