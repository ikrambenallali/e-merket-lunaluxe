import { useState } from "react";
import  {useCart, } from "../../Hooks/useCart";
import ClientNavBar from "../ClientNavBar";
import { Trash2, ShoppingCart, Plus, Minus } from "lucide-react";

// ikram
import CreateOrder from "../../components/Client/createOrder";

// Récupération de l'id utilisateur depuis le localStorage
const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null;

export default function CartPage() {
 
  // ikram
  const [showOrderModal, setShowOrderModal] = useState(false);


  const { cart, isLoading, isError , updateCartItem, removeCartItem, clearCart} = useCart(userId);
  const handleQuantityChange = (productId, quantity, stock) => {
    if (quantity < 1) return;
    if (quantity >stock) return;
    updateCartItem.mutate({ productId, quantity });
  };

  const handleRemove = (productId) => {
    removeCartItem.mutate({productId});
  };

  const handleClearCart = () => {
    clearCart.mutate();
  };
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop";
  if (isLoading) {
    return (
      <div>
        <ClientNavBar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Chargement du panier...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <ClientNavBar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <p className="text-red-600 font-semibold">Erreur de chargement</p>
              <p className="text-gray-600 mt-2">Impossible de charger votre panier.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
const items = cart?.items || [];
  const total = cart?.items?.reduce((sum, item) => sum + item.productId.price * item.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ClientNavBar />
      
      <div className="container mx-auto px-4 py-8 mt-16 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <ShoppingCart className="w-8 h-8 text-brandRed" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Mon panier</h1>
                <p className="text-gray-500 mt-1">
                  {cart?.items?.length || 0} article{cart?.items?.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            {cart?.items?.length > 0 && (
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Vider le panier
              </button>
            )}
          </div>
        </div>

        {cart?.items?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Votre panier est vide</h2>
            <p className="text-gray-500 mb-6">Ajoutez des articles pour commencer vos achats</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Continuer mes achats
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Liste des articles */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center gap-6">
                    {/* Image produit (placeholder) */}
                   <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img 
                        src={item.productId.primaryImage 
                        ? `${import.meta.env.VITE_BASE_URL}${item.productId.primaryImage}` 
                        :PLACEHOLDER_IMAGE
                        } 
                        alt={item.productId.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                        e.target.src = "/PLACEHOLDER_IMAGE";
                        }}
                    />
                    </div>

                    {/* Infos produit */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {item.productId.title}
                      </h3>
                      <p className="text-xl font-bold text-brandRed mt-1">
                        {item.productId.price} €
                      </p>
                    </div>

                    {/* Contrôles quantité */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>   handleQuantityChange(
                        item.productId._id,
                        item.quantity - 1,
                        item.productId.quantity
                      )}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        max={item.productId.quantity}
                        onChange={(e) => handleQuantityChange(
                          item.productId._id,
                          Math.min(parseInt(e.target.value) || 1, item.productId.quantity),
                          item.productId.quantity
                        )}
                        className="w-16 h-10 text-center border-2 border-gray-200 rounded-lg font-semibold focus:border-blue-500 focus:outline-none"
                      />
                      
                      <button
                         onClick={() =>
                          handleQuantityChange(
                            item.productId._id,
                            item.quantity + 1,
                            item.productId.quantity
                          )
                        }
                        disabled={item.quantity >= item.productId.quantity}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Sous-total */}
                    <div className="text-right min-w-[100px]">
                      <p className="text-sm text-gray-500 mb-1">Sous-total</p>
                      <p className="text-xl font-bold text-gray-800">
                        {(item.productId.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>

                    {/* Bouton supprimer */}
                    <button
                      onClick={() => handleRemove(item.productId._id)}
                      className="w-10 h-10 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors duration-200"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé de la commande */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Résumé de la commande</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span className="font-medium">{total.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span className="font-medium text-green-600">Gratuite</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total</span>
                      <span className="text-2xl text-brandRed">{total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                {/* <button
                  onClick={() => alert("Passer au checkout...")}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Valider ma commande
                </button> */}

                {/* ikram */}
                <button
                onClick={() => setShowOrderModal(true)}
                className="w-full py-4 bg-brandRed  text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Valider ma commande
              </button>


                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">✓ Paiement sécurisé</p>
                  <p className="text-sm text-green-800 font-medium mt-1">✓ Livraison rapide</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showOrderModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl l relative p-0 h-100">
      <button
        onClick={() => setShowOrderModal(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        ✖
      </button>

      <CreateOrder />
    </div>
  </div>
)}

    </div>
  );
}