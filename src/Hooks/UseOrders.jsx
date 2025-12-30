
// import { useDispatch, useSelector } from "react-redux";
// import { fetchOrders, createOrder,fetchOrdersDeleted, fetchOrdersAdmin,deletOrder,updateStatusOrder,restoreOrder,getSellerOrders} from "../features/orderSlice";
// // import { setOrders, setLoading, setError } from "../features/orderSlice";

// import { useEffect } from "react";

// export default function useOrders(userId) {
  
//   const dispatch = useDispatch();

//   const orders = useSelector((state) => state.orders.orders);
//   const loading = useSelector((state) => state.orders.loading);
//   const error = useSelector((state) => state.orders.error);

//   // Charger les commandes du user connecté
//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchOrders(userId));
//     }
//   }, [dispatch, userId]);

// const loadOrdersAdmin = () => {
//     dispatch(fetchOrdersAdmin());
// };

// const loadOrdersUser = () => {
//   console.log("loading order use");
  
//   dispatch(fetchOrders(userId));
// }
  
//   // Créer une commande
//   const addOrder = (orderData) => {
//     dispatch(createOrder(orderData));
//   };
//   const loadDeletedOrders = () => {
//     dispatch(fetchOrdersDeleted());
//   };

//   const deleteOrder = (orderId) => {
//     dispatch(deletOrder(orderId));
//   }
//  const updateOrderStatus = ({ id, newStatus }) => {
//   dispatch(updateStatusOrder({ id, newStatus }));
// };
//   const restorOrder = (orderId) => {
//     dispatch(restoreOrder(orderId));
//   };

//   const loadSellerOrders = () => {
//     dispatch(getSellerOrders());
//   };

//   return {
//     orders,
//     loading,
//     error,
//     addOrder,
//     loadOrdersAdmin,
//     loadDeletedOrders,
//     loadOrdersUser,
//     deleteOrder,
//     updateOrderStatus,
//     restorOrder, 
//     loadSellerOrders, 
//   };
// }
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../config/api";
import {
  setOrders,
  addOrder,
  removeOrder,
  updateOrder,
  restoreOrderRedux,
  setDeletedOrders,
  setSellerOrders,
} from "../features/orderSlice";
import { useEffect } from "react";

export function useOrders(userId) {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.orders.orders);
  const deletedOrders = useSelector((state) => state.orders.deletedOrders);
  const sellerOrders = useSelector((state) => state.orders.sellerOrders);

  /*
  ===============================
        FETCH ORDERS USER
  ===============================
  */
  useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      const res = await api.get(`/orders/${userId}`);
      return res.data.data;
    },
    enabled: !!userId,
    onSuccess: (data) => {
      dispatch(setOrders(data));
    },
  });

  /*
 /*
===============================
      FETCH ORDERS ADMIN
===============================
*/
const ordersAdminQuery = useQuery({
  queryKey: ["orders-admin"],
  queryFn: async () => {
    const res = await api.get(`/orders`);
    return res.data.data;
  },
  enabled: false, // ne pas fetch automatiquement
});

// Dispatcher les données après le fetch
useEffect(() => {
  if (ordersAdminQuery.data) {
    dispatch(setOrders(ordersAdminQuery.data));
  }
}, [ordersAdminQuery.data, dispatch]);

// Fonction à exposer pour fetch à la demande
const fetchOrdersAdmin = () => {
  return ordersAdminQuery.refetch();
};

  /*
  ===============================
        FETCH DELETED ORDERS
  ===============================
  */
/*
===============================
      FETCH DELETED ORDERS
===============================
*/
const deletedOrdersQuery = useQuery({
  queryKey: ["orders-deleted"],
  queryFn: async () => {
    const res = await api.get(`/orders/deleted`);
    return res.data.data;
  },
  enabled: false,
});

// Dispatcher les données après le fetch
useEffect(() => {
  if (deletedOrdersQuery.data) {
    console.log("SETTING DELETED ORDERS", deletedOrdersQuery.data);
    dispatch(setDeletedOrders(deletedOrdersQuery.data));
  }
}, [deletedOrdersQuery.data, dispatch]);


  /*
  ===============================
        FETCH SELLER ORDERS
  ===============================
  */
  const fetchSellerOrders = useQuery({
    queryKey: ["orders-seller"],
    queryFn: async () => {
      const res = await api.get(`/orders/seller`);
      return res.data.data;
    },
    onSuccess: (data) => {
      dispatch(setSellerOrders(data));
    },
  });

  /*
  ===============================
        CREATE ORDER
  ===============================
  */
  const createOrderMutation = useMutation({
    mutationFn: (orderData) => api.post(`/orders`, orderData),
    onSuccess: (res) => {
      dispatch(addOrder(res.data.data.order));
    },
  });

  /*
  ===============================
        DELETE ORDER (soft)
  ===============================
  */
  const deleteOrderMutation = useMutation({
    mutationFn: (orderId) => api.delete(`/orders/${orderId}/soft`),
    onSuccess: (_, orderId) => {
      dispatch(removeOrder(orderId));
    },
  });

  /*
  ===============================
        UPDATE STATUS
  ===============================
  */
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, newStatus }) =>
      api.patch(`/orders/${id}/status`, { newStatus }),
    onSuccess: (res) => {
      dispatch(updateOrder(res.data.data));
    },
  });

    // Fonction pour fetch une seule commande
 const fetchOrderById = (orderId) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await api.get(`/orders/${orderId}`);
      return res.data.data;
    },
    enabled: !!orderId,
  });
};

  /*
  ===============================
        RESTORE ORDER
  ===============================
  */
  const restoreOrderMutation = useMutation({
    mutationFn: (orderId) => api.patch(`/orders/${orderId}/restore`),
    onSuccess: (res) => {
      dispatch(restoreOrderRedux(res.data.data));
    },
  });

  return {
    orders,
    deletedOrders,
    sellerOrders,

    createOrder: createOrderMutation,
    deleteOrder: deleteOrderMutation,
    updateStatusOrder: updateStatusMutation,
    restoreOrder: restoreOrderMutation,

     loadingDeleted: deletedOrdersQuery.isLoading,
     errorDeleted: deletedOrdersQuery.error,

    fetchOrdersAdmin,
  fetchDeletedOrders: deletedOrdersQuery.refetch,
    fetchSellerOrders,
    fetchOrderById,
  };
}

