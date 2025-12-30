import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '../../Hooks/useCoupons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

export default function AdminCoupons() {
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
    const currentUser = storeUser || persistedUser;
    const adminId = currentUser?._id || currentUser?.id;

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

    const openModal = (coupon = null) => {
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
                code: '', value: '', type: 'percentage', minimumPurchase: '0', startDate: '', expirationDate: '', maxUsage: '', maxUsagePerUser: '1', status: 'active'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCoupon(null);
    };

    const submit = (e) => {
        e.preventDefault();
        if (formData.code.length < 6 || formData.code.length > 20) return toast.error('Coupon code must be 6-20 chars');
        if (formData.type === 'percentage' && parseFloat(formData.value) > 100) return toast.error('Percentage cannot exceed 100%');
        if (!formData.startDate || !formData.expirationDate) return toast.error('Start date and expiration date are required');
        if (new Date(formData.expirationDate) <= new Date(formData.startDate)) return toast.error('Expiration must be after start');

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
        };
        if (adminId) payload.createdBy = adminId;

        if (editingCoupon) {
            const id = editingCoupon._id || editingCoupon.id;
            updateCoupon.mutate({ id, data: payload }, {
                onSuccess: () => { closeModal(); toast.success('Coupon updated'); },
                onError: (err) => toast.error(err?.response?.data?.message || 'Failed to update')
            });
        } else {
            createCoupon.mutate(payload, {
                onSuccess: () => { closeModal(); toast.success('Coupon created'); },
                onError: (err) => toast.error(err?.response?.data?.message || 'Failed to create')
            });
        }
    };

    const remove = (coupon) => {
        const id = coupon._id || coupon.id;
        if (!id) return toast.error('Missing id');
        deleteCoupon.mutate(id, {
            onSuccess: () => toast.success('Deleted'), 
            onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed') 
        });
    };

    return (
        <div className="rounded-3xl border border-brandRed/10 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold font-playfair text-gray-900">Admin Coupons</h2>
                    <p className="text-sm text-gray-600">Manage all coupons across the platform.</p>
                </div>
                <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-brandRed text-white rounded-lg">
                    <Plus size={18} /> Add Coupon
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 text-left">Code</th>
                            <th className="px-4 py-3 text-left">Type</th>
                            <th className="px-4 py-3 text-left">Value</th>
                            <th className="px-4 py-3 text-left">Expires</th>
                            <th className="px-4 py-3 text-left">Creator</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={6} className="px-4 py-6 text-center">Loading...</td></tr>
                        ) : isError ? (
                            <tr><td colSpan={6} className="px-4 py-6 text-center text-red-500">Failed to load coupons</td></tr>
                        ) : coupons.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-6 text-center">No coupons found</td></tr>
                        ) : (
                            coupons.map(c => (
                                <tr key={c._id || c.id} className="border-b">
                                    <td className="px-4 py-4 font-semibold">{c.code}</td>
                                    <td className="px-4 py-4">{c.type}</td>
                                    <td className="px-4 py-4">{c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}</td>
                                    <td className="px-4 py-4">{c.expirationDate?.split?.('T')?.[0] ?? c.expirationDate}</td>
                                    <td className="px-4 py-4">{c.createdBy?.fullname || c.createdBy?.email || c.createdBy || '-'}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => openModal(c)} className="p-2 hover:bg-blue-100 rounded"><Edit size={16} className="text-blue-600" /></button>
                                            <button onClick={() => remove(c)} className="p-2 hover:bg-red-100 rounded"><Trash2 size={16} className="text-red-600" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-semibold">{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h3>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded"><X size={20} /></button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code (6-20 characters)</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    minLength={6}
                                    maxLength={20}
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">{formData.code.length}/20 characters</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value {formData.type === 'percentage' && '(Max 100%)'}</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max={formData.type === 'percentage' ? 100 : undefined}
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        required
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount ($)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Purchase ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.minimumPurchase}
                                    onChange={(e) => setFormData({ ...formData, minimumPurchase: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Usage (Optional)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.maxUsage}
                                        onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        placeholder="Leave empty for unlimited"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Usage Per User</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.maxUsagePerUser}
                                        onChange={(e) => setFormData({ ...formData, maxUsagePerUser: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
                                    <input
                                        type="date"
                                        value={formData.expirationDate}
                                        min={formData.startDate || undefined}
                                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4">
                                <button type="button" onClick={closeModal} className="px-6 py-2 border border-gray-300 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-brandRed text-white rounded-lg">{editingCoupon ? 'Update Coupon' : 'Create Coupon'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
