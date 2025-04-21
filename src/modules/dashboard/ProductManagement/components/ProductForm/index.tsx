"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";

import InputField from "@/components/InputField";
import SelectForm from "@/components/SelectForm";
import { useProductStore } from "@/store/productStore";
import { productSchema } from "@/types/product.types";

type ProductValues = z.infer<typeof productSchema>;

const ProductForm = () => {
  const router = useRouter();
  const categorySelect = ["Pick a category", "Vegetables", "Beverages", "Biscuits & Snacks", "Frozen Foods", "Grocery"];
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const createProduct = useProductStore((state) => state.createProduct);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(productSchema),
    defaultValues: {
      trending: false,
    },
  });

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMainImage(e.target.files[0]);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAdditionalImages(e.target.files);
    }
  };

  const uploadToCloudinary = async (files: File[]): Promise<string[]> => {
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "");

        const imgUploaded = await axios
          .post(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_API || "", formData)
          .then((response) => {
            return response.data.url;
          });

        return imgUploaded;
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("Failed to upload images");
    }
  };

  const onSubmit = async (data: ProductValues) => {
    try {
      setUploading(true);
      const imagesToUpload: File[] = [];

      if (mainImage) {
        imagesToUpload.push(mainImage);
      }

      if (additionalImages) {
        for (let i = 0; i < additionalImages.length; i++) {
          imagesToUpload.push(additionalImages[i]);
        }
      }

      let imageUrls: string[] = [];

      if (imagesToUpload.length > 0) {
        imageUrls = await uploadToCloudinary(imagesToUpload);
      }
      const productData = {
        ...data,
        imgUrl: imageUrls,
      };
      console.log(productData);

      await createProduct(productData);

      Swal.fire({
        title: "You added a product successfully",
        icon: "success",
        draggable: true,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/dashboard/products");
        }
      });
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center mt-10">
      <div className="w-6/12">
        <h3 className="font-bold text-xl text-text-primary">Add New Product</h3>
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset w-full bg-white border border-base-300 p-4 rounded-box">
            <InputField
              name="name"
              title="Name"
              type="text"
              placeholder="Product name..."
              inputClassName="w-3/4"
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
              <input {...register("stockQuantity")} className="input w-1/2" placeholder="" type="number"></input>
            </fieldset>
            {errors.stockQuantity && <p className="text-red-500">{errors.stockQuantity.message}</p>}

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-gray-primary font-normal">Original Price</legend>
              <input {...register("oldPrice")} className="input w-1/2" placeholder="" type="number" step="0.01"></input>
            </fieldset>
            {errors.oldPrice && <p className="text-red-500">{errors.oldPrice.message}</p>}

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-gray-primary font-normal">Discount Price</legend>
              <input {...register("newPrice")} className="input w-1/2" placeholder="" type="number" step="0.01"></input>
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

            <fieldset className="fieldset mt-2">
              <legend className="fieldset-legend text-gray-primary font-normal">Main Image of Product</legend>
              <input type="file" className="file-input file-input-info" onChange={handleMainImageChange} />
            </fieldset>

            <fieldset className="fieldset mt-2">
              <legend className="fieldset-legend text-gray-primary font-normal">Other Images of Product</legend>
              <input
                type="file"
                multiple
                className="file-input file-input-info mt-1"
                onChange={handleAdditionalImagesChange}
              />
            </fieldset>

            <button
              disabled={isSubmitting || uploading}
              type="submit"
              className="btn btn-neutral bg-purple-primary mt-4"
            >
              {isSubmitting || uploading ? <span className="loading loading-dots loading-sm"></span> : "Add product"}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
