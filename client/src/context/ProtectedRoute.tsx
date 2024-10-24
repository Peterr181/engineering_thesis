// context/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { usePersonalInfo } from "../hooks/usePersonalInfo";

interface ProtectedRouteProps {
  element: React.ReactNode;
  unprotected?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  unprotected,
}) => {
  const { hasPersonalData } = usePersonalInfo();
  const hasToken = localStorage.getItem("token");

  if (unprotected || hasPersonalData || hasToken) {
    return <>{element}</>;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
