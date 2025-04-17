import React, { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import Loading from "@/components/Loading";
import { useProductStore } from "@/store/productStore";
import { ProductCardProps } from "@/types/product.types";
import EditProductForm from "../EditProductForm";
import { MdDelete, MdOutlineEdit } from "react-icons/md";

const ProductTable = () => {
  const { products, getAllProduct, deleteProduct, isLoading } = useProductStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productToEdit, setProductToEdit] = useState<ProductCardProps | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = products ? Math.ceil(products.length / itemsPerPage) : 0;

  // Pagination controls
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Create page numbers array for pagination buttons
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Delete modal functions
  const openDeleteModal = (id: string) => {
    setProductToDelete(id);
    const modal = document.getElementById("delete_modal") as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const closeDeleteModal = () => {
    const modal = document.getElementById("delete_modal") as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
    setProductToDelete(null);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      await deleteProduct(productToDelete);
      // Check if we need to adjust current page after deletion
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

  // Edit modal functions
  const openEditModal = (product: ProductCardProps) => {
    setProductToEdit(product);
    const modal = document.getElementById("edit_modal") as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const closeEditModal = () => {
    const modal = document.getElementById("edit_modal") as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
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
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Trending</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => {
              const { category, name, stockQuantity, imgUrl, trending, id } = product;
              return (
                <tr key={`${id}`}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <Image src={imgUrl[0]} alt={name} width={48} height={48} />
                        </div>
                      </div>
                      <div>
                        <span className="">#{id}</span>
                      </div>
                    </div>
                  </td>
                  <td>{name}</td>
                  <td>
                    <span className={clsx("badge text-white", categoryColorMap[category])}>{category}</span>
                  </td>
                  <td>{stockQuantity}</td>
                  <td>{trending ? "Trending" : "Unpopular"}</td>
                  <th className="">
                    <button className="btn btn-success btn-xs mr-1.5" onClick={() => openEditModal(product)}>
                      <MdOutlineEdit className="size-5" />
                    </button>
                    <button className="btn btn-warning btn-xs" onClick={() => openDeleteModal(id)}>
                      <MdDelete className="size-5" />
                    </button>
                  </th>
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
          <p className="py-4">Are you sure you want to delete this product? This action cannot be undone.</p>
          <div className="modal-action">
            <button className="btn btn-error" onClick={handleDeleteProduct} disabled={isDeleting}>
              {isDeleting ? <span className="loading loading-spinner loading-xs"></span> : "Delete"}
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

      {/* Pagination Controls */}
      <div className="flex justify-between items-center px-4">
        <div className="text-sm">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, products?.length || 0)} of{" "}
          {products?.length || 0} entries
        </div>

        <div className="join">
          <button className="join-item btn" onClick={goToPreviousPage} disabled={currentPage === 1}>
            «
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              className={`join-item btn ${currentPage === number ? "btn-active" : ""}`}
              onClick={() => goToPage(number)}
            >
              {number}
            </button>
          ))}

          <button className="join-item btn" onClick={goToNextPage} disabled={currentPage === totalPages}>
            »
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm w-52">Items per page:</span>
          <select
            className="select select-bordered select-sm"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
