import React from "react";

import { FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";

import { Address } from "@/types/order.types";

interface AddressCardProps {
  address: Address;
  index: number;
  isPrimary: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetPrimary: () => void;
}

const AddressCard = ({ address, index, isPrimary, onEdit, onDelete, onSetPrimary }: AddressCardProps) => {
  return (
    <div
      className={`card bg-base-100 border transition-all ${
        isPrimary ? "border-primary shadow-md" : "border-gray-200 hover:border-primary/30 hover:shadow-md"
      }`}
    >
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div className="flex gap-2 items-center">
            <div className="badge badge-primary">Address {index + 1}</div>
            {isPrimary && (
              <div className="badge badge-accent gap-1">
                <FiCheck className="h-3 w-3" /> Primary
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {!isPrimary && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={onSetPrimary}
                title="Set as primary address"
              >
                Set as Primary
              </button>
            )}
            <button type="button" className="btn btn-ghost btn-sm btn-circle" onClick={onEdit} title="Edit address">
              <FiEdit2 className="text-primary" />
            </button>
            <button type="button" className="btn btn-ghost btn-sm btn-circle" onClick={onDelete} title="Delete address">
              <FiTrash2 className="text-error" />
            </button>
          </div>
        </div>
        <div className="space-y-1 mt-2 text-gray-700">
          <p className="font-medium">{address.street}</p>
          <p>
            {address.city}, {address.postalCode}
          </p>
          <p>{address.country}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AddressCard);
