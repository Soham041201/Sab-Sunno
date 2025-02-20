import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import { ReactElement, Suspense } from 'react';
import CustomLoader from './Loader';

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = Cookies.get('user-token');
  const isAuthenticated = Cookies.get('isAuthenticated');

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  if (isAuthenticated === 'true') {
    return <Suspense fallback={<CustomLoader />}>{children}</Suspense>;
  }

  return <Navigate to='/authenticate' replace />;
};

export default ProtectedRoute;
