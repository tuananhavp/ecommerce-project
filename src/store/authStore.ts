// useAuthStore.ts
import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, getDoc, doc, setDoc, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { AuthState } from "@/types/auth.types";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        set({ user, isAuthenticated: true, loading: false });
        console.log(user);
      } else {
        set({ user: null, isAuthenticated: false, loading: false });
      }
    });

    return () => unsubscribe();
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
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
        set({ user: userCredential.user, isAuthenticated: true, loading: false });
        localStorage.setItem("user", JSON.stringify(userCredential.user));
        console.log(userCredential.user, docSnap.data());
      } else {
        set({ error: "Email or password is wrong, Please try again", loading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  signup: async (username, email, password, role) => {
    set({ loading: true, error: null });
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => doc.data());
    try {
      if (users.length === 0) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log(userCredential);
        set({ user: userCredential.user, isAuthenticated: true, loading: false });
        const docRef = await setDoc(doc(db, "users", userCredential.user.uid), {
          username,
          email,
          password,
          role: role,
        });
        console.log("Document written with ID: ", docRef);
      } else {
        set({ error: "Email already exists, Please try other email", loading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await signOut(auth);
      set({ user: null, isAuthenticated: false, loading: false });
      localStorage.removeItem("user");
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
