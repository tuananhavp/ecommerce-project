"use client";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import InputField from "@/components/InputField";
import SelectForm from "@/components/SelectForm";
import { useProductStore } from "@/store/productStore";
import { ProductCardProps, productSchema } from "@/types/product.types";

type ProductValues = z.infer<typeof productSchema>;

interface EditProductFormProps {
  product: ProductCardProps;
  onClose: () => void;
}

const EditProductForm = ({ product, onClose }: EditProductFormProps) => {
  const categorySelect = ["Pick a category", "Vegetables", "Beverages", "Biscuits & Snacks", "Frozen Foods", "Grocery"];
  const [isUpdating, setIsUpdating] = useState(false);
  const updateProduct = useProductStore((state) => state.updateProduct);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      oldPrice: product.oldPrice?.toString() || "",
      newPrice: product.newPrice?.toString() || "",
      stockQuantity: product.stockQuantity?.toString() || "",
      category: product.category,
      trending: product.trending,
    },
  });

  const onSubmit = async (data: ProductValues) => {
    try {
      setIsUpdating(true);
      await updateProduct(product.id, {
        name: data.name,
        description: data.description,
        oldPrice: data.oldPrice,
        newPrice: data.newPrice,
        stockQuantity: data.stockQuantity,
        category: data.category,
        trending: data.trending,
      });
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="w-full">
      <h3 className="font-bold text-xl text-text-primary">Edit Product</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset w-full bg-white border border-base-300 p-4 rounded-box">
          <InputField
            name="name"
            title="Name"
            type="text"
            placeholder="Product name..."
            inputClassName="w-full"
            register={register}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <fieldset className="fieldset">
            <legend className="fieldset-legend text-gray-primary font-normal">Description</legend>
            <textarea
              {...register("description")}
              className="textarea h-24 w-full"
              placeholder="Description..."
            ></textarea>
            <div className="fieldset-label text-[10px]">Optional</div>
          </fieldset>
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}

          <fieldset className="fieldset">
            <legend className="fieldset-legend text-gray-primary font-normal">Quantity</legend>
            <input {...register("stockQuantity")} className="input w-full" placeholder="" type="number"></input>
          </fieldset>
          {errors.stockQuantity && <p className="text-red-500">{errors.stockQuantity.message}</p>}

          <fieldset className="fieldset">
            <legend className="fieldset-legend text-gray-primary font-normal">Original Price</legend>
            <input {...register("oldPrice")} className="input w-full" placeholder="" type="number" step="0.01"></input>
          </fieldset>
          {errors.oldPrice && <p className="text-red-500">{errors.oldPrice.message}</p>}

          <fieldset className="fieldset">
            <legend className="fieldset-legend text-gray-primary font-normal">Discount Price</legend>
            <input {...register("newPrice")} className="input w-full" placeholder="" type="number" step="0.01"></input>
          </fieldset>
          {errors.newPrice && <p className="text-red-500">{errors.newPrice.message}</p>}

          <SelectForm options={categorySelect} register={register} name="category" />
          {errors.category && <p className="text-red-500">{errors.category.message}</p>}

          <fieldset className="fieldset mt-2">
            <div className="flex items-center gap-2">
              <input id="trending" type="checkbox" className="checkbox" {...register("trending")} />
              <label htmlFor="trending" className="cursor-pointer">
                Mark as trending
              </label>
            </div>
          </fieldset>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn" onClick={onClose} disabled={isUpdating}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isUpdating}>
              {isUpdating ? <span className="loading loading-spinner loading-xs"></span> : "Update Product"}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default EditProductForm;
