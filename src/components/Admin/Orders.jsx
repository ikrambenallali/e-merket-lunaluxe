import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useOrders } from "../../Hooks/UseOrders";


export default function OrdersPage() {
 const { 
    orders, 
    loading,
    error,
    fetchOrdersAdmin, 
    deleteOrder ,
     
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les commandes admin
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      await fetchOrdersAdmin();
      setIsLoading(false);
    };
    
    loadOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-brandRed font-montserrat text-lg animate-pulse">
          Loading...
        </span>
      </div>
    );
  }


  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-brandRed font-montserrat text-lg animate-pulse">
          Loading...
        </span>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-brandWhite">
        <span className="text-red-600 font-montserrat text-lg">{error}</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br px-6 ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-playfair font-bold text-brandRed mb-12 text-center uppercase tracking-wide">
          Orders Management
        </h1>

        <div className="overflow-x-auto shadow-xl rounded-3xl border border-brandRed/20 bg-white">
          <table className="min-w-full text-left text-sm font-montserrat">
            <thead className="bg-brandRed text-white uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Created at </th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Total (MAD)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                
                <tr
                  key={order._id}
                  className="border-b border-gray-200 hover:bg-[#fbf4fa] transition-all"
                >
                  
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    {order.userId?.fullname || <span className="text-gray-400">Deleted User</span>}
                  </td>

                  <td className="px-6 py-4">
                    {order.userId?.email || <span className="text-gray-400">Unknown Email</span>}
                  </td>

                  <td className="px-6 py-4 font-bold text-brandRed">{order.finalAmount}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-brandRed font-semibold hover:underline"
                    >
                      View Items ({order.items.length})
                    </button>
                  </td>

                  <td className="px-6 py-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => deleteOrder.mutate(order._id)}
                      className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-brandRed text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-xl font-bold font-playfair">
                Order Details - {selectedOrder._id}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-4 pb-4 border-b border-gray-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Customer:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedOrder.userId?.fullname || "Deleted User"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedOrder.userId?.email || "Unknown Email"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                      selectedOrder.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : selectedOrder.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="font-bold text-brandRed text-lg">
                    {selectedOrder.finalAmount} MAD
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-gray-800 mb-3 text-lg">Order Items:</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 border border-gray-200 rounded-xl bg-[#fef7f5] hover:shadow-md transition"
                  >
                    <p className="font-semibold text-gray-800 text-lg mb-2">
                      {item.productId?.title || "Deleted Product"}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Quantity: <strong>{item.quantity}</strong></span>
                      <span>Price: <strong className="text-brandRed">{item.price} MAD</strong></span>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      Subtotal: <strong>{item.quantity * item.price} MAD</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full px-5 py-3 rounded-xl bg-brandRed text-white font-semibold hover:bg-hoverBrandRed transition shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
