// cart.test.jsx - Unit and Integration Tests for Cart
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import cartReducer, { setCart, addItem, removeItem, updateQuantity, clearCart } from '../features/cartSlice';
import { useCart } from '../Hooks/useCart';
import CartPage from '../components/Client/Cart';
import { api } from '../config/api';

// Mock dependencies
jest.mock('../config/api');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the useCart hook for component tests
jest.mock('../hooks/useCart', () => ({
  useCart: jest.fn(),
}));

// Helper to create test store
const createTestStore = (initialCartState = { items: [], total: 0, discount: 0 }) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: {
      cart: initialCartState,
    },
  });
};

// Helper to create QueryClient
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
};

// Helper to render with providers
const renderWithProviders = (ui, { store = createTestStore(), queryClient = createTestQueryClient(), ...options } = {}) => {
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </Provider>
    </QueryClientProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};

// Mock product data
const mockProduct = {
  _id: 'product1',
  title: 'Test Product',
  price: 29.99,
  primaryImage: '/images/test.jpg',
  description: 'Test product description',
  quantity: 10, // Stock quantity
};

const mockCartItem = {
  _id: 'cartItem1',
  id: 'product1',
  productId: mockProduct,
  quantity: 2,
};

describe('Cart - Unit Tests (Redux Slice)', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('setCart', () => {
    it('should set cart items and calculate total', () => {
      const items = [mockCartItem];
      store.dispatch(setCart({ items }));
      
      const state = store.getState().cart;
      expect(state.items).toEqual(items);
      expect(state.total).toBe(29.99 * 2);
    });

    it('should handle empty cart', () => {
      store.dispatch(setCart({ items: [] }));
      
      const state = store.getState().cart;
      expect(state.items).toEqual([]);
      expect(state.total).toBe(0);
    });

    it('should handle invalid payload gracefully', () => {
      store.dispatch(setCart({ items: null }));
      
      const state = store.getState().cart;
      expect(state.items).toEqual([]);
    });
  });

  describe('addItem', () => {
    it('should add new item to empty cart', () => {
      store.dispatch(addItem(mockCartItem));
      
      const state = store.getState().cart;
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockCartItem);
      expect(state.total).toBe(29.99 * 2);
    });

    it('should update quantity if item already exists', () => {
      store.dispatch(addItem(mockCartItem));
      store.dispatch(addItem({ ...mockCartItem, quantity: 1 }));
      
      const state = store.getState().cart;
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(3);
      expect(state.total).toBe(29.99 * 3);
    });

    it('should add different products separately', () => {
      const product2 = { ...mockProduct, _id: 'product2', price: 19.99 };
      const item2 = { ...mockCartItem, id: 'product2', productId: product2, quantity: 1 };
      
      store.dispatch(addItem(mockCartItem));
      store.dispatch(addItem(item2));
      
      const state = store.getState().cart;
      expect(state.items).toHaveLength(2);
      expect(state.total).toBe(29.99 * 2 + 19.99);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      store.dispatch(addItem(mockCartItem));
      store.dispatch(removeItem('product1'));
      
      const state = store.getState().cart;
      expect(state.items).toHaveLength(0);
      expect(state.total).toBe(0);
    });

    it('should not remove item if id does not exist', () => {
      store.dispatch(addItem(mockCartItem));
      store.dispatch(removeItem('nonExistentId'));
      
      const state = store.getState().cart;
      expect(state.items).toHaveLength(1);
      expect(state.total).toBe(29.99 * 2);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      store.dispatch(addItem(mockCartItem));
      store.dispatch(updateQuantity({ id: 'product1', quantity: 5 }));
      
      const state = store.getState().cart;
      expect(state.items[0].quantity).toBe(5);
      expect(state.total).toBe(29.99 * 5);
    });

    it('should not update if item does not exist', () => {
      store.dispatch(addItem(mockCartItem));
      store.dispatch(updateQuantity({ id: 'nonExistentId', quantity: 10 }));
      
      const state = store.getState().cart;
      expect(state.items[0].quantity).toBe(2);
      expect(state.total).toBe(29.99 * 2);
    });
  });

  describe('clearCart', () => {
    it('should clear all items and reset totals', () => {
      store.dispatch(addItem(mockCartItem));
      store.dispatch(clearCart());
      
      const state = store.getState().cart;
      expect(state.items).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.discount).toBe(0);
    });
  });
});

