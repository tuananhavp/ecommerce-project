import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";
import { collection, getDoc, doc, setDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { create } from "zustand";

import { auth, db } from "@/firebase/firebase";
import { AuthState, UserProfile } from "@/types/auth.types";

import { useCartStore } from "./cartStore";
import { useFavoriteStore } from "./favouriteStore";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            set({
              user: { ...userData, ...firebaseUser },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ user: firebaseUser, isAuthenticated: true, isLoading: false });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          set({ user: firebaseUser, isAuthenticated: true, isLoading: false });
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => unsubscribe();
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

        if (userDoc.exists()) {
          setTimeout(() => {
            useCartStore.getState().mergeLocalCartWithUserCart();
            useFavoriteStore.getState().mergeFavoritesWithUserFavorites();
          }, 500);
          const userData = userDoc.data() as UserProfile;
          set({
            user: { ...userData, ...userCredential.user },
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem("user", JSON.stringify({ ...userCredential.user, ...userData }));
        } else {
          set({ user: userCredential.user, isAuthenticated: true, isLoading: false });
        }
      } else {
        set({ error: "Email or password is wrong. Please try again", isLoading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  signup: async (username, email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userProfile: UserProfile = {
          username,
          email,
          password,
          role,
          createdAt: new Date(),
        };
        await setDoc(doc(db, "users", userCredential.user.uid), userProfile);

        set({
          user: { ...userProfile, ...userCredential.user },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ error: "Email already exists. Please try another email", isLoading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await signOut(auth);
      set({ user: null, isAuthenticated: false, isLoading: false });
      localStorage.removeItem("user");
      useFavoriteStore.setState({ favorites: [] });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Add a new method to set the primary address
  setPrimaryAddress: async (addressIndex: number) => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No authenticated user found");
      }

      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        primaryAddressIndex: addressIndex,
      });

      // Update the local state
      set((state) => ({
        user: state.user ? { ...state.user, primaryAddressIndex: addressIndex } : null,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error("Error setting primary address:", error);
      set({ error: (error as Error).message, isLoading: false });
      return false;
    }
  },

  updateProfile: async (userData, currentPassword = null) => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No authenticated user found");
      }

      const { username, email, password, phone, addresses, primaryAddressIndex } = userData;

      // Get the existing user data
      const userRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("User profile not found");
      }

      let updatedUserData: Partial<UserProfile> = {};

      // Update basic profile info in Firestore
      updatedUserData = {
        ...(username && { username }),
        ...(phone && { phone }),
        ...(addresses && { addresses }),
        // Include primaryAddressIndex if it's provided
        ...(typeof primaryAddressIndex !== "undefined" && { primaryAddressIndex }),
      };

      // Update email and password if provided (requires reauthentication)
      if ((email && email !== currentUser.email) || password) {
        // Reauthenticate the user if currentPassword is provided
        if (currentPassword) {
          const credential = EmailAuthProvider.credential(currentUser.email!, currentPassword);
          await reauthenticateWithCredential(currentUser, credential);

          // Update email if it's changed
          if (email && email !== currentUser.email) {
            await updateEmail(currentUser, email);
            updatedUserData.email = email;
          }

          // Update password if provided
          if (password) {
            await updatePassword(currentUser, password);
            updatedUserData.password = password;
          }
        } else {
          throw new Error("Current password is required to update email or password");
        }
      }

      // Update Firestore document
      if (Object.keys(updatedUserData).length > 0) {
        await updateDoc(userRef, updatedUserData);
      }

      // Refresh user data
      const updatedUserDoc = await getDoc(userRef);
      const updatedUserProfile = updatedUserDoc.data() as UserProfile;

      set({
        user: { ...updatedUserProfile, ...currentUser },
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      set({ error: (error as Error).message, isLoading: false });
      return false;
    }
  },
}));
