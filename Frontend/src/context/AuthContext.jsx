// src/context/AuthContext.js
import { createContext, useEffect, useState } from "react";

const normalizeJwt = (jwt) => {
    if (typeof jwt !== "string") return null;
    const trimmed = jwt.trim();
    if (
        trimmed === "" ||
        trimmed === "undefined" ||
        trimmed === "null" ||
        trimmed.split(".").length !== 3
    ) {
        return null;
    }
    return trimmed;
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Load from localStorage on refresh
    useEffect(() => {
        const storedToken = normalizeJwt(localStorage.getItem("token"));
        const storedUser = localStorage.getItem("user");

        if (storedToken) {
            setToken(storedToken);
        } else if (localStorage.getItem("token")) {
            console.warn("Invalid stored token removed", localStorage.getItem("token"));
            localStorage.removeItem("token");
        }

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.warn("Invalid stored user removed", storedUser);
                localStorage.removeItem("user");
            }
        }
    }, []);

    // Login function
    const login = (userData, jwt) => {
        const normalized = normalizeJwt(jwt);
        if (!normalized) {
            console.error("Auth login attempted with invalid JWT", jwt, userData);
            return;
        }

        setUser(userData);
        setToken(normalized);
        localStorage.setItem("token", normalized);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
