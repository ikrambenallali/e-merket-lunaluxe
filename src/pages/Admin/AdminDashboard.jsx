import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Shared/Sidebar';
import { adminNavLinks } from '../../constants/sidebarLinks';

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#fef7f5] via-white to-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar navLinks={adminNavLinks} />

        <main className="flex-1 lg:max-h-screen lg:overflow-y-auto">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;

