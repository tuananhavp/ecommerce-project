// import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "firebase/firestore";
// import { create } from "zustand";

// import { db } from "@/firebase/firebase";
// import { FavouriteState } from "@/types/cart.types";

// import { useAuthStore } from "./authStore";

// export const useFavouriteStore = create<FavouriteState>((set, get) => ({
//   items: [],
//   isLoading: false,
//   error: null,

//   syncFavouritesWithUser: async (uid: string | null) => {
//     set({ isLoading: true, error: null });

//     try {
//       if (uid) {
//         // User is logged in, fetch favourites from Firestore
//         const userDoc = await getDoc(doc(db, "favourites", uid));

//         if (userDoc.exists()) {
//           // Favourites exist in database
//           const favouritesData = userDoc.data();
//           set({
//             items: favouritesData.items || [],
//             isLoading: false,
//           });
//         } else {
//           // New user, initialize empty favourites in Firestore
//           await updateDoc(doc(db, "favourites", uid), {
//             items: [],
//             updatedAt: serverTimestamp(),
//           });

//           set({
//             items: [],
//             isLoading: false,
//           });
//         }
//       } else {
//         // User logged out, clear favourites
//         set({
//           items: [],
//           isLoading: false,
//         });
//       }
//     } catch (error) {
//       set({
//         error: (error as Error).message,
//         isLoading: false,
//       });
//     }
//   },

//   addItem: async (productID) => {
//     set({ isLoading: true, error: null });

//     try {
//       const { items } = get();
//       const { user } = useAuthStore.getState();

//       // Check if item already exists in favourites
//       if (items.includes(productID)) {
//         set({ isLoading: false });
//         return;
//       }

//       // Add to local state
//       set({
//         items: [...items, productID],
//         isLoading: false,
//       });

//       // If user is logged in, update Firestore
//       if (user) {
//         const favouritesRef = doc(db, "favourites", user.uid);
//         await updateDoc(favouritesRef, {
//           items: arrayUnion(productID),
//           updatedAt: serverTimestamp(),
//         });
//       }
//     } catch (error) {
//       set({
//         error: (error as Error).message,
//         isLoading: false,
//       });
//     }
//   },

//   removeItem: async (productID) => {
//     set({ isLoading: true, error: null });

//     try {
//       const { items } = get();
//       const { user } = useAuthStore.getState();

//       // Remove from local state
//       set({
//         items: items.filter((id) => id !== productID),
//         isLoading: false,
//       });

//       // If user is logged in, update Firestore
//       if (user) {
//         const favouritesRef = doc(db, "favourites", user.uid);
//         await updateDoc(favouritesRef, {
//           items: arrayRemove(productID),
//           updatedAt: serverTimestamp(),
//         });
//       }
//     } catch (error) {
//       set({
//         error: (error as Error).message,
//         isLoading: false,
//       });
//     }
//   },

//   clearFavourites: async () => {
//     set({ isLoading: true, error: null });

//     try {
//       const { user } = useAuthStore.getState();

//       // Update local state
//       set({
//         items: [],
//         isLoading: false,
//       });

//       // If user is logged in, update Firestore
//       if (user) {
//         const favouritesRef = doc(db, "favourites", user.uid);
//         await updateDoc(favouritesRef, {
//           items: [],
//           updatedAt: serverTimestamp(),
//         });
//       }
//     } catch (error) {
//       set({
//         error: (error as Error).message,
//         isLoading: false,
//       });
//     }
//   },
// }));
