import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, role, redirectPath }) => {
  const userState = JSON.parse(localStorage.getItem('userState'));
  const location = useLocation();

  // Check if the user is logged in and has the correct role
  if (!isLoggedIn || !userState || userState.role !== role) {
    return <Navigate to={redirectPath} replace={false} />; // Redirect to login if not authenticated
  }

  // If authenticated, redirect to the same path
  if (location.pathname === redirectPath) {
    return <Navigate to={location.pathname} replace={true} />;
  }

  return <Outlet />; // Render the child routes if authenticated
};

export default ProtectedRoute;