describe('Cart - Integration Tests (API Calls)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockClear();
    api.post.mockClear();
    api.put.mockClear();
    api.delete.mockClear();
  });

  describe('Cart API endpoints', () => {
    it('should call POST /cart when adding item', async () => {
      const mockResponse = {
        data: {
          item: mockCartItem,
          message: 'Produit ajouté !',
        },
      };
      api.post.mockResolvedValue(mockResponse);

      await api.post('/cart', { productId: 'product1', quantity: 2 });

      expect(api.post).toHaveBeenCalledWith('/cart', { productId: 'product1', quantity: 2 });
    });

    it('should call PUT /cart when updating item', async () => {
      api.put.mockResolvedValue({ data: { success: true } });

      await api.put('/cart', { productId: 'product1', quantity: 5 });

      expect(api.put).toHaveBeenCalledWith('/cart', { productId: 'product1', quantity: 5 });
    });

    it('should call DELETE /cart when removing item', async () => {
      api.delete.mockResolvedValue({ data: { success: true } });

      await api.delete('/cart', { data: { productId: 'product1' } });

      expect(api.delete).toHaveBeenCalledWith('/cart', { data: { productId: 'product1' } });
    });

    it('should call DELETE /cart/clear when clearing cart', async () => {
      api.delete.mockResolvedValue({ data: { success: true } });

      await api.delete('/cart/clear');

      expect(api.delete).toHaveBeenCalledWith('/cart/clear');
    });
  });
});

