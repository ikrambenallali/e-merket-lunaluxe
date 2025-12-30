// src/hooks/useSellerOrders.js
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { api } from "../config/api";
import { setSellerOrders, updateOrder } from "../features/orderSlice";

export default function useSellerOrders() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { sellerOrders } = useSelector((state) => state.orders);

  /*
      1️⃣ FETCH SELLER ORDERS
  */
  const fetchSellerOrders = useQuery({
    queryKey: ["sellerOrders"],
    queryFn: async () => {
      const res = await api.get(`/orders/seller`); // ✅ Corrigé
      console.log("📦 API Response:", res.data.data);
      return res.data.data;   
    },
    staleTime: 1000 * 60 * 5, // Cache pendant 5 minutes
  });

  // ✅ Synchroniser React Query avec Redux
  useEffect(() => {
    if (fetchSellerOrders.data) {
      console.log("✅ Dispatching to Redux:", fetchSellerOrders.data);
      dispatch(setSellerOrders(fetchSellerOrders.data));
    }
  }, [fetchSellerOrders.data, dispatch]);

  /*
      2️⃣ UPDATE ORDER STATUS
  */
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }) => {
      const res = await api.put(`/orders/status/${id}`, { status: newStatus }); // ✅ Corrigé
      return res.data;
    },
    onSuccess: (updatedOrder) => {
      dispatch(updateOrder(updatedOrder));
      queryClient.invalidateQueries({ queryKey: ["sellerOrders"] }); // ✅ Nouvelle syntaxe
    },
  });

  return {
    sellerOrders,
    loading: fetchSellerOrders.isLoading || updateOrderStatusMutation.isPending,
    error: fetchSellerOrders.error?.message,
    refetch: fetchSellerOrders.refetch,
    updateOrderStatusMutation,
  };
}