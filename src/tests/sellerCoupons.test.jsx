/*
  Unit tests for `CouponManagement` (seller coupons management)
  - Mocks `../Hooks/useCoupons` to control hook return values and mutation functions.
  - Verifies UI rendering and that delete action calls the mutation.

  Detailed comments explain each line and test step.
*/

import React from 'react';
/* eslint-env jest */
import { describe, it, expect, beforeEach } from '@jest/globals';
import { jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Component under test
import CouponManagement from '../components/Seller/CouponManagement';

// Mock the hook module used by the component so tests don't hit the network
const mockUseCoupons = jest.fn(() => ({ data: [], isLoading: false, isError: false }));
const mockUseCreate = jest.fn(() => ({ mutate: jest.fn() }));
const mockUseUpdate = jest.fn(() => ({ mutate: jest.fn() }));
const mockUseDelete = jest.fn(() => ({ mutate: jest.fn() }));

jest.mock('../Hooks/useCoupons', () => ({
  useCoupons: (...args) => mockUseCoupons(...args),
  useCreateCoupon: () => mockUseCreate(),
  useUpdateCoupon: () => mockUseUpdate(),
  useDeleteCoupon: () => mockUseDelete(),
}));

describe('Seller Coupon Management (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCoupons.mockImplementation(() => ({ data: [], isLoading: false }));
    mockUseCreate.mockImplementation(() => ({ mutate: jest.fn() }));
    mockUseUpdate.mockImplementation(() => ({ mutate: jest.fn() }));
    mockUseDelete.mockImplementation(() => ({ mutate: jest.fn() }));
  });

  it('renders empty state when there are no coupons', () => {
    // Create a minimal Redux store with an `auth` slice so useSelector() works
    const store = configureStore({
      reducer: {
        auth: (state = { user: { _id: 'seller1', role: 'seller' } }) => state,
      },
    });

    // Render the component with the mocked hooks and Redux provider
    render(
      <Provider store={store}>
        <CouponManagement />
      </Provider>
    );

    // The component displays an 'No coupons found' message when empty
    expect(screen.getByText(/No coupons found/i)).toBeTruthy();
  });

  it('calls delete mutation when delete is clicked', async () => {
    // Re-mock the hooks to return one coupon and a spy for delete.
    // Reset the module registry so our doMock will be used when we re-import.
    const mockDeleteMutate = jest.fn();
    mockUseCoupons.mockImplementation(() => ({ data: [{ _id: 'c1', code: 'SAVE10', value: 10, type: 'percentage', status: 'active' }], isLoading: false }));
    mockUseDelete.mockImplementation(() => ({ mutate: mockDeleteMutate }));

    // Because module mocks are dynamic (mockUseCoupons/mockUseDelete are jest.fn()),
    // re-importing the component is not necessary; the component will call the
    // mocked hooks with the updated implementations.
    const CouponManagementFresh = (await import('../components/Seller/CouponManagement')).default;

    // Provide a minimal Redux store so the component's useSelector() reads auth.user
    const store = configureStore({
      reducer: {
        auth: (state = { user: { _id: 'seller1', role: 'seller' } }) => state,
      },
    });

    render(
      <Provider store={store}>
        <CouponManagementFresh />
      </Provider>
    );

    // Wait for coupon code to appear
    await waitFor(() => screen.getByText('SAVE10'));

    // Find the delete button for that row (button has a title="Delete")
    const deleteBtn = screen.getByTitle(/Delete/i);
    fireEvent.click(deleteBtn);

    // Expect the delete mutation to have been called with the coupon id
    await waitFor(() => {
      expect(mockDeleteMutate).toHaveBeenCalled();
      const calledWith = mockDeleteMutate.mock.calls[0][0];
      expect(calledWith).toBe('c1');
    });
  });
});
