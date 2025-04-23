export type CartItem = {
  productID: string;
  name: string;
  price: number;
  imgUrl: string;
  quantity: number;
  cart?: CartItem[];
};

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productID: string) => Promise<void>;
  updateCartItemQuantity: (productID: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
}
