// components/product/ProductDescription.tsx
import React, { useState } from "react";

import { ProductCardProps } from "@/types/product.types";

import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

interface ProductDescriptionProps {
  product: ProductCardProps;
}

const ProductDescription = ({ product }: ProductDescriptionProps) => {
  const [activeTab, setActiveTab] = useState("description");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewAdded = () => {
    // Force refresh of reviews
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="mt-10">
      <div className="tabs tabs-lift">
        <input
          type="radio"
          name="product_tabs"
          className="tab"
          aria-label="Description"
          checked={activeTab === "description"}
          onChange={() => setActiveTab("description")}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6 text-text-primary text-justify md:text-base text-xs">
          {product.description ? product.description : "No description available."}
        </div>

        <input
          type="radio"
          name="product_tabs"
          className="tab"
          aria-label={`Reviews (${product.reviewsCount || 0})`}
          checked={activeTab === "reviews"}
          onChange={() => setActiveTab("reviews")}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6 md:text-base text-xs">
          <ReviewForm productId={product.id} onReviewAdded={handleReviewAdded} />
          <ReviewList productId={product.id} reviews={product.reviews || []} />
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
