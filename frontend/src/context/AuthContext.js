import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    // token expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUserFromToken);

  const isAuthenticated = !!user;

  function login(token) {
    localStorage.setItem("token", token);
    setUser(jwtDecode(token));
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
