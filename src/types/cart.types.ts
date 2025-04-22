export type CartItem = {
  productID: string;
  name: string;
  price: number;
  imgUrl: string;
  quantity: number;
};

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productID: string) => void;
  updateQuantity: (productID: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
