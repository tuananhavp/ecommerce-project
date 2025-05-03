import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  runTransaction,
} from "firebase/firestore";
import { create } from "zustand";

import { db } from "@/firebase/firebase";
import { CreateOrderInput, Order, OrderState, OrderStatus } from "@/types/order.types";

import { useCartStore } from "./cartStore";

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  orderCounts: {}, // Initialize empty cache object

  // Fetch all orders (for admin) or filter by customerId if provided
  fetchOrders: async (customerId?: string) => {
    set({ isLoading: true, error: null });
    try {
      let ordersQuery;

      if (customerId) {
        // If customerId is provided, filter by customer
        ordersQuery = query(
          collection(db, "orders"),
          where("customerID", "==", customerId),
          orderBy("createdAt", "desc")
        );
      } else {
        // Fetch all orders (admin view)
        ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      }

      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = ordersSnapshot.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            id: doc.id,
          } as Order)
      );

      set({
        orders: ordersData,
        isLoading: false,
      });

      return ordersData;
    } catch (error) {
      console.error("Error fetching orders:", error);
      set({ error: (error as Error).message, isLoading: false });
      return [];
    }
  },

  getOrderById: async (orderId: string) => {
    set({ isLoading: true, error: null });

    try {
      const orderDoc = await getDoc(doc(db, "orders", orderId));

      if (!orderDoc.exists()) {
        set({ error: "Order not found", isLoading: false });
        return null;
      }

      const orderData = { ...orderDoc.data(), id: orderDoc.id } as Order;

      set({
        currentOrder: orderData,
        isLoading: false,
      });

      return orderData;
    } catch (error) {
      console.error("Error getting order:", error);
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },

  createOrder: async (orderData: CreateOrderInput, customerId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Create the order object with required fields
      const newOrder = {
        ...orderData,
        customerID: customerId,
        createdAt: serverTimestamp(),
        orderStatus: "Pending" as const,
      };

      // Add the order to Firestore
      const orderRef = await addDoc(collection(db, "orders"), newOrder);

      // Only clear selected items, but don't remove items from cart
      const { clearSelectedItems } = useCartStore.getState();
      clearSelectedItems();

      const localOrder = {
        ...newOrder,
        id: orderRef.id,
        createdAt: Timestamp.now(),
      };

      // Update local state with the new order
      set((state) => ({
        orders: [...state.orders, localOrder as Order],
        currentOrder: localOrder as Order,
        isLoading: false,
      }));

      // Clear the order count cache for this user as it's now invalid
      const { orderCounts } = get();
      // Create a new object without the customer's entry instead of setting it to undefined
      const newOrderCounts = { ...orderCounts };
      delete newOrderCounts[customerId];
      set({
        orderCounts: newOrderCounts,
      });

      return orderRef.id;
    } catch (error) {
      console.error("Error creating order:", error);
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },

  // Fixed helper function to handle stock updates
  updateProductStock: async (order: Order, oldStatus: OrderStatus, newStatus: OrderStatus) => {
    const statusThatReducesStock = ["In Process", "Shipping", "Completed"];
    const shouldReduceStock = !statusThatReducesStock.includes(oldStatus) && statusThatReducesStock.includes(newStatus);
    const shouldRestoreStock = statusThatReducesStock.includes(oldStatus) && newStatus === "Cancelled";

    if (!shouldReduceStock && !shouldRestoreStock) {
      return; // No stock update needed
    }

    try {
      // Use a transaction to ensure all stock updates are atomic
      await runTransaction(db, async (transaction) => {
        // First, perform ALL read operations
        const productDocs = [];

        // Read all product documents first
        for (const item of order.orderItems) {
          const productRef = doc(db, "product", item.productID);
          const productDoc = await transaction.get(productRef);

          if (!productDoc.exists()) {
            throw new Error(`Product ${item.productID} not found`);
          }

          productDocs.push({
            ref: productRef,
            data: productDoc.data(),
            item: item,
          });
        }

        // Then, perform ALL write operations
        for (const { ref, data, item } of productDocs) {
          let newStockQuantity = data.stockQuantity;

          if (shouldReduceStock) {
            // Check if there's enough stock
            if (data.stockQuantity < item.quantity) {
              throw new Error(`Insufficient stock for product ${item.productName}`);
            }

            // Reduce stock
            newStockQuantity = data.stockQuantity - item.quantity;
          } else if (shouldRestoreStock) {
            // Restore stock on cancellation
            newStockQuantity = data.stockQuantity + item.quantity;
          }

          // Update the product stock
          transaction.update(ref, { stockQuantity: newStockQuantity });
        }
      });

      return true;
    } catch (error) {
      console.error("Error updating product stock:", error);
      throw new Error(`Failed to update product stock: ${(error as Error).message}`);
    }
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus) => {
    set({ isLoading: true, error: null });

    try {
      // Get current order to compare status change
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);

      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }

      const currentOrder = { ...orderDoc.data(), id: orderDoc.id } as Order;
      const oldStatus = currentOrder.orderStatus;

      // First update stock (this will throw an error if it fails)
      await get().updateProductStock(currentOrder, oldStatus, status);

      // Then update order status
      await updateDoc(orderRef, {
        orderStatus: status,
        updatedAt: serverTimestamp(),
      });

      // Update local state
      const orders = get().orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              orderStatus: status,
              updatedAt: Timestamp.now(),
            }
          : order
      );

      if (get().currentOrder?.id === orderId) {
        set({
          currentOrder: {
            ...get().currentOrder,
            orderStatus: status,
            updatedAt: Timestamp.now(),
          } as Order,
        });
      }

      set({
        orders,
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      set({ error: (error as Error).message, isLoading: false });
      return false;
    }
  },

  cancelOrder: async (orderId: string, cancellationReason: string) => {
    try {
      set({ isLoading: true, error: null });

      const orderRef = doc(db, "orders", orderId);

      // Add cancellation reason to the update
      await updateDoc(orderRef, {
        orderStatus: "Cancelled",
        cancelledAt: serverTimestamp(),
        cancellationReason: cancellationReason,
        updatedAt: serverTimestamp(),
      });

      // Update the local state with the new status and reason
      const { orders, currentOrder } = get();

      // Update orders array
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            orderStatus: "Cancelled" as OrderStatus,
            cancelledAt: Timestamp.now(),
            cancellationReason: cancellationReason,
          };
        }
        return order;
      });

      // Update currentOrder if it's the cancelled order
      let updatedCurrentOrder = currentOrder;
      if (currentOrder?.id === orderId) {
        updatedCurrentOrder = {
          ...currentOrder,
          orderStatus: "Cancelled" as OrderStatus,
          cancelledAt: Timestamp.now(),
          cancellationReason: cancellationReason,
        };
      }

      set({
        orders: updatedOrders,
        currentOrder: updatedCurrentOrder,
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error("Error cancelling order:", error);
      set({
        error: "Failed to cancel order",
        isLoading: false,
      });
      return false;
    }
  },

  // New function to get total orders by user ID with caching
  getTotalOrdersByUserId: async (userId: string) => {
    try {
      // Check if we have a cached count and if it's still fresh (< 5 min old)
      const orderCounts = get().orderCounts;
      const cachedData = orderCounts[userId];
      const now = Date.now();
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

      if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
        return cachedData.count;
      }

      // No cache or expired cache, fetch from Firestore
      const orderQuery = query(collection(db, "orders"), where("customerID", "==", userId));

      const querySnapshot = await getDocs(orderQuery);
      const count = querySnapshot.size;

      // Cache the result
      set({
        orderCounts: {
          ...get().orderCounts,
          [userId]: {
            count,
            timestamp: now,
          },
        },
      });

      return count;
    } catch (error) {
      console.error("Error getting order count:", error);
      return 0;
    }
  },

  // Clear the order count cache
  clearOrderCountCache: () => {
    set({ orderCounts: {} });
  },
}));
