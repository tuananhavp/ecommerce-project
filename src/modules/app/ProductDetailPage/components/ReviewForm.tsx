import React, { useState } from "react";

import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";

import { useAuthStore } from "@/store/authStore";
import { useProductStore } from "@/store/productStore";
import { ReviewFormData } from "@/types/product.types";

interface ReviewFormProps {
  productId: string;
  onReviewAdded?: () => void;
}

const ReviewForm = ({ productId, onReviewAdded }: ReviewFormProps) => {
  const { user } = useAuthStore();
  const { addReview, isLoading } = useProductStore();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please log in to leave a review",
        icon: "warning",
      });
      return;
    }

    if (rating === 0) {
      Swal.fire({
        title: "Rating Required",
        text: "Please select a star rating",
        icon: "warning",
      });
      return;
    }

    try {
      const reviewData: ReviewFormData = {
        rating,
        comment: comment.trim(),
      };

      await addReview(productId, user.uid, user.displayName || "Anonymous", reviewData, user.photoURL || undefined);

      // Reset form
      setRating(0);
      setComment("");

      Swal.fire({
        title: "Review Submitted",
        text: "Thank you for your feedback!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to submit your review. Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

      {!user ? (
        <div className="text-center py-4">
          <p className="text-gray-600 mb-2">Please log in to leave a review</p>
          <button className="btn btn-primary btn-sm">Log In</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer text-2xl ${
                    star <= (hoveredRating || rating) ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                />
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {rating > 0 ? `${rating} out of 5 stars` : "Select a rating"}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review <span className="text-gray-400 text-sm font-normal">(Optional)</span>
            </label>
            <textarea
              id="comment"
              rows={5}
              className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Share your experience with this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className={`btn ${isLoading ? "btn-disabled loading" : "btn-primary"}`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;
