import React, { useEffect, useState } from "react";

import Image from "next/image";

import { Timestamp } from "firebase/firestore";
import { FaStar, FaRegStar, FaThumbsUp, FaFlag, FaUser } from "react-icons/fa";
import Swal from "sweetalert2";

import { useAuthStore } from "@/store/authStore";
import { useProductStore } from "@/store/productStore";
import { ProductReview } from "@/types/product.types";

interface ReviewListProps {
  productId: string;
  reviews: ProductReview[];
  refreshKey?: number;
}

interface RatingStatistics {
  average: number;
  total: number;
  distribution: number[];
}

const ReviewList = ({ productId, reviews = [], refreshKey = 0 }: ReviewListProps) => {
  console.log(reviews);
  const { markReviewHelpful, reportReview, isLoading } = useProductStore();
  const { user } = useAuthStore();
  const [statistics, setStatistics] = useState<RatingStatistics>({
    average: 0,
    total: 0,
    distribution: [0, 0, 0, 0, 0],
  });

  // Track helpful/reported actions to prevent multiple clicks
  const [actionedReviews, setActionedReviews] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (reviews.length > 0) {
      // Calculate review statistics
      const total = reviews.length;
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      const average = sum / total;

      // Calculate distribution
      const distribution = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
      reviews.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5) {
          distribution[5 - review.rating]++;
        }
      });

      setStatistics({
        average,
        total,
        distribution,
      });
    }
  }, [reviews]);

  const handleMarkHelpful = async (reviewId: string) => {
    if (!user) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please log in to mark reviews as helpful",
        icon: "warning",
      });
      return;
    }

    if (actionedReviews[user.uid]?.includes(reviewId)) {
      Swal.fire({
        title: "Already Marked",
        text: "You've already marked this review as helpful",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      await markReviewHelpful(productId, reviewId);

      setActionedReviews((prev) => ({
        ...prev,
        [user.uid]: [...(prev[user.uid] || []), reviewId],
      }));

      Swal.fire({
        toast: true,
        position: "bottom-end",
        text: "Marked as helpful!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to mark as helpful",
        icon: "error",
      });
    }
  };

  const handleReportReview = async (reviewId: string) => {
    if (!user) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please log in to report reviews",
        icon: "warning",
      });
      return;
    }

    if (actionedReviews[user.uid]?.includes(`report-${reviewId}`)) {
      Swal.fire({
        title: "Already Reported",
        text: "You've already reported this review",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    Swal.fire({
      title: "Report Review",
      text: "Are you sure you want to report this review as inappropriate?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Report",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await reportReview(productId, reviewId);

          setActionedReviews((prev) => ({
            ...prev,
            [user.uid]: [...(prev[user.uid] || []), `report-${reviewId}`],
          }));

          Swal.fire({
            toast: true,
            position: "bottom-end",
            text: "Review reported. Thank you for your feedback.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Failed to report review",
            icon: "error",
          });
        }
      }
    });
  };

  const formatDate = (timestamp: Timestamp | Date) => {
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString();
    }

    if (timestamp && "toDate" in timestamp && typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleDateString();
    }

    return "Unknown date";
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
          </span>
        ))}
      </div>
    );
  };

  const displayUserName = (review: ProductReview) => {
    return review.userName || "Anonymous";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div>
          {/* Rating Summary */}
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600">{statistics.average.toFixed(1)}</div>
                <div className="flex justify-center mt-2">{renderRatingStars(Math.round(statistics.average))}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {statistics.total} {statistics.total === 1 ? "Review" : "Reviews"}
                </div>
              </div>

              <div className="flex-1">
                {/* Rating Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star, index) => {
                    const count = statistics.distribution[5 - star];
                    const percentage = statistics.total > 0 ? (count / statistics.total) * 100 : 0;

                    return (
                      <div key={star} className="flex items-center gap-2">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-700 w-4">{star}</span>
                          <FaStar className="text-yellow-400 ml-1" />
                        </div>
                        <div className="flex-1 bg-gray-200 h-2 rounded-full">
                          <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div className="text-sm text-gray-500 w-12 text-right">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="divide-y">
            {reviews.map((review: ProductReview) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {review.userAvatar ? (
                      <Image
                        src={review.userAvatar}
                        alt={displayUserName(review)}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="bg-gray-200 rounded-full p-2">
                        <FaUser className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {/* Display user name */}
                      <h4 className="font-medium text-gray-900">{displayUserName(review)}</h4>
                      <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                    </div>

                    <div className="flex items-center mt-1">{renderRatingStars(review.rating)}</div>

                    <p className="mt-3 text-gray-700">
                      {review.comment ? review.comment : <em className="text-gray-400">No comment provided</em>}
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                      <button
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-purple-600 transition-colors"
                        onClick={() => handleMarkHelpful(review.id)}
                      >
                        <FaThumbsUp />
                        <span>Helpful ({review.helpful || 0})</span>
                      </button>

                      <button
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                        onClick={() => handleReportReview(review.id)}
                      >
                        <FaFlag />
                        <span>Report</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
