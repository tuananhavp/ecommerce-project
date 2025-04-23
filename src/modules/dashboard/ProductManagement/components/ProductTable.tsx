"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";

import clsx from "clsx";
import { MdDelete, MdOutlineEdit } from "react-icons/md";

import Loading from "@/components/Loading";
import { useProductStore } from "@/store/productStore";
import { ProductCardProps } from "@/types/product.types";

import EditProductForm from "./EditProductForm";

const ProductTable = () => {
  const { products, getAllProduct, deleteProduct, isLoading } = useProductStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productToEdit, setProductToEdit] = useState<ProductCardProps | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = products ? Math.ceil(products.length / itemsPerPage) : 0;

  const goToPage = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const openDeleteModal = (id: string) => {
    setProductToDelete(id);
    (document.getElementById("delete_modal") as HTMLDialogElement)?.showModal();
  };

  const closeDeleteModal = () => {
    (document.getElementById("delete_modal") as HTMLDialogElement)?.close();
    setProductToDelete(null);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      setIsDeleting(true);
      await deleteProduct(productToDelete);
      const remainingItems = (products?.length || 0) - 1;
      const newTotalPages = Math.ceil(remainingItems / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (product: ProductCardProps) => {
    setProductToEdit(product);
    (document.getElementById("edit_modal") as HTMLDialogElement)?.showModal();
  };

  const closeEditModal = () => {
    (document.getElementById("edit_modal") as HTMLDialogElement)?.close();
    setProductToEdit(null);
  };

  const categoryColorMap: Record<string, string> = {
    Vegetables: "badge-secondary",
    Beverages: "badge-primary",
    "Biscuits & Snacks": "badge-accent",
    Grocery: "badge-error",
    "Frozen Foods": "badge-info",
  };

  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);

  if (isLoading && !isDeleting) {
    return (
      <div className="flex items-center justify-center mt-36">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto w-full">
        <table className="table w-full text-sm sm:text-base">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Trending</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => {
              const { category, name, stockQuantity, imgUrl, trending, id } = product;
              return (
                <tr key={id}>
                  <td>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-10 h-10">
                          <Image src={imgUrl[0]} alt={name} width={40} height={40} />
                        </div>
                      </div>
                      <span className="hidden sm:inline-block">#{id}</span>
                    </div>
                  </td>
                  <td className="max-w-xs break-words">{name}</td>
                  <td>
                    <span className={clsx("badge text-white", categoryColorMap[category])}>{category}</span>
                  </td>
                  <td>{stockQuantity}</td>
                  <td>{trending ? "Trending" : "Unpopular"}</td>
                  <td className="flex justify-end gap-2">
                    <button className="btn btn-success btn-xs" onClick={() => openEditModal(product)}>
                      <MdOutlineEdit className="size-4" />
                    </button>
                    <button className="btn btn-warning btn-xs" onClick={() => openDeleteModal(id)}>
                      <MdDelete className="size-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Product</h3>
          <p className="py-4">Are you sure you want to delete this product?</p>
          <div className="modal-action">
            <button className="btn btn-error" onClick={handleDeleteProduct} disabled={isDeleting}>
              {isDeleting ? <span className="loading loading-spinner loading-xs" /> : "Delete"}
            </button>
            <button className="btn" onClick={closeDeleteModal} disabled={isDeleting}>
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box max-w-3xl">
          {productToEdit && <EditProductForm product={productToEdit} onClose={closeEditModal} />}
        </div>
      </dialog>

      {/* Pagination */}
      <div className="flex flex-col gap-3 md:flex-row justify-between items-center px-2 sm:px-4">
        <div className="text-sm text-center md:text-left">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, products?.length || 0)} of{" "}
          {products?.length || 0} entries
        </div>

        <div className="join">
          <button className="join-item btn btn-sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
            «
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              className={`join-item btn btn-sm ${currentPage === number ? "btn-active" : ""}`}
              onClick={() => goToPage(number)}
            >
              {number}
            </button>
          ))}
          <button className="join-item btn btn-sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
            »
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Items per page:</span>
          <select
            className="select select-sm select-bordered"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 20, 50].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
