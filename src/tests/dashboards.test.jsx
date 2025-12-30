/*
  Dashboard Role-Based Rendering Tests
  =====================================
  Test that each user role (user, seller, admin) can only access their respective dashboard
  and that the correct UI elements render based on the authenticated user's role.
  
  Test scope:
  - User (role="user") → ClientDashboard with Products
  - Seller (role="seller") → SellerPage with Sidebar and "Seller Dashboard Overview"
  - Admin (role="admin") → AdminDashboard with admin Sidebar
  - Cross-role blocking: unauthorized roles are redirected to home "/"
  - Missing auth (no token/user) → redirected to home "/"
*/

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Import the real ProtectedRoute and route components
import ProtectedRoute from '../Routes/ProtectedRoute';

// Import dashboard components
import ClientDashboard from '../pages/Client/ClientDashboard';
import SellerPage from '../pages/Seller/SellerPage';
import AdminDashboard from '../pages/Admin/AdminDashboard';

// Mock Layout to avoid cluttering test output with full Layout markup
jest.mock('../components/Layout', () => {
  return function MockLayout({ children }) {
    return <div data-testid="layout">{children}</div>;
  };
});

// Mock NavBar to reduce noise in test rendering
jest.mock('../components/NavBar', () => {
  return function MockNavBar() {
    return <div data-testid="navbar" />;
  };
});

// Mock Products component (renders on ClientDashboard)
jest.mock('../components/Client/Products', () => {
  return function MockProducts() {
    return <div data-testid="products">Products Component</div>;
  };
});

// Mock Sidebar (rendered by SellerPage and AdminDashboard)
jest.mock('../components/Shared/Sidebar', () => {
  return function MockSidebar({ navLinks, activeSection, onSelect }) {
    return (
      <div data-testid="sidebar">
        Sidebar - {navLinks && navLinks.length > 0 ? `${navLinks.length} links` : 'no links'}
      </div>
    );
  };
});

// Mock SellerStatsPage and other seller components to avoid complex dependencies
jest.mock('../components/Seller/SellerStatsPage', () => {
  return function MockSellerStats() {
    return <div data-testid="seller-stats">Seller Stats</div>;
  };
});

jest.mock('../components/Seller/MyProducts', () => {
  return function MockMyProducts() {
    return <div data-testid="my-products">My Products</div>;
  };
});

jest.mock('../components/Seller/Orders', () => {
  return function MockSellerOrders() {
    return <div data-testid="seller-orders">Seller Orders</div>;
  };
});

jest.mock('../components/Seller/CouponManagement', () => {
  return function MockCouponMgmt() {
    return <div data-testid="coupon-mgmt">Coupon Management</div>;
  };
});

// Mock useCart hook to avoid cart initialization on ClientDashboard mount
jest.mock('../hooks/useCart', () => ({
  useCart: jest.fn(),
}));

// Mock admin nested routes to reduce complexity
jest.mock('../pages/Admin/AdminOverview', () => {
  return function MockAdminOverview() {
    return <div data-testid="admin-overview">Admin Overview</div>;
  };
});

jest.mock('../pages/Admin/AdminReports', () => {
  return function MockAdminReports() {
    return <div data-testid="admin-reports">Admin Reports</div>;
  };
});

jest.mock('../pages/Admin/AdminProducts', () => {
  return function MockAdminProducts() {
    return <div data-testid="admin-products">Admin Products</div>;
  };
});

jest.mock('../pages/Admin/AdminProductDetails', () => {
  return function MockAdminProductDetails() {
    return <div data-testid="admin-product-details">Admin Product Details</div>;
  };
});

jest.mock('../pages/Admin/AdminCategories', () => {
  return function MockAdminCategories() {
    return <div data-testid="admin-categories">Admin Categories</div>;
  };
});

jest.mock('../components/Admin/UserManagement', () => {
  return function MockUserManagement() {
    return <div data-testid="admin-users">User Management</div>;
  };
});

jest.mock('../pages/Admin/FeedbackPage', () => {
  return function MockFeedbackPage() {
    return <div data-testid="admin-feedback">Feedback</div>;
  };
});

jest.mock('../pages/Admin/AdminCoupons', () => {
  return function MockAdminCoupons() {
    return <div data-testid="admin-coupons">Admin Coupons</div>;
  };
});

jest.mock('../pages/Admin/OrdersPage', () => {
  return function MockOrdersPage() {
    return <div data-testid="admin-orders">Admin Orders</div>;
  };
});

jest.mock('../pages/Admin/DeletedOrdersPage', () => {
  return function MockDeletedOrdersPage() {
    return <div data-testid="admin-deleted-orders">Deleted Orders</div>;
  };
});

// Mock IndexPage for home/redirect fallback
jest.mock('../pages/Index/IndexPage', () => {
  return function MockIndexPage() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

// Helper: set up localStorage with user and token
const setAuthToken = (user, token = 'test-token-123') => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

// Helper: create a minimal Redux store for tests that need it
const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: (state = { user: null, isAuthenticated: false }) => state,
    },
  });
};

