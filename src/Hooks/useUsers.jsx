import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import axios from 'axios'
import API_ENDPOINTS, { api } from '../config/api'
import { toast } from 'react-toastify'

export function useUsers(page = 1) {
  return useQuery({
    queryKey: ['users', page],
    queryFn: async () => {
      const res = await api.get(`/users?page=${page}`)
      return res.data.data
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  })
}

// CREATE
export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (user) => api.post('/users', user),
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      toast.success('Utilisateur créé avec succès !')
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Erreur lors de la création'
      toast.error(message)
    },
  })
}

// UPDATE
export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/users/${id}/role`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      toast.success('Rôle mis à jour avec succès !')
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Erreur lors de la mise à jour'
      toast.error(message)
    },
  })
}

// DELETE
export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      toast.success('Utilisateur supprimé avec succès !')
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Erreur lors de la suppression'
      toast.error(message)
    },
  })
}
export function useSellerStats() {
  return useQuery({
    queryKey: ['seller-stats'],
    queryFn: async () => {
      const res = await api.get('/users/me/stats')
      return res.data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
