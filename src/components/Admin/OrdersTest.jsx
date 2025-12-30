// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { fetchOrdersAdminRQ } from "../../services/ordersService";
// import useOrders from "../../Hooks/UseOrders";
// import { X } from "lucide-react";

// export default function OrdersTest() {
//   const { deleteOrder } = useOrders();

//   const { data: orders = [], isLoading, isError, error } = useQuery({
//     queryKey: ["orders-admin"],
//     queryFn: fetchOrdersAdminRQ,
//   });

//   const [selectedOrder, setSelectedOrder] = useState(null);

//   if (isLoading)
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <span className="text-brandRed font-montserrat text-lg animate-pulse">Loading...</span>
//       </div>
//     );

//   if (isError)
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-brandWhite">
//         <span className="text-red-600 font-montserrat text-lg">{error.message}</span>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-linear-to-br px-6 py-10">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-playfair font-bold text-brandRed mb-12 text-center uppercase tracking-wide">
//           Orders Management
//         </h1>

//         <div className="overflow-x-auto shadow-xl rounded-3xl border border-brandRed/20 bg-white">
//           <table className="min-w-full text-left text-sm font-montserrat">
//             <thead className="bg-brandRed text-white uppercase text-xs tracking-wider">
//               <tr>
//                 <th className="px-6 py-4">Created at </th>
//                 <th className="px-6 py-4">User</th>
//                 <th className="px-6 py-4">Email</th>
//                 <th className="px-6 py-4">Total (MAD)</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4">Items</th>
//                 <th className="px-6 py-4 text-center">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {orders.map((order) => (
//                 <tr
//                   key={order._id}
//                   className="border-b border-gray-200 hover:bg-[#fbf4fa] transition-all"
//                 >
//                   <td className="px-6 py-4 font-semibold text-gray-800">
//                     {order.createdAt}
//                   </td>

//                   <td className="px-6 py-4">
//                     {order.userId?.fullname || <span className="text-gray-400">Deleted User</span>}
//                   </td>

//                   <td className="px-6 py-4">
//                     {order.userId?.email || <span className="text-gray-400">Unknown Email</span>}
//                   </td>

//                   <td className="px-6 py-4 font-bold text-brandRed">{order.finalAmount}</td>

//                   <td className="px-6 py-4">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm
//                         ${
//                           order.status === "completed"
//                             ? "bg-green-100 text-green-700"
//                             : order.status === "cancelled"
//                             ? "bg-red-100 text-red-700"
//                             : "bg-yellow-100 text-yellow-700"
//                         }`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>

//                   <td className="px-6 py-4">
//                     <button
//                       onClick={() => setSelectedOrder(order)}
//                       className="text-brandRed font-semibold hover:underline"
//                     >
//                       View Items ({order.items.length})
//                     </button>
//                   </td>

//                   <td className="px-6 py-4 flex items-center justify-center gap-3">
//                     <button
//                       onClick={() => deleteOrder(order._id)}
//                       className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
