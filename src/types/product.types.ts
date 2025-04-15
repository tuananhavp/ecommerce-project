export interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  oldPrice: number;
  newPrice: number;
  stockQuantity: number;
  category: string;
  trending: boolean;
  imgUrl: string[];
}

export interface ProductState {
  products: ProductCardProps[] | null;
  product: ProductCardProps | null;
  isLoading: boolean;
  error: string | null;
  getTrendingProduct: () => void;
  getAllProduct: () => void;
  getAProduct: (productId: string) => void;
}
