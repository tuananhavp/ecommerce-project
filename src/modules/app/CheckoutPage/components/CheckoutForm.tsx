"use client";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import InputField from "@/components/InputField";
import SelectForm from "@/components/SelectForm";
import { OrderFormSchema } from "@/types/order.types";

type OrderValue = z.infer<typeof OrderFormSchema>;

// interface CheckoutFormProps {
//   products: Array<{
//     productID: string;
//     productName: string;
//     productImage: string;
//     quantity: number;
//     pricePerUnit: number;
//     subtotal: number;
//   }>;
//   totalAmount: number;
//   onSubmitOrder: (data: OrderValue) => Promise<void>;
// }

const CheckoutForm = () => {
  const [differentShipping, setDifferentShipping] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<OrderValue>({
    mode: "onChange",
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      postalCode: "",
      country: "United States (US)",
      //   orderItems: products,
      //   totalAmount: totalAmount,
      paymentMethod: "COD",
    },
  });

  const handleFormSubmit = async (data: OrderValue) => {
    try {
      //   await onSubmitOrder(data);
      console.log(data);
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  const countryOptions = ["Select Country", "United States (US)", "Canada", "United Kingdom", "Australia", "Vietnam"];
  const stateOptions = [
    "Select State",
    "California",
    "New York",
    "Texas",
    "Florida",
    "Washington",
    "Hanoi",
    "Ho Chi Minh",
  ];
  const paymentOptions = ["Select Payment Method", "COD", "Card", "Paypal"];

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="bg-red-50 p-4 border border-red-100 rounded-md">
          <p className="text-sm flex items-center">
            <span className="mr-2">🎁</span>
            Add $250.11 to cart and get free shipping!
          </p>
        </div>
      </div>

      <h2 className="font-bold text-xl mb-4">Billing details</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <fieldset className="fieldset w-full bg-white border border-base-300 p-4 rounded-box">
          {/* Customer Name - Split into First/Last Name fields visually */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputField
                name="customerName"
                title="First name *"
                type="text"
                placeholder=""
                inputClassName="w-full"
                register={register}
              />
              {errors.customerName && <p className="text-red-500 text-sm">{errors.customerName.message}</p>}
            </div>

            <div>
              <label className="fieldset-label">Last name *</label>
              <input type="text" className="input w-full" placeholder="" />
            </div>
          </div>

          {/* Company Name (not in schema but in UI) */}
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

          {/* Apartment (not in schema but in UI) */}
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

          {/* State (not in schema but in UI) */}
          {/* <div className="mt-4">
            <label className="fieldset-label">State *</label>
            <SelectForm name="state" options={stateOptions} register={register} />
          </div> */}

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

          {/* Create Account Checkbox (not in schema but in UI) */}
          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox"
                checked={createAccount}
                onChange={() => setCreateAccount(!createAccount)}
              />
              <span>Create an account?</span>
            </label>
          </div>

          {/* Different Shipping Address Checkbox (not in schema but in UI) */}
          <div className="mt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox"
                checked={differentShipping}
                onChange={() => setDifferentShipping(!differentShipping)}
              />
              <span>Ship to a different address?</span>
            </label>
          </div>

          {/* Conditional Shipping Address Section */}
          {differentShipping && (
            <div className="mt-4 p-4 border border-gray-200 rounded-md">
              <h3 className="font-medium mb-2">Shipping Address</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="fieldset-label">First name *</label>
                  <input type="text" className="input w-full" placeholder="" />
                </div>

                <div>
                  <label className="fieldset-label">Last name *</label>
                  <input type="text" className="input w-full" placeholder="" />
                </div>
              </div>

              <div className="mt-4">
                <label className="fieldset-label">Street address *</label>
                <input type="text" className="input w-full" placeholder="House number and street name" />
              </div>

              <div className="mt-4">
                <label className="fieldset-label">Town / City *</label>
                <input type="text" className="input w-full" placeholder="" />
              </div>

              <div className="mt-4">
                <label className="fieldset-label">State *</label>
                <select className="select select-primary w-full">
                  {stateOptions.map((option, index) => (
                    <option key={index} value={option} disabled={index === 0}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="fieldset-label">ZIP Code *</label>
                <input type="text" className="input w-full" placeholder="" />
              </div>
            </div>
          )}

          {/* Order Notes (not in schema but in UI) */}
          <div className="mt-4">
            <label className="fieldset-label">Order notes (optional)</label>
            <textarea
              className="textarea h-24 w-full"
              placeholder="Notes about your order, e.g. special notes for delivery"
            ></textarea>
          </div>

          {/* Payment Method */}
          <div className="mt-4">
            <label className="fieldset-label">Payment Method *</label>
            <SelectForm name="paymentMethod" options={paymentOptions} register={register} />
            {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>}
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default CheckoutForm;
