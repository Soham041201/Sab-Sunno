import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import { ReactElement, Suspense } from 'react';
import CustomLoader from './Loader';

interface HomeRouteProps {
  children: ReactElement;
}

const HomeRoute = ({ children }: HomeRouteProps) => {
  const token = Cookies.get('user-token');
  const isAuthenticated = Cookies.get('isAuthenticated');

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  if (isAuthenticated === 'false') {
    return <Suspense fallback={<CustomLoader />}>{children}</Suspense>;
  }

  return <Navigate to='/home' replace />;
};

export default HomeRoute;
