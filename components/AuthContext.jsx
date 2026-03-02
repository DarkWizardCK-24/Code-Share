"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthChange } from "@/lib/auth";
import { isPlaceholder } from "@/lib/firebase";

const AuthContext = createContext({
  user: null,
  loading: true,
  configured: false,
});

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, configured: !isPlaceholder }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
