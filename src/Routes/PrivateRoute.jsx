import React from "react";
import { Route, Navigate } from "react-router-dom";
import useAuth from "../Hooks/UseAuth";

const PrivateRoute = ({ path, element }) => {
  const { isLoggedIn } = useAuth();
  const isAuthenticated = isLoggedIn();

  return isAuthenticated ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to={"/"} />
  );
};

export default PrivateRoute;
