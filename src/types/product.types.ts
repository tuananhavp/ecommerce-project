import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment?: string;
  createdAt: Timestamp | Date;
  helpful: number;
  reported: boolean;
}

export interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  oldPrice: number;
  newPrice?: number | null | undefined;
  stockQuantity: number;
  category: string;
  trending: boolean;
  imgUrl: string[];
  createdAt?: Date;
  updatedAt?: Date;
  rating?: number;
  reviewsCount?: number;
  reviews?: ProductReview[]; 
}

export interface ProductFilters {
  priceRange: { min: number; max: number };
  category: string | null;
  trending: boolean;
  inStock: boolean;
  rating: number | null;
}

export interface ReviewFormData {
  rating: number;
  comment?: string;
}

export interface ProductState {
  products: ProductCardProps[] | null;
  product: ProductCardProps | null;
  isLoading: boolean;
  error: string | null;

  filters: ProductFilters;

  getTrendingProduct: () => Promise<void>;
  getAllProduct: () => Promise<void>;
  getAProduct: (productId: string) => Promise<void>;
  createProduct: (data: Omit<ProductCardProps, "id" | "createdAt">) => Promise<ProductCardProps>;
  deleteProduct: (productId: string) => Promise<boolean>;
  updateProduct: (productId: string, data: Partial<Omit<ProductCardProps, "id">>) => Promise<ProductCardProps>;

  // Filter actions
  setPriceRange: (min: number, max: number) => void;
  setCategory: (category: string | null) => void;
  toggleTrending: () => void;
  toggleInStock: () => void;
  setRating: (rating: number | null) => void;
  clearFilters: () => void;
  applyFilters: () => Promise<void>;

  // Review actions
  addReview: (
    productId: string,
    userId: string,
    userName: string,
    data: ReviewFormData,
    userAvatar?: string
  ) => Promise<ProductCardProps>;
  updateReview: (productId: string, reviewId: string, data: Partial<ReviewFormData>) => Promise<ProductCardProps>;
  deleteReview: (productId: string, reviewId: string) => Promise<ProductCardProps>;
  markReviewHelpful: (productId: string, reviewId: string) => Promise<ProductCardProps>;
  reportReview: (productId: string, reviewId: string) => Promise<ProductCardProps>;
}

export const productSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  description: z.string(),
  oldPrice: z
    .string()
    .transform((val) => (val ? parseFloat(val) : 0))
    .pipe(z.number()),
  newPrice: z
    .string()
    .transform((val) => (val ? parseFloat(val) : 0))
    .pipe(z.number()),
  stockQuantity: z
    .string()
    .transform((val) => (val ? parseInt(val) : 0))
    .pipe(z.number()),
  category: z.string().min(1, "Please select a category"),
  trending: z.boolean().optional().default(false),
});
