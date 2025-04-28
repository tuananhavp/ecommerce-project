"use client";
import React, { useState, useEffect, useRef } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z, string } from "zod";

import Breadcrumbs from "@/components/Breadcrumbs";
import InputField from "@/components/InputField";
import SelectForm from "@/components/SelectForm";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { CreateOrderInput } from "@/types/order.types";

// Define the schema for the order form
const OrderFormSchema = z.object({
  customerName: string().min(3, "Customer name is required"),
  email: string().email("Invalid email address"),
  phone: string().min(10, "Phone number is required").max(15, "Phone number is too long"),
  street: string().min(3, "Street address is required"),
  city: string().min(2, "City is required"),
  postalCode: string().min(3, "Postal code is required"),
  country: string().min(2, "Country is required"),
  paymentMethod: z.enum(["COD", "Card", "Paypal"]),
  notes: z.string().optional(),
});

type OrderFormValue = z.infer<typeof OrderFormSchema>;

const CheckoutPage = () => {
  const router = useRouter();
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add a ref to track if order has been placed
  const orderPlacedRef = useRef(false);

  // Get auth and cart state
  const { user } = useAuthStore();
  const { getSelectedItems } = useCartStore();
  const { createOrder, error: orderError } = useOrderStore();

  // Get selected products from cart store
  const selectedProducts = getSelectedItems().map((item) => ({
    productID: item.productID,
    productName: item.name,
    productImage: item.imgUrl,
    quantity: item.quantity,
    pricePerUnit: item.price,
    subtotal: item.price * item.quantity,
  }));

  // Redirect if no items are selected, but ONLY if we haven't just placed an order
  useEffect(() => {
    // Skip this check if we just placed an order
    if (selectedProducts.length === 0 && !orderPlacedRef.current) {
      Swal.fire({
        title: "No Items Selected",
        text: "Please select items from your cart to proceed to checkout.",
        icon: "warning",
        confirmButtonText: "Go to Cart",
      }).then(() => {
        router.push("/cart");
      });
    }
  }, [selectedProducts, router]);

  // Show error message if order creation fails
  useEffect(() => {
    if (orderError) {
      Swal.fire({
        title: "Error",
        text: orderError,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [orderError]);

  // Shipping methods
  const shippingMethods = [
    { id: "flat_rate", name: "Flat rate", price: 10 },
    { id: "free_shipping", name: "Free shipping", price: 0 },
    { id: "local_pickup", name: "Local pickup", price: 5 },
  ];

  // Calculate totals
  const subtotal = selectedProducts.reduce((sum, product) => sum + product.subtotal, 0);
  const [selectedShipping, setSelectedShipping] = useState(shippingMethods[0].id);
  const selectedShippingMethod = shippingMethods.find((method) => method.id === selectedShipping);
  const shippingCost = selectedShippingMethod?.price || 0;
  const totalAmount = subtotal + shippingCost;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<OrderFormValue>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      customerName: user?.username || "",
      email: user?.email || "",
      phone: "",
      street: "",
      city: "",
      postalCode: "",
      country: "Vietnam",
      paymentMethod: "COD",
      notes: "",
    },
  });

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setValue("customerName", user.username || "");
      setValue("email", user.email || "");
    }
  }, [user, setValue]);

  // Handle form submission
  // In the onSubmit function of CheckoutPage

  const onSubmit = async (data: OrderFormValue) => {
    if (!termsAgreed) {
      Swal.fire({
        title: "Terms Required",
        text: "Please agree to the terms and conditions to proceed.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to complete your order.",
        icon: "warning",
        confirmButtonText: "Go to Login",
      }).then(() => {
        router.push("/login");
      });
      return;
    }

    if (selectedProducts.length === 0) {
      Swal.fire({
        title: "No Items Selected",
        text: "Your cart is empty. Please add items before checkout.",
        icon: "warning",
        confirmButtonText: "Go to Shop",
      }).then(() => {
        router.push("/");
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create order data object
      const orderData: CreateOrderInput = {
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        deliveryAddress: {
          street: data.street,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        },
        orderItems: selectedProducts,
        totalAmount: totalAmount,
        shippingMethod: selectedShippingMethod?.name || "Standard Shipping",
        shippingCost: shippingCost,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      };

      // Set the flag to indicate we've placed an order
      orderPlacedRef.current = true;

      // Call the createOrder function from orderStore
      const orderID = await createOrder(orderData);

      if (orderID) {
        // Show success message
        Swal.fire({
          title: "Order Placed!",
          text: "Your order has been successfully placed. You can place another order with the same items if needed.",
          icon: "success",
          timer: 5000,
          confirmButtonText: "View Order",
          timerProgressBar: true,
          showCancelButton: true,
          cancelButtonText: "Continue Shopping",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push(`/orders/${orderID}`);
          }
          if (result.isDismissed) {
            router.push("/");
          } else {
            router.push("/cart");
          }
        });
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Error processing order:", error);
      Swal.fire({
        title: "Error",
        text: "There was a problem processing your order. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      // Reset the flag since order placement failed
      orderPlacedRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const countryOptions = ["Select Country", "United States (US)", "Canada", "United Kingdom", "Australia", "Vietnam"];

  // If no items are selected and we haven't just placed an order, show loading while redirect happens
  if (selectedProducts.length === 0 && !orderPlacedRef.current) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading your cart items...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="mt-4 md:mt-7 flex items-center justify-center">
      <div className="w-11/12 md:w-10/12 min-h-dvh">
        <Breadcrumbs path="checkout" />

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Rest of your form stays the same */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left side - Billing details */}
            <div className="col-span-1 md:col-span-2">
              {/* Form fields here - unchanged */}
              <div className="mb-4">
                <div className="bg-red-50 p-4 border border-red-100 rounded-md">
                  <p className="text-sm flex items-center">
                    <span className="mr-2">🎁</span>
                    Add $250.11 to cart and get free shipping!
                  </p>
                </div>
              </div>

              <h2 className="font-bold text-xl mb-4">Billing details</h2>
              <div className="w-full bg-white border border-base-300 p-4 rounded-box">
                {/* Customer Name */}
                <div className="mt-4">
                  <InputField
                    name="customerName"
                    title="Full name *"
                    type="text"
                    placeholder="Your full name"
                    inputClassName="w-full"
                    register={register}
                  />
                  {errors.customerName && <p className="text-red-500 text-sm">{errors.customerName.message}</p>}
                </div>

                {/* Company Name (optional) */}
                <div className="mt-4">
                  <label className="fieldset-label">Company name (optional)</label>
                  <input type="text" className="input w-full" placeholder="" />
                </div>

                {/* Country */}
                <div className="mt-4">
                  <label className="fieldset-label">Country / Region *</label>
                  <SelectForm name="country" options={countryOptions} register={register} />
                  {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
                </div>

                {/* Street Address */}
                <div className="mt-4">
                  <InputField
                    name="street"
                    title="Street address *"
                    type="text"
                    placeholder="House number and street name"
                    inputClassName="w-full"
                    register={register}
                  />
                  {errors.street && <p className="text-red-500 text-sm">{errors.street.message}</p>}
                </div>

                {/* Apartment (optional) */}
                <div className="mt-4">
                  <label className="fieldset-label">Apartment, suite, unit, etc. (optional)</label>
                  <input type="text" className="input w-full" placeholder="" />
                </div>

                {/* City */}
                <div className="mt-4">
                  <InputField
                    name="city"
                    title="Town / City *"
                    type="text"
                    placeholder=""
                    inputClassName="w-full"
                    register={register}
                  />
                  {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                </div>

                {/* Postal Code */}
                <div className="mt-4">
                  <InputField
                    name="postalCode"
                    title="ZIP Code *"
                    type="text"
                    placeholder=""
                    inputClassName="w-full"
                    register={register}
                  />
                  {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode.message}</p>}
                </div>

                {/* Phone */}
                <div className="mt-4">
                  <InputField
                    name="phone"
                    title="Phone *"
                    type="tel"
                    placeholder=""
                    inputClassName="w-full"
                    register={register}
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>

                {/* Email */}
                <div className="mt-4">
                  <InputField
                    name="email"
                    title="Email address *"
                    type="email"
                    placeholder=""
                    inputClassName="w-full"
                    register={register}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                {/* Order Notes */}
                <div className="mt-4">
                  <label className="fieldset-label">Order notes (optional)</label>
                  <textarea
                    className="textarea h-24 w-full"
                    placeholder="Notes about your order, e.g. special notes for delivery"
                    {...register("notes")}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Right side - Order Summary */}
            <div className="col-span-1 md:col-span-1">
              <div className="w-full bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Your order</h2>

                <div className="flex justify-between text-gray-500 mb-2">
                  <span>Product</span>
                  <span>Subtotal</span>
                </div>

                <div className="border-t border-gray-200 py-4">
                  {selectedProducts.map((product) => (
                    <div key={product.productID} className="flex justify-between mb-2">
                      <div>
                        {product.productName} <span className="text-gray-500">× {product.quantity}</span>
                      </div>
                      <div>${product.subtotal.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between border-t border-gray-200 py-4 text-gray-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 py-4">
                  <span className="text-gray-500">Shipping:</span>
                  <div className="flex flex-col space-y-2">
                    {shippingMethods.map((method) => (
                      <label key={method.id} className="flex items-center justify-end gap-2">
                        <span>
                          {method.name === "Flat rate" ? `${method.name}: $${method.price.toFixed(2)}` : method.name}
                        </span>
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={selectedShipping === method.id}
                          onChange={() => setSelectedShipping(method.id)}
                          className="radio"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between border-t border-gray-200 py-4 font-bold">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>

                {/* Payment Methods */}
                <div className="border-t border-gray-200 py-4">
                  <label className="flex items-center mb-4">
                    <input type="radio" value="COD" {...register("paymentMethod")} className="radio mr-2" />
                    <span className="font-bold">Cash On Delivery</span>
                  </label>

                  <label className="flex items-center mb-4">
                    <input type="radio" value="Card" {...register("paymentMethod")} className="radio mr-2" />
                    <span className="font-bold">Credit/Debit Card</span>
                  </label>

                  <label className="flex items-center mb-4">
                    <input type="radio" value="Paypal" {...register("paymentMethod")} className="radio mr-2" />
                    <span className="font-bold">PayPal</span>
                  </label>

                  {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>}
                </div>

                <div className="text-gray-600 text-sm mb-4">
                  Your personal data will be used to process your order, support your experience throughout this
                  website, and for other purposes described in our{" "}
                  <Link href="/privacy-policy" className="text-purple-700 underline">
                    privacy policy
                  </Link>
                  .
                </div>

                <label className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={() => setTermsAgreed(!termsAgreed)}
                    className="checkbox mt-1 mr-2"
                  />
                  <span className="text-sm">
                    I have read and agree to the website{" "}
                    <Link href="/terms" className="text-purple-700 underline">
                      terms and conditions
                    </Link>{" "}
                    *
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!termsAgreed || isSubmitting || !user}
                  className="w-full bg-purple-700 text-white py-3 rounded-md font-medium hover:bg-purple-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {!user
                    ? "Login to Place Order"
                    : isSubmitting
                    ? "Processing..."
                    : `Place Order - $${totalAmount.toFixed(2)}`}
                </button>

                {!user && (
                  <div className="mt-2 text-center">
                    <Link href="/login" className="text-purple-700 underline">
                      Login to your account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CheckoutPage;
