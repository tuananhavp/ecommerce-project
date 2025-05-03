"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import clsx from "clsx";
import { BiSearch } from "react-icons/bi";
import { FaFilter } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import Swal from "sweetalert2";

import Loading from "@/components/Loading";
import { useProductStore } from "@/store/productStore";
import { ProductCardProps } from "@/types/product.types";

import EditProductForm from "./EditProductForm";

const ProductTable = () => {
  const { products, getAllProduct, deleteProduct, isLoading } = useProductStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productToEdit, setProductToEdit] = useState<ProductCardProps | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Calculate current products based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter and search products
  const filteredProducts =
    products?.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    }) || [];

  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get unique categories for filter dropdown
  const categories = products ? ["All", ...new Set(products.map((product) => product.category))] : ["All"];

  // Pagination controls
  const goToPage = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Create a limited page number array for better UX
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Show at most 5 page buttons

    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are fewer than maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Add ellipsis if current page is not close to first page
      if (currentPage > 3) {
        pageNumbers.push(-1); // Use -1 to represent ellipsis
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          // Skip first and last pages as they're added separately
          pageNumbers.push(i);
        }
      }

      // Add ellipsis if current page is not close to last page
      if (currentPage < totalPages - 2) {
        pageNumbers.push(-2); // Use -2 to represent ellipsis
      }

      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  // Modal functions
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
      Swal.fire({
        title: "Deleted!",
        text: "Product has been successfully deleted.",
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Update pagination if needed
      const remainingItems = filteredProducts.length - 1;
      const newTotalPages = Math.ceil(remainingItems / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete product:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete product.",
        icon: "error",
      });
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

  // Category badge colors
  const categoryColorMap: Record<string, string> = {
    Vegetables: "bg-green-500",
    Beverages: "bg-blue-500",
    Snacks: "bg-amber-500",
    Grocery: "bg-red-500",
    "Frozen Foods": "bg-cyan-500",
  };

  // Default badge color if category not in map
  const getDefaultCategoryColor = (category: string) => {
    return categoryColorMap[category] || "bg-gray-500";
  };

  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, itemsPerPage]);

  return (
    <div className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-sm">
      {/* Header and filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard/product/create-product">
            <button className="btn btn-md bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors">
              <IoAddCircleOutline className="size-5" />
              <span>Add Product</span>
            </button>
          </Link>

          <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 w-full sm:w-80">
            <BiSearch className="text-gray-400 size-5 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent border-none outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              className="select select-sm border-gray-300"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show:</span>
            <select
              className="select select-sm border-gray-300"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
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

      {/* Products count summary */}
      <div className="text-sm text-gray-500">
        Showing {filteredProducts.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
        {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
        {searchTerm && ` (filtered from ${products?.length || 0} total products)`}
      </div>

      {/* Table */}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        {isLoading && !isDeleting ? (
          <div className="flex items-center justify-center h-64">
            <Loading />
          </div>
        ) : (
          <table className="table table-zebra w-full bg-white">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 w-10">
                  <label>
                    <input type="checkbox" className="checkbox checkbox-sm" />
                  </label>
                </th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3 hidden md:table-cell">Category</th>
                <th className="px-4 py-3 hidden sm:table-cell">Stock</th>
                <th className="px-4 py-3 hidden lg:table-cell">Trending</th>
                <th className="px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => {
                  const { category, name, stockQuantity, imgUrl, trending, id } = product;
                  return (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <label>
                          <input type="checkbox" className="checkbox checkbox-sm" />
                        </label>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-md relative overflow-hidden">
                              <Image src={imgUrl[0]} alt={name} fill sizes="48px" className="object-cover" />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium line-clamp-2">{name}</div>
                            <div className="text-xs text-gray-500">#{id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span
                          className={clsx(
                            "px-2 py-1 rounded-full text-xs font-medium text-white",
                            getDefaultCategoryColor(category)
                          )}
                        >
                          {category}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="flex items-center">
                          <div
                            className={clsx(
                              "h-2 rounded-full w-16 mr-2",
                              stockQuantity > 20 ? "bg-green-500" : stockQuantity > 5 ? "bg-yellow-500" : "bg-red-500"
                            )}
                          >
                            <div
                              className={clsx(
                                "h-2 rounded-full",
                                stockQuantity > 20 ? "bg-green-700" : stockQuantity > 5 ? "bg-yellow-700" : "bg-red-700"
                              )}
                              style={{ width: `${Math.min(100, stockQuantity * 2)}%` }}
                            ></div>
                          </div>
                          <span>{stockQuantity}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {trending ? (
                          <span className="badge badge-success badge-sm">Trending</span>
                        ) : (
                          <span className="badge badge-ghost badge-sm">Regular</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button className="btn btn-sm btn-outline btn-primary" onClick={() => openEditModal(product)}>
                            <MdOutlineEdit className="size-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button className="btn btn-sm btn-outline btn-error" onClick={() => openDeleteModal(id)}>
                            <MdDelete className="size-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    {searchTerm || categoryFilter !== "All"
                      ? "No products match your search criteria"
                      : "No products available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        <div className="text-sm text-gray-500">
          {filteredProducts.length > 0 && (
            <>
              Page {currentPage} of {totalPages}
            </>
          )}
        </div>

        {totalPages > 0 && (
          <div className="join shadow-sm">
            <button className="join-item btn btn-sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
              «
            </button>

            {pageNumbers.map((number, index) =>
              number < 0 ? (
                <button className="join-item btn btn-sm btn-disabled" key={`ellipsis-${index}`}>
                  ...
                </button>
              ) : (
                <button
                  key={number}
                  className={`join-item btn btn-sm ${currentPage === number ? "btn-active" : ""}`}
                  onClick={() => goToPage(number)}
                >
                  {number}
                </button>
              )
            )}

            <button
              className="join-item btn btn-sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              »
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg">Delete Product</h3>
          <p className="py-4">Are you sure you want to delete this product? This action cannot be undone.</p>
          <div className="modal-action">
            <button className="btn btn-error text-white" onClick={handleDeleteProduct} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
            <button className="btn btn-outline" onClick={closeDeleteModal} disabled={isDeleting}>
              Cancel
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button disabled={isDeleting}>Close</button>
        </form>
      </dialog>

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box max-w-3xl bg-white p-0">
          {productToEdit && <EditProductForm product={productToEdit} onClose={closeEditModal} />}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </div>
  );
};

export default ProductTable;
