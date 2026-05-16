"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

const AuthContext = createContext({ user: null, loading: true, configured: true });

function normalize(supabaseUser) {
  return {
    uid: supabaseUser.id,
    email: supabaseUser.email,
    displayName:
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.user_name ||
      supabaseUser.email ||
      "User",
    photoURL: supabaseUser.user_metadata?.avatar_url || null,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? normalize(session.user) : null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? normalize(session.user) : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, configured: true }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
