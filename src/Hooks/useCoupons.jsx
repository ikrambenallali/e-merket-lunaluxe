import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../config/api";

export function useCoupons() {
  return useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await api.get(`/coupons`);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (coupon) => api.post(`/coupons`, coupon),
    onSuccess: () => qc.invalidateQueries(["coupons"]),
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/coupons/${id}`, data),
    onSuccess: () => qc.invalidateQueries(["coupons"]),
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/coupons/${id}`),
    onSuccess: () => qc.invalidateQueries(["coupons"]),
  });
}

export function useCoupon(id) {
  return useQuery({
    queryKey: ["coupon", id],
    queryFn: async () => {
      const res = await api.get(`/coupons/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export default useCoupons;