// Test suite
describe('Dashboard Role-Based Rendering', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ============ USER / CLIENT DASHBOARD TESTS ============
  describe('ClientDashboard - User Role (role="user")', () => {
    it('should render ClientDashboard when user has role="user"', () => {
      // Arrange: set up user with role="user"
      setAuthToken({ _id: 'user1', role: 'user', email: 'user@test.com' });
      const store = createMockStore();

      // Act: render the /client route with ProtectedRoute
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/client']}>
            <Routes>
              <Route
                path="/client"
                element={
                  <ProtectedRoute requiredRole="user">
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Assert: ClientDashboard renders (indicated by Products component)
      expect(screen.getByTestId('products')).toBeInTheDocument();
      expect(screen.getByText('Products Component')).toBeInTheDocument();
    });

    it('should render Products component on ClientDashboard', () => {
      // Verify the Products component is actually rendered in the user dashboard
      setAuthToken({ _id: 'user2', role: 'user', email: 'user2@test.com' });
      const store = createMockStore();

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/client']}>
            <Routes>
              <Route
                path="/client"
                element={
                  <ProtectedRoute requiredRole="user">
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('products')).toBeInTheDocument();
    });

    it('should NOT render ClientDashboard when user has role="seller"', () => {
      // Arrange: set up seller user trying to access user dashboard
      setAuthToken({ _id: 'seller1', role: 'seller', email: 'seller@test.com' });
      const store = createMockStore();

      // Act: try to render /client route with requiredRole="user"
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/client']}>
            <Routes>
              <Route
                path="/client"
                element={
                  <ProtectedRoute requiredRole="user">
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Assert: ProtectedRoute redirects to home; ClientDashboard is NOT rendered
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('products')).not.toBeInTheDocument();
    });

    it('should NOT render ClientDashboard when user has role="admin"', () => {
      // Arrange: set up admin user trying to access user dashboard
      setAuthToken({ _id: 'admin1', role: 'admin', email: 'admin@test.com' });
      const store = createMockStore();

      // Act: try to render /client route
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/client']}>
            <Routes>
              <Route
                path="/client"
                element={
                  <ProtectedRoute requiredRole="user">
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Assert: redirected to home
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('products')).not.toBeInTheDocument();
    });
  });

  // ============ SELLER DASHBOARD TESTS ============
  describe('SellerPage - Seller Role (role="seller")', () => {
    it('should render SellerPage when user has role="seller"', () => {
      // Arrange: set up seller user
      setAuthToken({ _id: 'seller1', role: 'seller', email: 'seller@test.com' });
      const store = createMockStore();

      // Act: render /seller route with ProtectedRoute
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/seller/seller1']}>
            <Routes>
              <Route
                path="/seller/:sellerId?"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Assert: SellerPage renders (sidebar and title should be visible)
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByText(/Seller Dashboard Overview/i)).toBeInTheDocument();
    });

    it('should show seller sidebar navigation links', () => {
      // Verify the seller sidebar is rendered with nav links
      setAuthToken({ _id: 'seller2', role: 'seller', email: 'seller2@test.com' });
      const store = createMockStore();

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/seller/seller2']}>
            <Routes>
              <Route
                path="/seller/:sellerId?"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('should NOT render SellerPage when user has role="user"', () => {
      // Arrange: set up user trying to access seller dashboard
      setAuthToken({ _id: 'user1', role: 'user', email: 'user@test.com' });
      const store = createMockStore();

      // Act: try to render /seller route
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/seller/seller1']}>
            <Routes>
              <Route
                path="/seller/:sellerId?"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Assert: redirected to home
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByText(/Seller Dashboard Overview/i)).not.toBeInTheDocument();
    });

    it('should NOT render SellerPage when user has role="admin"', () => {
      // Arrange: set up admin trying to access seller dashboard
      setAuthToken({ _id: 'admin1', role: 'admin', email: 'admin@test.com' });
      const store = createMockStore();

      // Act: try to render /seller route
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/seller/seller1']}>
            <Routes>
              <Route
                path="/seller/:sellerId?"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Assert: redirected to home
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByText(/Seller Dashboard Overview/i)).not.toBeInTheDocument();
    });
  });

  // ============ ADMIN DASHBOARD TESTS ============
  describe('AdminDashboard - Admin Role (role="admin")', () => {
    it('should render AdminDashboard when user has role="admin"', () => {
      // Arrange: set up admin user
      setAuthToken({ _id: 'admin1', role: 'admin', email: 'admin@test.com' });
      const store = createMockStore();

      // Act: render /admin route with ProtectedRoute
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/admin']}>
            <Routes>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<div data-testid="admin-overview">Admin Overview</div>} />
              </Route>
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Assert: AdminDashboard renders (sidebar should be visible)
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('admin-overview')).toBeInTheDocument();
    });

    it('should show admin sidebar', () => {
      // Verify admin sidebar is rendered
      setAuthToken({ _id: 'admin2', role: 'admin', email: 'admin2@test.com' });
      const store = createMockStore();

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/admin']}>
            <Routes>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<div data-testid="admin-overview">Overview</div>} />
              </Route>
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('should NOT render AdminDashboard when user has role="user"', () => {
      // Arrange: set up user trying to access admin dashboard
      setAuthToken({ _id: 'user1', role: 'user', email: 'user@test.com' });
      const store = createMockStore();

      // Act: try to render /admin route
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/admin']}>
            <Routes>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<div data-testid="admin-overview">Overview</div>} />
              </Route>
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Assert: redirected to home
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    });

    it('should NOT render AdminDashboard when user has role="seller"', () => {
      // Arrange: set up seller trying to access admin dashboard
      setAuthToken({ _id: 'seller1', role: 'seller', email: 'seller@test.com' });
      const store = createMockStore();

      // Act: try to render /admin route
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/admin']}>
            <Routes>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<div data-testid="admin-overview">Overview</div>} />
              </Route>
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Assert: redirected to home
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    });
  });

  // ============ AUTHENTICATION / NO AUTH TESTS ============
  describe('ProtectedRoute - Missing Authentication', () => {
    it('should redirect to home when no token is present', () => {
      // Arrange: localStorage is empty (no token)
      localStorage.clear();
      const store = createMockStore();

      // Act: try to render /client route
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/client']}>
            <Routes>
              <Route
                path="/client"
                element={
                  <ProtectedRoute requiredRole="user">
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Assert: redirected to home; ClientDashboard not rendered
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('products')).not.toBeInTheDocument();
    });

    it('should redirect to home when token exists but no user data', () => {
      // Arrange: token exists but user JSON is missing or invalid
      localStorage.setItem('token', 'test-token-123');
      // user is not set, so it's null
      const store = createMockStore();

      // Act: try to render /admin route
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/admin']}>
            <Routes>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<div data-testid="admin-overview">Overview</div>} />
              </Route>
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Assert: redirected to home
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    });

    it('should handle invalid JSON in user localStorage gracefully', () => {
      // Arrange: set invalid JSON in user localStorage
      localStorage.setItem('token', 'test-token-123');
      localStorage.setItem('user', 'not-valid-json{]');
      const store = createMockStore();

      // Act: try to render /seller route
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/seller/seller1']}>
            <Routes>
              <Route
                path="/seller/:sellerId?"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Assert: ProtectedRoute handles the error and redirects to home
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByText(/Seller Dashboard Overview/i)).not.toBeInTheDocument();
    });
  });

  // ============ INTEGRATION TESTS ============
  describe('Dashboard Integration - Verify Each Role', () => {
    it('should verify user role can only access user dashboard', () => {
      // Arrange: set user role
      setAuthToken({ _id: 'user1', role: 'user', email: 'user@test.com' });
      const store = createMockStore();

      // Act: render user dashboard
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/client']}>
            <Routes>
              <Route
                path="/client"
                element={
                  <ProtectedRoute requiredRole="user">
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Assert: user can see their dashboard (Products component visible)
      expect(screen.getByTestId('products')).toBeInTheDocument();
      // Verify other dashboard types are NOT visible
      expect(screen.queryByText(/Seller Dashboard Overview/i)).not.toBeInTheDocument();
      expect(screen.queryByTestId('admin-overview')).not.toBeInTheDocument();
    });

    it('should verify seller role can only access seller dashboard', () => {
      // Arrange: set seller role
      setAuthToken({ _id: 'seller1', role: 'seller', email: 'seller@test.com' });
      const store = createMockStore();

      // Act: render seller dashboard
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/seller/seller1']}>
            <Routes>
              <Route
                path="/seller/:sellerId?"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Assert: seller can see their dashboard
      expect(screen.getByText(/Seller Dashboard Overview/i)).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      // Verify other dashboard types are NOT visible
      expect(screen.queryByTestId('products')).not.toBeInTheDocument();
      expect(screen.queryByTestId('admin-overview')).not.toBeInTheDocument();
    });

    it('should verify admin role can only access admin dashboard', () => {
      // Arrange: set admin role
      setAuthToken({ _id: 'admin1', role: 'admin', email: 'admin@test.com' });
      const store = createMockStore();

      // Act: render admin dashboard
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/admin']}>
            <Routes>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<div data-testid="admin-overview">Admin Overview</div>} />
              </Route>
              <Route path="/" element={<div data-testid="home-page">Home</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Assert: admin can see their dashboard
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('admin-overview')).toBeInTheDocument();
      // Verify other dashboard types are NOT visible
      expect(screen.queryByTestId('products')).not.toBeInTheDocument();
      expect(screen.queryByText(/Seller Dashboard Overview/i)).not.toBeInTheDocument();
    });
  });
});
