import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { GPTContext } from "../context/GPT.Context";

export default function ProtectedRoute({ children }) {
    const { user, token } = useContext(GPTContext);
    if (!user || !token) return <Navigate to="/auth" replace />;
    return children;
}
