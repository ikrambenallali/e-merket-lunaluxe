import React from "react";
import OrdersDeleted from "../../components/Admin/OrdersDeleted";
import Sidebar from "../../components/Shared/Sidebar";
import { adminNavLinks } from "../../constants/sidebarLinks";

export default function OrdersPage() {
  return (
    <div className="flex bg-[#fef7f5]">

      {/* Main content */}
      <div className="flex justify-center items-center  ">
        <OrdersDeleted />
      </div>
    </div>
  );
}
