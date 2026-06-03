import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./config"
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


// Change this to your own email
const ADMIN_EMAIL = "youradmin@gmail.com";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin]         = useState(false);
  const [loading, setLoading]         = useState(true); // wait for firebase to check auth

  useEffect(() => {
    // Firebase listener — fires whenever auth state changes (login, logout, refresh)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // Check if this user is admin by email
        setIsAdmin(user.email === ADMIN_EMAIL);

        // Save user to Firestore on first login (only if not already saved)
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          const { setDoc } = await import("firebase/firestore");
          await setDoc(userRef, {
            uid:       user.uid,
            name:      user.displayName || "",
            email:     user.email,
            role:      user.email === ADMIN_EMAIL ? "admin" : "user",
            createdAt: new Date(),
          });
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup on unmount
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, loading, logout }}>
      {/* Don't render anything until Firebase has checked auth state */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this anywhere to get auth state
export function useAuth() {
  return useContext(AuthContext);
}
