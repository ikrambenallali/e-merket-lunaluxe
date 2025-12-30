// checkout.test.jsx - Integration Tests for Checkout
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import CreateOrder from '../components/Client/createOrder';
import useOrders from '../Hooks/UseOrders';
import { createOrder } from '../features/orderSlice';
import authReducer from '../features/authSlice';
import cartReducer, { setCart } from '../features/cartSlice';
import { api } from '../config/api';

// Mock dependencies
jest.mock('../config/api');
jest.mock('../hooks/UseOrders');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock navigate
const mockNavigate = jest.fn();
useNavigate.mockReturnValue(mockNavigate);

// Helper to create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      orders: (state = { orders: [], loading: false, error: null }, action) => state,
    },
    preloadedState: {
      auth: {
        token: 'test-token',
        user: { _id: 'user1', name: 'Test User' },
        ...initialState.auth,
      },
      cart: {
        items: [],
        total: 0,
        discount: 0,
        ...initialState.cart,
      },
    },
  });
};

// Helper to render with providers
const renderWithProviders = (ui, { store = createTestStore(), ...options } = {}) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </Provider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};

// Mock cart item
const mockCartItem = {
  _id: 'cartItem1',
  id: 'product1',
  productId: {
    _id: 'product1',
    title: 'Test Product',
    price: 29.99,
  },
  quantity: 2,
};

