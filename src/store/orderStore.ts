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
  FieldValue,
  Timestamp,
} from "firebase/firestore";
import { create } from "zustand";

import { db } from "@/firebase/firebase";

import { useAuthStore } from "./authStore";
import { useCartStore } from "./cartStore";

export type OrderStatus = "Pending" | "In Process" | "Shipping" | "Completed" | "Cancelled" | "Refunded";

export type OrderItem = {
  productID: string;
  productName: string;
  productImage: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
};

export type Address = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

export type Order = {
  id?: string;
  customerID: string;
  customerName: string;
  email: string;
  phone: string;
  createdAt: Timestamp | FieldValue;
  deliveryAddress: Address;
  orderStatus: OrderStatus;
  orderItems: OrderItem[];
  totalAmount: number;
  shippingMethod: string;
  shippingCost: number;
  trackingNumber?: string;
  paymentMethod: "COD" | "Card" | "Paypal";
  notes?: string;
  updatedAt?: Timestamp | FieldValue;
};

export type CreateOrderInput = Omit<Order, "id" | "createdAt" | "orderStatus" | "customerID" | "updatedAt">;

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  fetchUserOrders: () => Promise<void>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  createOrder: (orderData: CreateOrderInput) => Promise<string | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<boolean>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchUserOrders: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.uid) {
      set({ error: "You must be logged in to view orders", isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const ordersQuery = query(
        collection(db, "orders"),
        where("customerID", "==", user.uid),
        orderBy("createdAt", "desc")
      );

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
    } catch (error) {
      console.error("Error fetching orders:", error);
      set({ error: (error as Error).message, isLoading: false });
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

  createOrder: async (orderData: CreateOrderInput) => {
    const { user } = useAuthStore.getState();
    if (!user?.uid) {
      set({ error: "You must be logged in to create an order", isLoading: false });
      return null;
    }

    set({ isLoading: true, error: null });
    try {
      // Create the order object with required fields
      const newOrder = {
        ...orderData,
        customerID: user.uid,
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

      return orderRef.id;
    } catch (error) {
      console.error("Error creating order:", error);
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus) => {
    set({ isLoading: true, error: null });

    try {
      await updateDoc(doc(db, "orders", orderId), {
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

      const currentOrder = get().currentOrder;
      if (currentOrder && currentOrder.id === orderId) {
        set({
          currentOrder: {
            ...currentOrder,
            orderStatus: status,
            updatedAt: Timestamp.now(),
          },
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

  cancelOrder: async (orderId: string) => {
    return get().updateOrderStatus(orderId, "Cancelled");
  },
}));
