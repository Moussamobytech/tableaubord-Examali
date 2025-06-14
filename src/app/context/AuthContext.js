"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="))
      ?.split("=")[1];

    const tokenCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (tokenCookie && userCookie) {
      setAuthenticated(true);
      setUser(JSON.parse(decodeURIComponent(userCookie)));
    }
    setLoading(false);
  }, []);

  const login = async (formData) => {
    try {
      await loginAction(formData);
      setAuthenticated(true);
      const userCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user="))
        ?.split("=")[1];
      if (userCookie) {
        setUser(JSON.parse(decodeURIComponent(userCookie)));
      }
      return true;
    } catch (error) {
      throw new Error(error.message || "Erreur de connexion");
    }
  };

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    document.cookie = "user=; Max-Age=0; path=/";
    setAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}