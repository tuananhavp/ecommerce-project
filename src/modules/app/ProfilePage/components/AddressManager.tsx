import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { FiMapPin, FiPlus } from "react-icons/fi";

import { Address } from "@/types/order.types";

import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

interface AddressManagerProps {
  addresses: Address[];
  primaryAddressIndex?: number;
  onAddressesUpdate: (addresses: Address[], primaryIndex?: number) => void;
  onSetPrimaryAddress: (index: number) => Promise<void>;
  onSubmit: () => void;
  isLoading: boolean;
  setActiveTab: (tab: "profile" | "addresses") => void;
}

const AddressManager: React.FC<AddressManagerProps> = ({
  addresses,
  primaryAddressIndex,
  onAddressesUpdate,
  onSetPrimaryAddress,
  onSubmit,
  isLoading,
  setActiveTab,
}) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);

  const addressForm = useForm<Address>({
    mode: "onChange",
    defaultValues: {
      street: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  const handleAddAddress = addressForm.handleSubmit((data) => {
    const newAddress: Address = {
      street: data.street,
      city: data.city,
      postalCode: data.postalCode,
      country: data.country,
    };

    let updatedAddresses: Address[];
    let newPrimaryIndex = primaryAddressIndex;

    if (editingAddressIndex !== null) {
      // Update existing address
      updatedAddresses = [...addresses];
      updatedAddresses[editingAddressIndex] = newAddress;
    } else {
      // Add new address
      updatedAddresses = [...addresses, newAddress];

      // If this is the first address, automatically set it as primary
      if (addresses.length === 0) {
        newPrimaryIndex = 0;
      }
    }

    onAddressesUpdate(updatedAddresses, newPrimaryIndex);
    addressForm.reset();
    setEditingAddressIndex(null);
    setShowAddressForm(false);
  });

  const handleEditAddress = (index: number) => {
    const address = addresses[index];
    addressForm.setValue("street", address.street);
    addressForm.setValue("city", address.city);
    addressForm.setValue("postalCode", address.postalCode);
    addressForm.setValue("country", address.country);

    setEditingAddressIndex(index);
    setShowAddressForm(true);
  };

  const handleRemoveAddress = (index: number) => {
    // Check if the deleted address is the primary address
    let newPrimaryIndex = primaryAddressIndex;

    if (primaryAddressIndex === index) {
      // Reset primary address or set the next available address as primary
      if (addresses.length > 1) {
        newPrimaryIndex = index === addresses.length - 1 ? index - 1 : index;
      } else {
        newPrimaryIndex = undefined;
      }
    } else if (primaryAddressIndex !== undefined && primaryAddressIndex > index) {
      // If we're removing an address before the primary, we need to decrement the index
      newPrimaryIndex = primaryAddressIndex - 1;
    }

    const updatedAddresses = addresses.filter((_, i) => i !== index);
    onAddressesUpdate(updatedAddresses, newPrimaryIndex);
  };

  const handleCancelAddressEdit = () => {
    addressForm.reset();
    setEditingAddressIndex(null);
    setShowAddressForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center gap-3">
          <FiMapPin className="text-primary" /> Shipping Addresses
        </h3>
        {!showAddressForm && (
          <button type="button" className="btn btn-primary gap-2" onClick={() => setShowAddressForm(true)}>
            <FiPlus /> Add New Address
          </button>
        )}
      </div>

      {/* Address List */}
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {addresses.map((address, index) => (
            <AddressCard
              key={`address-${index}`}
              address={address}
              index={index}
              isPrimary={primaryAddressIndex === index}
              onEdit={() => handleEditAddress(index)}
              onDelete={() => handleRemoveAddress(index)}
              onSetPrimary={() => onSetPrimaryAddress(index)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
          <FiMapPin className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-gray-600 mb-4">No addresses have been added yet.</p>
          {!showAddressForm && (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowAddressForm(true)}>
              <FiPlus className="mr-2" /> Add Your First Address
            </button>
          )}
        </div>
      )}

      {/* Address Form */}
      {showAddressForm && (
        <AddressForm
          form={addressForm}
          isEditing={editingAddressIndex !== null}
          isFirstAddress={addresses.length === 0}
          onCancel={handleCancelAddressEdit}
          onSubmit={handleAddAddress}
        />
      )}

      {/* Save All Changes Button for Addresses Tab */}
      <div className="flex justify-end gap-4 pt-8 mt-6 border-t">
        <button type="button" onClick={() => setActiveTab("profile")} className="btn btn-outline btn-lg px-8">
          Back to Profile
        </button>
        <button type="button" onClick={onSubmit} className="btn btn-primary btn-lg px-8">
          {isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Save All Changes"}
        </button>
      </div>
    </div>
  );
};

export default React.memo(AddressManager);
