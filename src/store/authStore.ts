import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDoc, doc, setDoc, query, where, getDocs } from "firebase/firestore";
import { create } from "zustand";

import { auth, db } from "@/firebase/firebase";
import { AuthState } from "@/types/auth.types";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
        console.log(user);
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => unsubscribe();
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => doc.data());
    try {
      if (users.length > 0) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log(userCredential);

        const usersRef = doc(db, "users", email);
        const docSnap = await getDoc(usersRef);
        set({ user: userCredential.user, isAuthenticated: true, isLoading: false });
        localStorage.setItem("user", JSON.stringify(userCredential.user));
        console.log(userCredential.user, docSnap.data());
      } else {
        set({ error: "Email or password is wrong, Please try again", isLoading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  signup: async (username, email, password, role) => {
    set({ isLoading: true, error: null });
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => doc.data());
    try {
      if (users.length === 0) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log(userCredential);
        set({ user: userCredential.user, isAuthenticated: true, isLoading: false });
        const docRef = await setDoc(doc(db, "users", userCredential.user.uid), {
          username,
          email,
          password,
          role: role,
        });
        console.log("Document written with ID: ", docRef);
      } else {
        set({ error: "Email already exists, Please try other email", isLoading: false });
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
