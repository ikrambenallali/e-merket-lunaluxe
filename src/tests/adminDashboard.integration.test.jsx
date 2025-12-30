/*
  Integration test for AdminDashboard layout + routing
  - Verifies that nested admin routes render inside AdminDashboard's Outlet
  - Ensures the shared admin Sidebar is rendered and navigation works
  - This is a lightweight integration test using MemoryRouter from react-router

  Detailed comments explain each line for clarity.
*/

import React from 'react';
/* eslint-env jest */
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// AdminDashboard component contains Sidebar and an Outlet for nested routes
import AdminDashboard from '../pages/Admin/AdminDashboard';

describe('AdminDashboard integration', () => {
  it('renders Sidebar and nested admin product page', () => {
    // Render the dashboard with a nested 'products' route and initial location '/admin/products'
    render(
      <MemoryRouter initialEntries={["/admin/products"]}>
        <Routes>
          {/* Parent admin route */}
          <Route path="/admin" element={<AdminDashboard />}>
            {/* Nested products route - provide a lightweight stub for the page */}
            <Route path="products" element={<div>Catalogue</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // The Sidebar should render a Product Management link (from the constants)
    expect(screen.getByText(/Product Management/i)).toBeTruthy();

    // The nested route content should be visible
    expect(screen.getByText('Catalogue')).toBeTruthy();
  });
});
