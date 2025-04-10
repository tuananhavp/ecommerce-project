import { User } from "firebase/auth";

export interface AuthState {
  user: User | UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, role: "customer" | "admin") => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
}

export interface UserProfile {
  username: string;
  email: string;
  role: "customer" | "admin";
}
