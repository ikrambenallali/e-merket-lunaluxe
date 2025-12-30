import { useParams } from "react-router-dom";
import { useOrders } from "../../Hooks/UseOrders";

function OrderDetails() {
  const { id } = useParams(); // récupère l'ID depuis l'URL
  const { fetchOrderById, updateStatusOrder } = useOrders();
  const { data: order, isLoading, isError } = fetchOrderById(id);

  if (isLoading) return <p className="text-center mt-20">Chargement...</p>;
  if (isError || !order)
    return (
      <p className="text-center mt-20 text-brandRed font-semibold">
        Commande introuvable.
      </p>
    );

  const handleCheckout = () => {
    updateStatusOrder.mutate(
      { id: order._id, newStatus: "shipped" },
      {
        onSuccess: () => alert("Commande expédiée !"),
        onError: (err) => console.error(err),
      }
    );
  };

  return (
    <div className="min-h-screen px-6 py-14 bg-[#fbf4fa]">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl border border-brandRed/20 p-10">
        <h1 className="text-4xl font-playfair font-bold text-brandRed mb-10 text-center uppercase tracking-wide">
          Order Details
        </h1>

        <div>
          <h2 className="text-2xl font-semibold text-brandRed mb-6">
            Produits commandés
          </h2>

          <div className="space-y-6">
            {order.items.map((item) => (
              <div
                key={item.productId._id}
                className="flex gap-6 p-4 rounded-2xl border border-brandRed/20 bg-[#fbf4fa]"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {item.productId.title}
                  </h3>
                  <p className="text-gray-600">Quantité : {item.quantity}</p>
                  <p className="font-bold text-brandRed mt-2">
                    {(item.price * item.quantity).toFixed(2)} €
                  </p>
                </div>
              </div>
            ))}
          </div>

          {order.status === "pending" ? (
            <button
              onClick={handleCheckout}
              className="mt-10 w-full py-3 rounded-xl bg-brandRed text-white font-semibold text-lg shadow-md hover:bg-hoverBrandRed transition"
            >
              Checkout
            </button>
          ) : (
            <p className="mt-10 text-green-600 font-semibold text-center text-lg">
              ✔ Commande déjà expédiée
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
