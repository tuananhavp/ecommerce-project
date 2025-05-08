import React from "react";

import { UseFormReturn } from "react-hook-form";

import InputField from "@/components/InputField";
import { Address } from "@/types/order.types";

interface AddressFormProps {
  form: UseFormReturn<Address>;
  isEditing: boolean;
  isFirstAddress: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

const AddressForm = ({ form, isEditing, isFirstAddress, onCancel, onSubmit }: AddressFormProps) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="card bg-base-100 border shadow-md mt-6">
      <div className="card-body">
        <h3 className="card-title text-primary text-lg">{isEditing ? "Edit Address" : "Add New Address"}</h3>
        <div className="divider my-1"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control md:col-span-2">
            <InputField<Address>
              register={register}
              name="street"
              title="Street Address"
              placeholder="Enter street address"
              type="text"
              inputClassName={errors.street ? "input-error" : ""}
            />
            {errors.street && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.street.message?.toString()}</span>
              </label>
            )}
          </div>

          {/* City Field */}
          <div className="form-control">
            <InputField<Address>
              register={register}
              name="city"
              title="City"
              placeholder="Enter city"
              type="text"
              inputClassName={errors.city ? "input-error" : ""}
            />
            {errors.city && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.city.message?.toString()}</span>
              </label>
            )}
          </div>

          {/* Postal Code Field */}
          <div className="form-control">
            <InputField<Address>
              register={register}
              name="postalCode"
              title="Postal Code"
              placeholder="Enter postal code"
              type="text"
              inputClassName={errors.postalCode ? "input-error" : ""}
            />
            {errors.postalCode && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.postalCode.message?.toString()}</span>
              </label>
            )}
          </div>

          {/* Country Field */}
          <div className="form-control md:col-span-2">
            <InputField<Address>
              register={register}
              name="country"
              title="Country"
              placeholder="Enter country"
              type="text"
              inputClassName={errors.country ? "input-error" : ""}
            />
            {errors.country && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.country.message?.toString()}</span>
              </label>
            )}
          </div>

          {/* If this is a new address and we have no other addresses, let user know it will be primary */}
          {!isEditing && isFirstAddress && (
            <div className="form-control md:col-span-2">
              <label className="cursor-pointer label flex gap-2 justify-start">
                <input type="checkbox" className="checkbox checkbox-primary" checked={true} disabled={true} />
                <span className="label-text">Set as primary address (automatic for first address)</span>
              </label>
            </div>
          )}
        </div>

        <div className="card-actions justify-end mt-4">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? "Update Address" : "Save Address"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default React.memo(AddressForm);
