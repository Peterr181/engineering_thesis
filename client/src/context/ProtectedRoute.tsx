// context/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { usePersonalInfo } from "../hooks/usePersonalInfo";

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { hasPersonalData } = usePersonalInfo();
  const hasToken = localStorage.getItem("token");

  if (hasPersonalData || hasToken) {
    return <>{element}</>;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