describe('Checkout - Integration Tests', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
    api.post.mockClear();
    mockNavigate.mockClear();
  });

  describe('CreateOrder Component', () => {
    it('should render checkout form', () => {
      const mockUseOrders = {
        addOrder: jest.fn(),
        loading: false,
        updateOrderStatus: jest.fn(),
        orders: [],
      };
      useOrders.mockReturnValue(mockUseOrders);

      renderWithProviders(<CreateOrder />, { store });

      expect(screen.getByRole('heading', { name: 'Create Order' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your coupon')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Order' })).toBeInTheDocument();
    });

    it('should allow user to enter coupon code', () => {
      const mockUseOrders = {
        addOrder: jest.fn(),
        loading: false,
        updateOrderStatus: jest.fn(),
        orders: [],
      };
      useOrders.mockReturnValue(mockUseOrders);

      renderWithProviders(<CreateOrder />, { store });

      const couponInput = screen.getByPlaceholderText('Enter your coupon');
      fireEvent.change(couponInput, { target: { value: 'DISCOUNT10' } });

      expect(couponInput.value).toBe('DISCOUNT10');
    });

    it('should create order without coupon when form is submitted', async () => {
      const mockOrder = {
        _id: 'order1',
        userId: 'user1',
        items: [mockCartItem],
        total: 59.98,
        status: 'pending',
      };

      api.post.mockResolvedValue({
        data: {
          data: {
            order: mockOrder,
          },
        },
      });

      const mockUseOrders = {
        addOrder: jest.fn(),
        loading: false,
        updateOrderStatus: jest.fn(),
        orders: [],
      };
      useOrders.mockReturnValue(mockUseOrders);

      renderWithProviders(<CreateOrder />, { store });

      const submitButton = screen.getByRole('button', { name: 'Create Order' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/orders', { coupons: [] });
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/client/orders/order1', {
          state: { orders: mockOrder },
        });
      });
    });

    it('should create order with coupon when coupon is provided', async () => {
      const mockOrder = {
        _id: 'order1',
        userId: 'user1',
        items: [mockCartItem],
        total: 59.98,
        status: 'pending',
      };

      api.post.mockResolvedValue({
        data: {
          data: {
            order: mockOrder,
          },
        },
      });

      const mockUseOrders = {
        addOrder: jest.fn(),
        loading: false,
        updateOrderStatus: jest.fn(),
        orders: [],
      };
      useOrders.mockReturnValue(mockUseOrders);

      renderWithProviders(<CreateOrder />, { store });

      const couponInput = screen.getByPlaceholderText('Enter your coupon');
      fireEvent.change(couponInput, { target: { value: 'DISCOUNT10' } });

      const submitButton = screen.getByRole('button', { name: 'Create Order' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/orders', { coupons: ['DISCOUNT10'] });
      });
    });

    it('should show loading state when creating order', async () => {
      api.post.mockImplementation(() => new Promise(() => {})); // Never resolves

      const mockUseOrders = {
        addOrder: jest.fn(),
        loading: true,
        updateOrderStatus: jest.fn(),
        orders: [],
      };
      useOrders.mockReturnValue(mockUseOrders);

      renderWithProviders(<CreateOrder />, { store });

      expect(screen.getByText('Creating...')).toBeInTheDocument();
    });

    it('should handle order creation error', async () => {
      const mockError = new Error('Failed to create order');
      api.post.mockRejectedValue(mockError);

      const mockUseOrders = {
        addOrder: jest.fn(),
        loading: false,
        updateOrderStatus: jest.fn(),
        orders: [],
      };
      useOrders.mockReturnValue(mockUseOrders);

      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      renderWithProviders(<CreateOrder />, { store });

      const submitButton = screen.getByRole('button', { name: 'Create Order' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalled();
      });

      await waitFor(() => {
        // createOrder uses rejectWithValue which returns a string (err.message), not an Error object
        expect(consoleSpy).toHaveBeenCalledWith('ERROR CREATE ORDER', 'Failed to create order');
      });

      consoleSpy.mockRestore();
    });

    it('should not navigate if order creation fails', async () => {
      const mockError = new Error('Failed to create order');
      api.post.mockRejectedValue(mockError);

      const mockUseOrders = {
        addOrder: jest.fn(),
        loading: false,
        updateOrderStatus: jest.fn(),
        orders: [],
      };
      useOrders.mockReturnValue(mockUseOrders);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      renderWithProviders(<CreateOrder />, { store });

      const submitButton = screen.getByRole('button', { name: 'Create Order' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalled();
      });

      // Navigate should not be called on error
      expect(mockNavigate).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Checkout Flow Integration', () => {
    it('should complete full checkout flow: cart -> checkout -> order', async () => {
      // Setup: Add items to cart
      store.dispatch(setCart({ items: [mockCartItem] }));

      const mockOrder = {
        _id: 'order1',
        userId: 'user1',
        items: [mockCartItem],
        total: 59.98,
        status: 'pending',
      };

      api.post.mockResolvedValue({
        data: {
          data: {
            order: mockOrder,
          },
        },
      });

      const mockUseOrders = {
        addOrder: jest.fn(),
        loading: false,
        updateOrderStatus: jest.fn(),
        orders: [],
      };
      useOrders.mockReturnValue(mockUseOrders);

      renderWithProviders(<CreateOrder />, { store });

      // Verify cart state
      const cartState = store.getState().cart;
      expect(cartState.items).toHaveLength(1);

      // Submit order
      const submitButton = screen.getByRole('button', { name: 'Create Order' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/orders', { coupons: [] });
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/client/orders/order1', {
          state: { orders: mockOrder },
        });
      });
    });

    it('should handle checkout with multiple items in cart', async () => {
      const item2 = {
        ...mockCartItem,
        id: 'product2',
        productId: {
          _id: 'product2',
          title: 'Product 2',
          price: 19.99,
        },
        quantity: 3,
      };

      store.dispatch(setCart({ items: [mockCartItem, item2] }));

      const mockOrder = {
        _id: 'order1',
        userId: 'user1',
        items: [mockCartItem, item2],
        total: 129.95,
        status: 'pending',
      };

      api.post.mockResolvedValue({
        data: {
          data: {
            order: mockOrder,
          },
        },
      });

      const mockUseOrders = {
        addOrder: jest.fn(),
        loading: false,
        updateOrderStatus: jest.fn(),
        orders: [],
      };
      useOrders.mockReturnValue(mockUseOrders);

      renderWithProviders(<CreateOrder />, { store });

      const submitButton = screen.getByRole('button', { name: 'Create Order' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/orders', { coupons: [] });
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });
    });
  });
});

