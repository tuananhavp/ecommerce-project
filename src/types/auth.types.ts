import { User } from "firebase/auth";

import { CartItem } from "./cart.types";

export interface UserProfile {
  username: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  createdAt: Date;
  cart?: CartItem[];
}

// This extends the basic User type to include your UserProfile properties
export type EnhancedUser = (User | UserProfile) & { uid?: string };

export interface AuthState {
  user: EnhancedUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, role: "customer" | "admin") => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
}
