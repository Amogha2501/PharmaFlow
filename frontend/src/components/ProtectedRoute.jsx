import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // If no token or user data, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" />;
  }
  
  // Parse user data
  const userData = JSON.parse(user);
  
  // If user role doesn't match required role, redirect to login
  if (userData.role !== requiredRole) {
    return <Navigate to="/login" />;
  }
  
  // If all checks pass, render the children
  return children;
};

export default ProtectedRoute;