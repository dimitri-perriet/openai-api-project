import React from "react";
import {Navigate, useLocation} from "react-router-dom";
import {isExpired} from "react-jwt";

function ProtectedRoutes({children}) {
  const pathname = useLocation();
  const user = sessionStorage.hasOwnProperty("token")

  if (user) {
    const token = JSON.parse(sessionStorage.getItem("token"));
    if (isExpired(token)) {
      sessionStorage.removeItem("token");
      return <Navigate to="/" state={{ from : pathname}} replace/>;
    }
  }

  const isAuth = user ? true : false;
  return isAuth ? children : <Navigate to="/" state={{ from : pathname}} replace/>;
}

export default ProtectedRoutes;