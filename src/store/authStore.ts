import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDoc, doc, setDoc, query, where, getDocs } from "firebase/firestore";
import { create } from "zustand";

import { auth, db } from "@/firebase/firebase";
import { AuthState, UserProfile } from "@/types/auth.types";

import { useCartStore } from "./cartStore";

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
              user: { ...userData, uid: firebaseUser.uid },
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
          }, 500);
          const userData = userDoc.data() as UserProfile;
          set({
            user: { ...userData, uid: userCredential.user.uid },
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ user: userCredential.user, isAuthenticated: true, isLoading: false });
        }

        localStorage.setItem("user", JSON.stringify(userCredential.user));
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
          user: { ...userProfile, uid: userCredential.user.uid },
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
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
