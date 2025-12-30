// auth.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProtectedRoute from '../Routes/ProtectedRoute';
import authReducer from '../features/authSlice';

// Mock components for testing
const MockAdminDashboard = () => <div>Admin Dashboard</div>;
const MockSellerDashboard = () => <div>Seller Dashboard</div>;
const MockUserDashboard = () => <div>User Dashboard</div>;

// Helper function to create a test store
const createTestStore = (initialAuthState = { token: null, user: null }) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: initialAuthState,
    },
  });
};

// Helper function to render with router and store
const renderWithProviders = (ui, { store = createTestStore(), initialEntries = ['/'], ...options } = {}) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    </Provider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};

// Helper to set localStorage
const setLocalStorage = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Helper to clear localStorage
const clearLocalStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

describe('Authentication & Role-Based Access Control', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    clearLocalStorage();
    // Mock console.error to avoid noise in test output (except for specific error tests)
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    clearLocalStorage();
    jest.clearAllMocks();
    // Restore console.error after each test
    console.error.mockRestore();
  });

  describe('ProtectedRoute - Unauthenticated Access', () => {
    it('should redirect to home (/) when user is not authenticated', () => {
      clearLocalStorage();
      
      renderWithProviders(
        <ProtectedRoute>
          <MockUserDashboard />
        </ProtectedRoute>,
        { initialEntries: ['/protected'] }
      );

      // Should not render the protected content
      expect(screen.queryByText('User Dashboard')).not.toBeInTheDocument();
    });

    it('should redirect when token is missing', () => {
      localStorage.setItem('user', JSON.stringify({ role: 'user' }));
      
      renderWithProviders(
        <ProtectedRoute>
          <MockUserDashboard />
        </ProtectedRoute>,
        { initialEntries: ['/protected'] }
      );

      expect(screen.queryByText('User Dashboard')).not.toBeInTheDocument();
    });

    it('should redirect when user data is missing', () => {
      localStorage.setItem('token', 'fake-token');
      
      renderWithProviders(
        <ProtectedRoute>
          <MockUserDashboard />
        </ProtectedRoute>,
        { initialEntries: ['/protected'] }
      );

      expect(screen.queryByText('User Dashboard')).not.toBeInTheDocument();
    });

    it('should not allow unauthenticated user to access any protected route', () => {
      clearLocalStorage();
      
      renderWithProviders(
        <ProtectedRoute requiredRole="admin">
          <MockAdminDashboard />
        </ProtectedRoute>,
        { initialEntries: ['/admin'] }
      );

      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    });
  });

  describe('ProtectedRoute - Role-Based Access Control', () => {
    it('should allow user with correct role to access protected route', () => {
      setLocalStorage('valid-token', { role: 'user', id: '1', name: 'Test User' });
      
      renderWithProviders(
        <ProtectedRoute requiredRole="user">
          <MockUserDashboard />
        </ProtectedRoute>
      );

      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
    });

    it('should prevent user from accessing admin dashboard', () => {
      setLocalStorage('valid-token', { role: 'user', id: '1', name: 'Regular User' });
      
      renderWithProviders(
        <ProtectedRoute requiredRole="admin">
          <MockAdminDashboard />
        </ProtectedRoute>,
        { initialEntries: ['/admin'] }
      );

      // Should redirect, so admin dashboard should not be visible
      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    });

    it('should prevent user from accessing seller dashboard', () => {
      setLocalStorage('valid-token', { role: 'user', id: '1', name: 'Regular User' });
      
      renderWithProviders(
        <ProtectedRoute requiredRole="seller">
          <MockSellerDashboard />
        </ProtectedRoute>,
        { initialEntries: ['/seller'] }
      );

      // Should redirect, so seller dashboard should not be visible
      expect(screen.queryByText('Seller Dashboard')).not.toBeInTheDocument();
    });

    it('should allow admin to access admin dashboard', () => {
      setLocalStorage('valid-token', { role: 'admin', id: '1', name: 'Admin User' });
      
      renderWithProviders(
        <ProtectedRoute requiredRole="admin">
          <MockAdminDashboard />
        </ProtectedRoute>
      );

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('should prevent admin from accessing seller dashboard', () => {
      setLocalStorage('valid-token', { role: 'admin', id: '1', name: 'Admin User' });
      
      renderWithProviders(
        <ProtectedRoute requiredRole="seller">
          <MockSellerDashboard />
        </ProtectedRoute>,
        { initialEntries: ['/seller'] }
      );

      expect(screen.queryByText('Seller Dashboard')).not.toBeInTheDocument();
    });

    it('should allow seller to access seller dashboard', () => {
      setLocalStorage('valid-token', { role: 'seller', id: '1', name: 'Seller User' });
      
      renderWithProviders(
        <ProtectedRoute requiredRole="seller">
          <MockSellerDashboard />
        </ProtectedRoute>
      );

      expect(screen.getByText('Seller Dashboard')).toBeInTheDocument();
    });

    it('should prevent seller from accessing admin dashboard', () => {
      setLocalStorage('valid-token', { role: 'seller', id: '1', name: 'Seller User' });
      
      renderWithProviders(
        <ProtectedRoute requiredRole="admin">
          <MockAdminDashboard />
        </ProtectedRoute>,
        { initialEntries: ['/admin'] }
      );

      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    });

    it('should prevent seller from accessing user dashboard', () => {
      setLocalStorage('valid-token', { role: 'seller', id: '1', name: 'Seller User' });
      
      renderWithProviders(
        <ProtectedRoute requiredRole="user">
          <MockUserDashboard />
        </ProtectedRoute>,
        { initialEntries: ['/client'] }
      );

      expect(screen.queryByText('User Dashboard')).not.toBeInTheDocument();
    });
  });

  describe('ProtectedRoute - Edge Cases', () => {
    it('should handle invalid JSON in localStorage user data', () => {
      // Restore console.error for this test to verify error handling
      console.error.mockRestore();
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      localStorage.setItem('token', 'valid-token');
      localStorage.setItem('user', 'invalid-json');
      
      renderWithProviders(
        <ProtectedRoute>
          <MockUserDashboard />
        </ProtectedRoute>,
        { initialEntries: ['/protected'] }
      );

      expect(screen.queryByText('User Dashboard')).not.toBeInTheDocument();
      // Verify that error was logged
      expect(errorSpy).toHaveBeenCalled();
      
      errorSpy.mockRestore();
      // Re-mock for other tests
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should handle empty user object', () => {
      localStorage.setItem('token', 'valid-token');
      localStorage.setItem('user', JSON.stringify({}));
      
      renderWithProviders(
        <ProtectedRoute requiredRole="admin">
          <MockAdminDashboard />
        </ProtectedRoute>,
        { initialEntries: ['/admin'] }
      );

      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    });

    it('should handle user with null role', () => {
      setLocalStorage('valid-token', { role: null, id: '1' });
      
      renderWithProviders(
        <ProtectedRoute requiredRole="admin">
          <MockAdminDashboard />
        </ProtectedRoute>,
        { initialEntries: ['/admin'] }
      );

      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    });

    it('should allow access when no role is required', () => {
      setLocalStorage('valid-token', { role: 'user', id: '1' });
      
      renderWithProviders(
        <ProtectedRoute>
          <MockUserDashboard />
        </ProtectedRoute>
      );

      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
    });
  });

  describe('ProtectedRoute - Multiple Role Scenarios', () => {
    it('should allow authenticated user without role requirement', () => {
      setLocalStorage('valid-token', { role: 'user', id: '1' });
      
      renderWithProviders(
        <ProtectedRoute>
          <div>Any Authenticated User</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Any Authenticated User')).toBeInTheDocument();
    });

    it('should enforce role requirement when specified', () => {
      setLocalStorage('valid-token', { role: 'user', id: '1' });
      
      renderWithProviders(
        <ProtectedRoute requiredRole="admin">
          <MockAdminDashboard />
        </ProtectedRoute>,
        { initialEntries: ['/admin'] }
      );

      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    });
  });
});

