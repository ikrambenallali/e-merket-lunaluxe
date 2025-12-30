import React, { useEffect, useState } from "react";
import { useOrders } from "../../Hooks/UseOrders";
import { X } from "lucide-react";

export default function OrdersPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const {
    orders,
    updateStatusOrder,   // ✔️ mutation
  } = useOrders(userId);

  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-playfair font-bold text-brandRed mb-12 text-center uppercase tracking-wide">
          My Orders
        </h1>

        <div className="overflow-x-auto shadow-xl rounded-3xl border border-brandRed/20 bg-white">
          <table className="min-w-full text-left text-sm font-montserrat">
            <thead className="bg-brandRed text-white uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total (MAD)</th>
                <th className="px-6 py-4">Articles</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders?.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-200 hover:bg-[#fbf4fa] transition-all"
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-red-100 text-red-700">
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-bold text-brandRed">
                    {order.finalAmount} MAD
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-brandRed font-semibold hover:underline"
                    >
                      View Items ({order.items.length})
                    </button>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        updateStatusOrder.mutate({
                          id: order._id,
                          newStatus: "cancelled",
                        })
                      }
                      className="px-5 py-2 rounded-xl bg-brandRed text-white font-semibold hover:bg-hoverBrandRed transition shadow-sm"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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

            <div className="p-6">
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">
                  Status:
                  <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    {selectedOrder.status}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Total:{" "}
                  <span className="font-bold text-brandRed">
                    {selectedOrder.finalAmount} MAD
                  </span>
                </p>
              </div>

              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 border border-gray-200 rounded-xl bg-[#fef7f5] hover:shadow-md transition"
                  >
                    <p className="font-semibold text-gray-800 text-lg mb-2">
                      {item.productId?.title || "Produit supprimé"}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>
                        Quantity: <strong>{item.quantity}</strong>
                      </span>
                      <span>
                        Price:{" "}
                        <strong className="text-brandRed">
                          {item.price} MAD
                        </strong>
                      </span>
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
