"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  const logout = () => {
    signOut({ callbackUrl: "/" }); // 👈 يرجع المستخدم للصفحة الرئيسية
    setUser(null);
  };

  useEffect(() => {
    if (status === "authenticated") {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session, status]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: status === "loading",
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
