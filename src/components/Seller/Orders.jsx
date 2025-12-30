import React, { useEffect, useState } from "react";
import useSellerOrders from "../../Hooks/useSellerOrders";
import { X } from "lucide-react";

export default function SellerOrdersPage() {
  const {
    sellerOrders,
    loading,
    error,
    refetch,
    updateOrderStatusMutation,
  } = useSellerOrders();

  const [selectedOrder, setSelectedOrder] = useState(null);

  // ✅ Plus besoin de useEffect, React Query fetch automatiquement
  // useEffect(() => { ... }, []); // ❌ Supprimer ceci

  if (loading) return <p className="text-center mt-20">Chargement...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  // ✅ Vérifier si le tableau est vide
  if (!sellerOrders || sellerOrders.length === 0) {
    return <p className="text-center mt-20">Aucune commande trouvée</p>;
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-playfair font-bold text-brandRed mb-12 text-center uppercase tracking-wide">
          Commandes de vos produits
        </h1>

        <div className="overflow-x-auto shadow-xl rounded-3xl border border-brandRed/20 bg-white">
          <table className="min-w-full text-left text-sm font-montserrat">
            <thead className="bg-brandRed text-white uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total (MAD)</th>
                <th className="px-6 py-4">Produits</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {sellerOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-[#fbf4fa] transition-all">
                  <td className="px-6 py-4 font-semibold">
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
                      Voir produits ({order.items.length})
                    </button>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        updateOrderStatusMutation.mutate({
                          id: order._id,
                          newStatus: "cancelled",
                        })
                      }
                      className="px-5 py-2 rounded-xl bg-brandRed text-white hover:bg-hoverBrandRed transition"
                    >
                      Annuler
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-brandRed text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-xl font-bold">Commande - {selectedOrder._id}</h2>
              <X size={24} onClick={() => setSelectedOrder(null)} />
            </div>

            <div className="p-6">
              <p className="text-sm">Status : {selectedOrder.status}</p>
              <p className="text-sm mt-2">Total : {selectedOrder.finalAmount} MAD</p>

              <div className="mt-4 space-y-4">
                {selectedOrder.items.map((item) => (
                  <div key={item._id} className="p-4 border rounded-xl bg-[#fef7f5]">
                    <p className="font-semibold text-lg">
                      {item.productId?.title || "Produit supprimé"}
                    </p>

                    <p>Quantité : {item.quantity}</p>
                    <p>Prix : {item.price} MAD</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full px-5 py-3 rounded-xl bg-brandRed text-white"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
