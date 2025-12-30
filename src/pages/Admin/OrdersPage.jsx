import React from "react";
import Orders from "../../components/Admin/Orders";
import Sidebar from "../../components/Shared/Sidebar";
import { adminNavLinks } from "../../constants/sidebarLinks";

export default function OrdersPage() {
  return (
    <div className="flex bg-[#fef7f5]">

      {/* Main content */}
      <div className="flex scale-85 -ml-24">
        <Orders />
      </div>
    </div>
  );
}
