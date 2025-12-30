// Centralized nav link arrays for sidebars (admin & seller)
const adminNavLinks = [
  { id: 'overview', label: 'Dashboard Overview', icon: '🏠', path: '/admin' },
  { id: 'reports', label: 'Reports & Analytics', icon: '📊', path: '/admin/reports' },
  { id: 'products', label: 'Product Management', icon: '🛍️', path: '/admin/products' },
  { id: 'categories', label: 'Category Management', icon: '🗂️', path: '/admin/categories' },
  { id: 'users', label: 'User Management', icon: '👥', path: '/admin/users' },
  { id: 'feedback', label: 'Feedback Management', icon: '💬', path: '/admin/feedback' },
  { id: 'orders', label: 'Orders', icon: '📦', path: '/admin/orders' },
  { id: 'ordersDeleted', label: 'Orders Deleted', icon: '🗑️', path: '/admin/orders/deleted' },
  { id: 'coupons', label: 'Coupon Management', icon: '🎫', path: '/admin/coupons' },
];

const sellerNavLinks = [
  { id: 'overview', label: 'Dashboard Overview', icon: '🏠' },
  { id: 'my-products', label: 'My Products', icon: '🛍️' },
  { id: 'orders', label: 'Orders', icon: '📦' },
  { id: 'coupon-management', label: 'Manage Coupons', icon: '🎫' },
];

export { adminNavLinks, sellerNavLinks };
