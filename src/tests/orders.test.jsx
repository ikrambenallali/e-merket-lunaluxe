// orders.test.js — Unit Tests for ordersSlice
import ordersReducer, {
  setOrders,
  setDeletedOrders,
  setSellerOrders,
  addOrder,
  removeOrder,
  updateOrder,
  restoreOrderRedux
} from "../features/orderSlice";

describe("Orders Slice - Unit Tests", () => {

  const initialState = {
    orders: [],
    sellerOrders: [],
    deletedOrders: [],
    loading: false,
    error: null,
  };

  const mockOrder = {
    _id: "o1",
    user: "u1",
    total: 99.99,
    status: "pending",
  };

  const mockOrderUpdated = {
    _id: "o1",
    user: "u1",
    total: 99.99,
    status: "completed",
  };

  const mockDeletedOrder = {
    _id: "o2",
    user: "u3",
    total: 70,
    status: "deleted",
  };

  /* ===========================================
        TEST setOrders
  =============================================== */
  test("setOrders should set orders array", () => {
    const nextState = ordersReducer(initialState, setOrders([mockOrder]));
    expect(nextState.orders).toHaveLength(1);
    expect(nextState.orders[0]).toEqual(mockOrder);
  });

  /* ===========================================
        TEST setDeletedOrders
  =============================================== */
  test("setDeletedOrders should set deleted orders", () => {
    const nextState = ordersReducer(initialState, setDeletedOrders([mockDeletedOrder]));
    expect(nextState.deletedOrders).toHaveLength(1);
    expect(nextState.deletedOrders[0]).toEqual(mockDeletedOrder);
  });

  /* ===========================================
        TEST setSellerOrders
  =============================================== */
  test("setSellerOrders should set seller orders", () => {
    const nextState = ordersReducer(initialState, setSellerOrders([mockOrder]));
    expect(nextState.sellerOrders).toHaveLength(1);
    expect(nextState.sellerOrders[0]).toEqual(mockOrder);
  });

  /* ===========================================
        TEST addOrder
  =============================================== */
  test("addOrder should add a new order", () => {
    const nextState = ordersReducer(initialState, addOrder(mockOrder));
    expect(nextState.orders).toHaveLength(1);
    expect(nextState.orders[0]).toEqual(mockOrder);
  });

  /* ===========================================
        TEST removeOrder
  =============================================== */
  test("removeOrder should remove order by ID", () => {
    const initialWithOrder = { ...initialState, orders: [mockOrder] };

    const nextState = ordersReducer(initialWithOrder, removeOrder("o1"));
    expect(nextState.orders).toHaveLength(0);
  });

  test("removeOrder should not remove if ID not found", () => {
    const initialWithOrder = { ...initialState, orders: [mockOrder] };

    const nextState = ordersReducer(initialWithOrder, removeOrder("BAD-ID"));
    expect(nextState.orders).toHaveLength(1);
  });

  /* ===========================================
        TEST updateOrder
  =============================================== */
  test("updateOrder should update order if exists", () => {
    const initialWithOrder = { ...initialState, orders: [mockOrder] };

    const nextState = ordersReducer(initialWithOrder, updateOrder(mockOrderUpdated));

    expect(nextState.orders[0].status).toBe("completed");
  });

  test("updateOrder should not modify anything if ID not found", () => {
    const initialWithOrder = { ...initialState, orders: [mockOrder] };

    const nextState = ordersReducer(initialWithOrder, updateOrder({ _id: "BAD-ID" }));

    expect(nextState.orders[0]).toEqual(mockOrder);
  });

  /* ===========================================
        TEST restoreOrderRedux
  =============================================== */
  test("restoreOrderRedux should add to orders and remove from deletedOrders", () => {
    const initialWithDeleted = {
      ...initialState,
      deletedOrders: [mockDeletedOrder],
    };

    const nextState = ordersReducer(initialWithDeleted, restoreOrderRedux(mockDeletedOrder));

    expect(nextState.orders).toHaveLength(1);
    expect(nextState.deletedOrders).toHaveLength(0);
  });
});
