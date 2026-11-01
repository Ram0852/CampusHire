
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => Boolean(localStorage.getItem("token"))
    );

    const [isAdmin,setIsAdmin]= useState(
        () => localStorage.getItem("role") === "admin"
    );

    function login(token,role) {
        localStorage.setItem("token", token);
        localStorage.setItem("role",role);

        setIsLoggedIn(true);
        setIsAdmin(role==="admin");
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    
        setIsLoggedIn(false);
        setIsAdmin(false);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn,isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
