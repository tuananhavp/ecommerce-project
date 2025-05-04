import { User } from "firebase/auth";
import { FieldValue, Timestamp } from "firebase/firestore";

import { CartItem } from "./cart.types";
import { Address } from "./order.types";

export interface UserProfile {
  username: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  createdAt: Date;
  phone?: string;
  avatar?: string;
  addresses?: Address[];
  primaryAddressIndex?: number; // New field for primary address
  cart?: CartItem[];
}

export interface EnhancedUser extends User {
  uid: string;
  username?: string;
  role?: "customer" | "admin";
  addresses?: Address[];
  primaryAddressIndex?: number; // New field for primary address
  avatar?: string;
  phone?: string;
}

export interface AuthState {
  user: EnhancedUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, role: "customer" | "admin") => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
  updateProfile: (userData: Partial<UserProfile>, currentPassword?: string | null) => Promise<boolean>;
  setPrimaryAddress: (addressIndex: number) => Promise<boolean>; // New method
}

// Admin dashboard extensions
export type AdminUserData = {
  id?: string;
  uid: string;
  username: string;
  email: string;
  role: "customer" | "admin";
  createdAt: Date | Timestamp | FieldValue;
  lastLoginAt?: Date | Timestamp | FieldValue;
  updatedAt?: Date | Timestamp | FieldValue;
  phone?: string;
  avatar?: string;
  addresses?: Address[];
  primaryAddressIndex?: number; // New field for primary address
  notes?: string;
  totalOrders?: number;
  totalSpent?: number;
};
