import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import {
  useCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
} from '../../Hooks/useCoupons';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CouponManagement() {

  const { data: coupons = [], isLoading, isError } = useCoupons();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  const storeUser = useSelector((state) => state.auth.user);
  let persistedUser = null;
  try {
    persistedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
  } catch (e) {
    persistedUser = null;
  }
  const user = storeUser || persistedUser;
  const sellerId = user?._id || user?.id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    value: '',
    type: 'percentage',
    minimumPurchase: '0',
    startDate: '',
    expirationDate: '',
    maxUsage: '',
    maxUsagePerUser: '1',
    status: 'active'
  });

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        value: (coupon.value ?? '').toString(),
        type: coupon.type ?? 'percentage',
        minimumPurchase: (coupon.minimumPurchase ?? 0).toString(),
        startDate: coupon.startDate ? coupon.startDate.split('T')[0] : '',
        expirationDate: coupon.expirationDate ? coupon.expirationDate.split('T')[0] : '',
        maxUsage: coupon.maxUsage ? coupon.maxUsage.toString() : '',
        maxUsagePerUser: (coupon.maxUsagePerUser ?? 1).toString(),
        status: coupon.status ?? 'active'
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        value: '',
        type: 'percentage',
        minimumPurchase: '0',
        startDate: '',
        expirationDate: '',
        maxUsage: '',
        maxUsagePerUser: '1',
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
    setFormData({
      code: '',
      value: '',
      type: 'percentage',
      minimumPurchase: '0',
      startDate: '',
      expirationDate: '',
      maxUsage: '',
      maxUsagePerUser: '1',
      status: 'active'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (formData.code.length < 6 || formData.code.length > 20) {
      toast.error('Coupon code must be between 6 and 20 characters');
      return;
    }

    if (formData.type === 'percentage' && parseFloat(formData.value) > 100) {
      toast.error('Percentage value cannot exceed 100%');
      return;
    }

    if (new Date(formData.expirationDate) <= new Date(formData.startDate)) {
      toast.error('Expiration date must be after start date');
      return;
    }
    const payload = {
      code: formData.code,
      type: formData.type,
      value: parseFloat(formData.value),
      minimumPurchase: parseFloat(formData.minimumPurchase),
      startDate: formData.startDate,
      expirationDate: formData.expirationDate,
      maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : null,
      maxUsagePerUser: parseInt(formData.maxUsagePerUser),
      status: formData.status,
      createdBy: sellerId,
    };

    if (editingCoupon) {
      const id = editingCoupon._id || editingCoupon.id;
      updateCoupon.mutate({ id, data: payload }, {
        onSuccess: () => {
          handleCloseModal();
          toast.success('Coupon updated successfully');
        },
        onError: (err) => toast.error(err?.response?.data?.message || 'Failed to update coupon'),
      });
    } else {
      createCoupon.mutate(payload, {
        onSuccess: () => {
          handleCloseModal();
          toast.success('Coupon created successfully');
        },
        onError: (err) => toast.error(err?.response?.data?.message || 'Failed to create coupon'),
      });
    }
  };

  const handleDelete = (coupon) => {
    const id = coupon._id || coupon.id;
    if (!id) {
      toast.error('Cannot delete: missing id');
      return;
    }
    deleteCoupon.mutate(id, {
      onSuccess: () => toast.success('Coupon deleted'),
      onError: (err) => toast.error(err?.response?.data?.message || 'Failed to delete coupon'),
    });
  };

  return (
    <div className="rounded-3xl border border-brandRed/10 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold font-playfair text-gray-900">
          Coupon Management
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-brandRed text-white rounded-lg hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat text-sm font-medium"
        >
          <Plus size={18} />
          Add New Coupon
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Value</th>
              <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Min Purchase</th>
              <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Expires</th>
              <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Max Usage</th>
              <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold font-montserrat text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-sm text-gray-500">Loading coupons...</td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-sm text-red-500">Failed to load coupons</td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-sm text-gray-500">No coupons found</td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id || coupon.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <span className="font-montserrat font-semibold text-gray-900">{coupon.code}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-montserrat text-gray-900">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-montserrat font-medium bg-blue-100 text-blue-700 capitalize">
                      {coupon.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-montserrat text-gray-700">${coupon.minimumPurchase}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-montserrat text-gray-600 text-sm">{coupon.expirationDate}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-montserrat text-gray-700">
                      {coupon.maxUsage ? coupon.maxUsage : '∞'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-montserrat font-medium ${coupon.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}>
                      {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(coupon)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold font-playfair text-gray-900">
                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
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
                  Coupon Code (6-20 characters)
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                  minLength={6}
                  maxLength={20}
                  required
                />
                {/* hidden seller id for backend (createdBy) */}
                <input type="hidden" name="createdBy" value={sellerId || ''} />
                <p className="mt-1 text-xs font-montserrat text-gray-500">
                  {formData.code.length}/20 characters
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                    Discount Value {formData.type === 'percentage' && '(Max 100%)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={formData.type === 'percentage' ? 100 : undefined}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                    Discount Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                    required
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                  Minimum Purchase ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minimumPurchase}
                  onChange={(e) => setFormData({ ...formData, minimumPurchase: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                    Max Usage (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxUsage}
                    onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                    Max Usage Per User
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxUsagePerUser}
                    onChange={(e) => setFormData({ ...formData, maxUsagePerUser: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={formData.expirationDate}
                    min={formData.startDate || undefined}
                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium font-montserrat text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed font-montserrat"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