describe('Cart - Integration Tests (CartPage Component)', () => {
  let store;
  let queryClient;

  beforeEach(() => {
    store = createTestStore();
    queryClient = createTestQueryClient();
    jest.clearAllMocks();
  });

  it('should display empty cart message when cart is empty', () => {
    const mockUseCart = {
      cart: { items: [] },
      isLoading: false,
      isError: false,
      updateCartItem: { mutate: jest.fn() },
      removeCartItem: { mutate: jest.fn() },
      clearCart: { mutate: jest.fn() },
    };

    useCart.mockReturnValue(mockUseCart);

    renderWithProviders(<CartPage />, { store, queryClient });

    expect(screen.getByText('Votre panier est vide')).toBeInTheDocument();
    expect(screen.getByText('Ajoutez des articles pour commencer vos achats')).toBeInTheDocument();
  });

  it('should display cart items when cart has items', () => {
    const mockUseCart = {
      cart: { items: [mockCartItem] },
      isLoading: false,
      isError: false,
      updateCartItem: { mutate: jest.fn() },
      removeCartItem: { mutate: jest.fn() },
      clearCart: { mutate: jest.fn() },
    };

    useCart.mockReturnValue(mockUseCart);

    renderWithProviders(<CartPage />, { store, queryClient });

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('29.99 €')).toBeInTheDocument();
  });

  it('should call updateCartItem when quantity is changed', () => {
    const mockUpdateCartItem = { mutate: jest.fn() };
    const mockUseCart = {
      cart: { items: [mockCartItem] },
      isLoading: false,
      isError: false,
      updateCartItem: mockUpdateCartItem,
      removeCartItem: { mutate: jest.fn() },
      clearCart: { mutate: jest.fn() },
    };

    useCart.mockReturnValue(mockUseCart);

    renderWithProviders(<CartPage />, { store, queryClient });

    const quantityInput = screen.getByDisplayValue('2');
    fireEvent.change(quantityInput, { target: { value: '3' } });

    expect(mockUpdateCartItem.mutate).toHaveBeenCalledWith({ productId: 'product1', quantity: 3 });
  });

  it('should call removeCartItem when remove button is clicked', () => {
    const mockRemoveCartItem = { mutate: jest.fn() };
    const mockUseCart = {
      cart: { items: [mockCartItem] },
      isLoading: false,
      isError: false,
      updateCartItem: { mutate: jest.fn() },
      removeCartItem: mockRemoveCartItem,
      clearCart: { mutate: jest.fn() },
    };

    useCart.mockReturnValue(mockUseCart);

    renderWithProviders(<CartPage />, { store, queryClient });

    const removeButtons = screen.getAllByTitle('Supprimer');
    fireEvent.click(removeButtons[0]);

    expect(mockRemoveCartItem.mutate).toHaveBeenCalledWith({ productId: 'product1' });
  });

  it('should call clearCart when clear button is clicked', () => {
    const mockClearCart = { mutate: jest.fn() };
    const mockUseCart = {
      cart: { items: [mockCartItem] },
      isLoading: false,
      isError: false,
      updateCartItem: { mutate: jest.fn() },
      removeCartItem: { mutate: jest.fn() },
      clearCart: mockClearCart,
    };

    useCart.mockReturnValue(mockUseCart);

    renderWithProviders(<CartPage />, { store, queryClient });

    const clearButton = screen.getByText('Vider le panier');
    fireEvent.click(clearButton);

    expect(mockClearCart.mutate).toHaveBeenCalled();
  });

  it('should calculate and display total correctly', () => {
    const item1 = { ...mockCartItem, quantity: 2 };
    const item2 = {
      ...mockCartItem,
      _id: 'cartItem2',
      id: 'product2',
      productId: { ...mockProduct, _id: 'product2', price: 19.99 },
      quantity: 3,
    };

    const mockUseCart = {
      cart: { items: [item1, item2] },
      isLoading: false,
      isError: false,
      updateCartItem: { mutate: jest.fn() },
      removeCartItem: { mutate: jest.fn() },
      clearCart: { mutate: jest.fn() },
    };

    useCart.mockReturnValue(mockUseCart);

    renderWithProviders(<CartPage />, { store, queryClient });

    // Total should be (29.99 * 2) + (19.99 * 3) = 59.98 + 59.97 = 119.95
    const totalElements = screen.getAllByText(/119\.95/);
    expect(totalElements.length).toBeGreaterThan(0);
  });

  it('should disable decrease button when quantity is 1', () => {
    const itemWithQuantity1 = { ...mockCartItem, quantity: 1 };
    const mockUseCart = {
      cart: { items: [itemWithQuantity1] },
      isLoading: false,
      isError: false,
      updateCartItem: { mutate: jest.fn() },
      removeCartItem: { mutate: jest.fn() },
      clearCart: { mutate: jest.fn() },
    };

    useCart.mockReturnValue(mockUseCart);

    renderWithProviders(<CartPage />, { store, queryClient });

    const decreaseButtons = screen.getAllByRole('button');
    const minusButton = decreaseButtons.find(btn => 
      btn.querySelector('svg') && btn.disabled === true
    );
    expect(minusButton).toBeDefined();
  });

  it('should show loading state', () => {
    const mockUseCart = {
      cart: { items: [] },
      isLoading: true,
      isError: false,
      updateCartItem: { mutate: jest.fn() },
      removeCartItem: { mutate: jest.fn() },
      clearCart: { mutate: jest.fn() },
    };

    useCart.mockReturnValue(mockUseCart);

    renderWithProviders(<CartPage />, { store, queryClient });

    expect(screen.getByText('Chargement du panier...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    const mockUseCart = {
      cart: { items: [] },
      isLoading: false,
      isError: true,
      updateCartItem: { mutate: jest.fn() },
      removeCartItem: { mutate: jest.fn() },
      clearCart: { mutate: jest.fn() },
    };

    useCart.mockReturnValue(mockUseCart);

    renderWithProviders(<CartPage />, { store, queryClient });

    expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
    expect(screen.getByText('Impossible de charger votre panier.')).toBeInTheDocument();
  });
});

