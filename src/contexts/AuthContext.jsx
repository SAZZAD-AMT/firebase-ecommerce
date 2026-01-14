// src/contexts/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setUser: setCurrentUser,
        isAdmin: currentUser?.role === "admin",
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
