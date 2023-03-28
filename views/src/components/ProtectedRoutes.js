import React from "react";
import {Navigate, useLocation} from "react-router-dom";

function ProtectedRoutes({children}) {
  const pathname = useLocation();
  const user = sessionStorage.hasOwnProperty("user")

  const isAuth = user ? true : false;
  return isAuth ? children : <Navigate to="/" state={{ from : pathname}} replace/>;
}

export default ProtectedRoutes;