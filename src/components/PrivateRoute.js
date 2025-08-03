import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { token, user, logout } = useAuth();

  if (!token || !user) {
    logout();

    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
