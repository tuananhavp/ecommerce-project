import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { create } from "zustand";

import { db } from "@/firebase/firebase";
import { AdminUserData } from "@/types/auth.types";

// Pagination and filtering interfaces
interface UserFilters {
  role?: "customer" | "admin";
  search?: string;
}

interface UserPagination {
  pageSize: number;
  lastVisible: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

interface UserStore {
  users: AdminUserData[];
  currentUser: AdminUserData | null;
  isLoading: boolean;
  error: string | null;
  filters: UserFilters;
  pagination: UserPagination;

  fetchUsers: (reset?: boolean) => Promise<AdminUserData[]>;
  fetchMoreUsers: () => Promise<void>;
  getUserById: (userId: string) => Promise<AdminUserData | null>;
  searchUsers: (searchTerm: string) => Promise<void>;

  setFilters: (filters: UserFilters) => void;
  resetFilters: () => void;

  updateUserRole: (userId: string, role: "customer" | "admin") => Promise<boolean>;
  updateUserDetails: (userId: string, data: Partial<AdminUserData>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  // Initial state
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    pageSize: 10,
    lastVisible: null,
    hasMore: true,
  },

  // Fetch users with filtering and pagination
  fetchUsers: async (reset = true): Promise<AdminUserData[]> => {
    try {
      set({ isLoading: true, error: null });

      const { filters, pagination } = get();

      if (reset) {
        set({
          pagination: {
            ...pagination,
            lastVisible: null,
            hasMore: true,
          },
        });
      }

      const userQuery = collection(db, "users");
      const constraints = [];

      // Add role filter if specified
      if (filters.role) {
        constraints.push(where("role", "==", filters.role));
      }

      // Add ordering and pagination
      constraints.push(orderBy("createdAt", "desc"));
      constraints.push(limit(pagination.pageSize));

      // Add startAfter if not first page
      if (!reset && pagination.lastVisible) {
        constraints.push(startAfter(pagination.lastVisible));
      }

      const q = query(userQuery, ...constraints);
      const querySnapshot = await getDocs(q);

      let fetchedUsers = [];
      for (const doc of querySnapshot.docs) {
        const userData = doc.data() as AdminUserData;
        fetchedUsers.push({
          ...userData,
          id: doc.id,
        });
      }

      // Handle search if provided
      if (filters.search && filters.search.trim() !== "") {
        const searchTerm = filters.search.toLowerCase().trim();
        fetchedUsers = fetchedUsers.filter(
          (user) => user.username?.toLowerCase().includes(searchTerm) || user.email?.toLowerCase().includes(searchTerm)
        );
      }

      // Update the state
      if (reset) {
        set({
          users: fetchedUsers,
          pagination: {
            ...pagination,
            lastVisible: querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,
            hasMore: querySnapshot.docs.length >= pagination.pageSize,
          },
          isLoading: false,
        });
      } else {
        set({
          users: [...get().users, ...fetchedUsers],
          pagination: {
            ...pagination,
            lastVisible:
              querySnapshot.docs.length > 0
                ? querySnapshot.docs[querySnapshot.docs.length - 1]
                : pagination.lastVisible,
            hasMore: querySnapshot.docs.length >= pagination.pageSize,
          },
          isLoading: false,
        });
      }

      // Return the current state's users array
      return get().users;
    } catch (error) {
      console.error("Error fetching users:", error);
      set({
        error: "Failed to fetch users",
        isLoading: false,
      });
      return [];
    }
  },

  // Fetch next page of users
  fetchMoreUsers: async () => {
    const { pagination, isLoading } = get();

    if (!isLoading && pagination.hasMore) {
      await get().fetchUsers(false);
    }
  },

  getUserById: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        set({
          currentUser: null,
          error: "User not found",
          isLoading: false,
        });
        return null;
      }

      const userData = userDoc.data() as AdminUserData;
      const user = { ...userData, id: userDoc.id };

      set({
        currentUser: user,
        isLoading: false,
      });

      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      set({
        error: "Failed to fetch user details",
        isLoading: false,
      });
      return null;
    }
  },

  searchUsers: async (searchTerm: string) => {
    set({
      filters: {
        ...get().filters,
        search: searchTerm,
      },
    });

    await get().fetchUsers();
  },

  setFilters: (filters: UserFilters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchUsers();
  },

  resetFilters: () => {
    set({ filters: {} });
    get().fetchUsers();
  },

  updateUserRole: async (userId: string, role: "customer" | "admin") => {
    try {
      set({ isLoading: true, error: null });

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        role,
        updatedAt: serverTimestamp(),
      });

      const users = get().users.map((user) => {
        if (user.id === userId) {
          return { ...user, role, updatedAt: Timestamp.now() };
        }
        return user;
      });

      let currentUser = get().currentUser;
      if (currentUser && currentUser.id === userId) {
        currentUser = { ...currentUser, role, updatedAt: Timestamp.now() };
      }

      set({ users, currentUser, isLoading: false });
      return true;
    } catch (error) {
      console.error("Error updating user role:", error);
      set({
        error: "Failed to update user role",
        isLoading: false,
      });
      return false;
    }
  },

  updateUserDetails: async (userId: string, data: Partial<AdminUserData>) => {
    try {
      set({ isLoading: true, error: null });

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });

      const users = get().users.map((user) => {
        if (user.id === userId) {
          return { ...user, ...data, updatedAt: Timestamp.now() };
        }
        return user;
      });

      let currentUser = get().currentUser;
      if (currentUser && currentUser.id === userId) {
        currentUser = { ...currentUser, ...data, updatedAt: Timestamp.now() };
      }

      set({ users, currentUser, isLoading: false });
      return true;
    } catch (error) {
      console.error("Error updating user details:", error);
      set({
        error: "Failed to update user details",
        isLoading: false,
      });
      return false;
    }
  },

  deleteUser: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);

      // Update local state
      const users = get().users.filter((user) => user.id !== userId);

      // Reset currentUser if it was the deleted user
      let currentUser = get().currentUser;
      if (currentUser && currentUser.id === userId) {
        currentUser = null;
      }

      set({ users, currentUser, isLoading: false });
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      set({
        error: "Failed to delete user",
        isLoading: false,
      });
      return false;
    }
  },
}));
