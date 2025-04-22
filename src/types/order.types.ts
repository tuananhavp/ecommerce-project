import { string, z } from "zod";

export type Order = {
  id: string;
  customerID: string;
  customerName: string;
  orderDate: Date;
  deliveryAddress: Address;
  orderStatus: OrderStatus;
  orderItems: OrderItem[];
  totalAmount: number;
  trackingNumber?: string;
  paymentMethod?: "COD" | "Card" | "Paypal";
};

export type Address = {
  id: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

export type OrderStatus = "Pending" | "In Process" | "Shipping" | "Completed" | "Cancelled" | "Refunded";

export type OrderItem = {
  productID: string;
  productName: string;
  productImage: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
};

export const OrderFormSchema = z.object({
  customerName: string().min(3, "Customer name is required"),
  email: string().email("Invalid email address"),
  phone: string().min(10, "Phone number is required").max(15, "Phone number is too long"),
  street: string().min(3, "Street address is required"),
  city: string().min(2, "City is required"),
  postalCode: string().min(3, "Postal code is required"),
  country: string().min(2, "Country is required"),
  orderItems: z.array(
    z.object({
      productID: string(),
      productName: string(),
      productImage: string(),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      pricePerUnit: z.number().min(0, "Price per unit must be a positive number"),
      subtotal: z.number().min(0, "Subtotal must be a positive number"),
    })
  ),
  totalAmount: z.number().min(0, "Total amount must be a positive number"),
  paymentMethod: z.enum(["COD", "Card", "Paypal"]),
});

export type OrderFormType = z.infer<typeof OrderFormSchema>;
