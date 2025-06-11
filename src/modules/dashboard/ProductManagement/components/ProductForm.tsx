"use client";
import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { BsImage } from "react-icons/bs";
import { FiUploadCloud } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import Swal from "sweetalert2";
import { z } from "zod";

import InputField from "@/components/InputField";
import SelectForm from "@/components/SelectForm";
import { useProductStore } from "@/store/productStore";
import { productSchema } from "@/types/product.types";

type ProductValues = z.infer<typeof productSchema>;

const ProductForm = () => {
  const router = useRouter();
  const categorySelect = ["Pick a category", "Vegetables", "Beverages", "Snacks", "Frozen Foods", "Grocery"];
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
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
      const file = e.target.files[0];
      setMainImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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

      await createProduct(productData);

      Swal.fire({
        title: "You added a product successfully",
        icon: "success",
        draggable: true,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/dashboard/product");
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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/product" className="mr-3">
          <button className="btn btn-circle btn-sm btn-ghost">
            <IoArrowBack />
          </button>
        </Link>
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Product details */}
          <div>
            <div className="card bg-base-100 border border-base-200 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-lg mb-4">Product Information</h2>

                <div className="space-y-4">
                  <InputField
                    name="name"
                    title="Product Name"
                    type="text"
                    placeholder="Enter product name"
                    inputClassName="w-full"
                    register={register}
                    required
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>}

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Description</span>
                      <span className="label-text-alt text-gray-500 text-xs">Optional</span>
                    </label>
                    <textarea
                      {...register("description")}
                      className="textarea textarea-bordered h-24 w-full"
                      placeholder="Describe your product..."
                    ></textarea>
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description.message as string}</p>
                    )}
                  </div>

                  <div className="form-control">
                    <SelectForm options={categorySelect} register={register} name="category" />
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category.message as string}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-200 shadow-sm mt-6">
              <div className="card-body">
                <h2 className="card-title text-lg mb-4">Pricing & Inventory</h2>

                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Stock Quantity</span>
                    </label>
                    <input
                      {...register("stockQuantity")}
                      className="input input-bordered w-full"
                      placeholder="0"
                      type="number"
                    />
                    {errors.stockQuantity && (
                      <p className="text-red-500 text-sm mt-1">{errors.stockQuantity.message as string}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Original Price ($)</span>
                      </label>
                      <input
                        {...register("oldPrice")}
                        className="input input-bordered w-full"
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                      />
                      {errors.oldPrice && (
                        <p className="text-red-500 text-sm mt-1">{errors.oldPrice.message as string}</p>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Discount Price ($)</span>
                      </label>
                      <input
                        {...register("newPrice")}
                        className="input input-bordered w-full"
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                      />
                      {errors.newPrice && (
                        <p className="text-red-500 text-sm mt-1">{errors.newPrice.message as string}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-control mt-2">
                    <label className="label cursor-pointer justify-start">
                      <input type="checkbox" className="checkbox checkbox-primary mr-3" {...register("trending")} />
                      <span className="label-text font-medium">Mark as trending</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Images */}
          <div className="card bg-base-100 border border-base-200 shadow-sm h-fit">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">Product Images</h2>

              <div className="space-y-6">
                {/* Main Image */}
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Main Product Image</span>
                  </label>

                  <div className="border-2 border-dashed rounded-lg p-4 bg-gray-50 text-center">
                    {mainImagePreview ? (
                      <div className="relative mb-3">
                        <Image
                          src={mainImagePreview}
                          alt="Main product image"
                          width={200}
                          height={200}
                          className="mx-auto object-cover rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="p-8 flex flex-col items-center">
                        <FiUploadCloud className="text-3xl text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload main product image</p>
                      </div>
                    )}

                    <input
                      type="file"
                      id="main-image"
                      className="hidden"
                      onChange={handleMainImageChange}
                      accept="image/*"
                    />

                    <label htmlFor="main-image" className="btn btn-outline btn-primary mt-2">
                      {mainImagePreview ? "Change Image" : "Browse Image"}
                    </label>
                  </div>
                </div>

                {/* Additional Images */}
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Additional Images</span>
                  </label>

                  <div className="border-2 border-dashed rounded-lg p-4 bg-gray-50 text-center">
                    {additionalImages && additionalImages.length > 0 ? (
                      <div className="flex items-center gap-2 mb-3">
                        <BsImage className="text-xl text-blue-500" />
                        <span>{additionalImages.length} images selected</span>
                      </div>
                    ) : (
                      <div className="p-8 flex flex-col items-center">
                        <FiUploadCloud className="text-3xl text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Upload additional product images</p>
                      </div>
                    )}

                    <input
                      type="file"
                      multiple
                      id="additional-images"
                      className="hidden"
                      onChange={handleAdditionalImagesChange}
                      accept="image/*"
                    />

                    <label htmlFor="additional-images" className="btn btn-outline btn-primary mt-2">
                      {additionalImages && additionalImages.length > 0 ? "Change Images" : "Browse Images"}
                    </label>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">You can select multiple images at once</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end mt-6 pt-4 border-t">
          <div className="flex gap-4">
            <Link href="/dashboard/product">
              <button type="button" className="btn btn-outline">
                Cancel
              </button>
            </Link>

            <button disabled={isSubmitting || uploading} type="submit" className="btn btn-primary bg-purple-primary">
              {isSubmitting || uploading ? (
                <>
                  <span className="loading loading-dots loading-sm"></span>
                  {uploading ? "Uploading..." : "Adding Product..."}
                </>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
