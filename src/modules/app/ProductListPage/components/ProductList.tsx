import { useState, useEffect } from "react";

import ProductCard from "@/components/ProductCard";
import { ProductCardProps } from "@/types/product.types";

import SortingOptions from "./SortingOption";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis if needed before current range
    if (startPage > 2) {
      pages.push("...");
    }

    // Add pages in current range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed after current range
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8">
      <div className="join">
        {/* Previous button */}
        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          «
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              className={`join-item btn btn-sm ${page === currentPage ? "btn-active" : ""}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ) : (
            <button key={index} className="join-item btn btn-sm btn-disabled">
              {page}
            </button>
          )
        )}

        {/* Next button */}
        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
};

const ProductList = ({ products }: { products: ProductCardProps[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [sort, setSort] = useState("newest");
  const [sortedProducts, setSortedProducts] = useState<ProductCardProps[]>([]);

  // Apply sorting to products
  useEffect(() => {
    const inStockProducts = products.filter((product) => product.stockQuantity > 0);
    const outOfStockProducts = products.filter((product) => product.stockQuantity <= 0);

    const sortProductGroup = (group: ProductCardProps[]) => {
      const sorted = [...group];

      switch (sort) {
        case "price_asc":
          sorted.sort((a, b) => {
            const aPrice = a.newPrice !== undefined && a.newPrice !== null ? a.newPrice : a.oldPrice;
            const bPrice = b.newPrice !== undefined && b.newPrice !== null ? b.newPrice : b.oldPrice;
            return aPrice - bPrice;
          });
          break;
        case "price_desc":
          sorted.sort((a, b) => {
            const aPrice = a.newPrice !== undefined && a.newPrice !== null ? a.newPrice : a.oldPrice;
            const bPrice = b.newPrice !== undefined && b.newPrice !== null ? b.newPrice : b.oldPrice;
            return bPrice - aPrice;
          });
          break;
        case "name_asc":
          sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name_desc":
          sorted.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "rating_desc":
          sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case "newest":
        default:
          break;
      }

      return sorted;
    };

    // Sort each group according to the selected criteria
    const sortedInStock = sortProductGroup(inStockProducts);
    const sortedOutOfStock = sortProductGroup(outOfStockProducts);

    // Combine the two groups, with in-stock products first
    const combined = [...sortedInStock, ...sortedOutOfStock];

    setSortedProducts(combined);
    // Reset to first page when sorting changes
    setCurrentPage(1);
  }, [products, sort]);

  // Calculate products to display on current page
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: document.getElementById("product-list-top")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  // Handle sort change
  const handleSortChange = (sortValue: string) => {
    setSort(sortValue);
  };

  return (
    <div id="product-list-top">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        {/* Product count info */}
        <p className="text-sm text-gray-600 mb-2 sm:mb-0">
          Showing {products.length > 0 ? indexOfFirstProduct + 1 : 0}-{Math.min(indexOfLastProduct, products.length)} of{" "}
          {products.length} products
        </p>

        {/* Sorting options */}
        <SortingOptions currentSort={sort} onSortChange={handleSortChange} />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map((product, index) => (
          <ProductCard
            key={index}
            id={product.id}
            name={product.name}
            description={product.description}
            oldPrice={product.oldPrice}
            newPrice={product.newPrice}
            stockQuantity={product.stockQuantity}
            category={product.category}
            trending={product.trending}
            imgUrl={product.imgUrl}
            rating={product.rating}
          />
        ))}
      </div>

      {/* No products message */}
      {currentProducts.length === 0 && (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}

      {/* Pagination controls */}
      <Pagination
        totalItems={sortedProducts.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductList;
