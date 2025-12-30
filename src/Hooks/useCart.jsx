import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../config/api";
import { toast } from "react-toastify";
import { setCart, addItem, removeItem, updateQuantity, clearCart } from "../features/cartSlice";

export const useCart = (userId) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const cartRedux = useSelector((state) => state.cart);

    const basePath = "/cart";
    const queryKey = ["cart", userId];

    // Fetch panier complet
    const fetchCart = async () => {
        const res = await api.get(basePath, { headers: { "Cache-Control": "no-cache" } });
        return res.data.data;
    };

    useEffect(() => {
        if (userId) {
            fetchCart()
                .then((cart) => dispatch(setCart(cart)))
                .catch((err) => {
                    console.error(err);
                    toast.error("Impossible de charger le panier");
                });
        }
    }, [userId]);

    // --- Add item ---
    const addToCart = useMutation({
        mutationFn: ({ productId, quantity }) =>
            api.post(basePath, { productId, quantity }),

        onSuccess: async (res) => {
            console.log('Add to cart response:', res.data);
            
            // Re-fetch le panier complet pour synchroniser Redux
            try {
                const updatedCart = await fetchCart();
                dispatch(setCart(updatedCart));
                toast.success("Produit ajouté au panier !");
            } catch (error) {
                console.error('Error refreshing cart:', error);
            }
        },

        onError: (error) => {
            console.error('Add to cart error:', error);
            toast.error("Impossible d'ajouter au panier");
        }
    });

    // --- Update quantity ---
    const updateCartItem = useMutation({
        mutationFn: ({ productId, quantity }) => api.put(basePath, { productId, quantity }),
        onSuccess: async () => {
            const updatedCart = await fetchCart();
            dispatch(setCart(updatedCart));
            toast.success("Quantité mise à jour !");
        },
    });

    // --- Remove item ---
    const removeCartItem = useMutation({
        mutationFn: ({ productId }) => api.delete(basePath, { data: { productId } }),
        onSuccess: async () => {
            const updatedCart = await fetchCart();
            dispatch(setCart(updatedCart));
            toast.success("Produit supprimé !");
        },
    });

    // --- Clear cart ---
    const clearCartMutation = useMutation({
        mutationFn: () => api.delete(`${basePath}/clear`),
        onSuccess: () => {
            dispatch(clearCart());
            toast.success("Panier vidé !");
        },
    });

    return {
        cart: cartRedux,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart: clearCartMutation,
    };
};
