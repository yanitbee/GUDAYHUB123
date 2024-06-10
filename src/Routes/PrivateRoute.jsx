import React from "react";
import { Route, Navigate } from "react-router-dom";
import useAuth from "../Hooks/UseAuth";

const PrivateRoute = ({ element: Component }) => {
  const { isLoggedIn } = useAuth();
  const isAuthenticated = isLoggedIn();

  return isAuthenticated ? Component : <Navigate to="/" />;
};

export default PrivateRoute;
