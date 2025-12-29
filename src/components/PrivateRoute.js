import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, user, logout } = useAuth();
  const location = useLocation();

  if (!token || !user) {
    logout();

    return <Navigate to="/login" />;
  }

  if (
    !localStorage.getItem('khan-selected-workspace-id') &&
    location.pathname !== '/workspace/select'
  ) {
    return (
      <Navigate
        to="/workspace/select"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
};

export default PrivateRoute;
