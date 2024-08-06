import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import Logo from "../../assets/images/logo.png";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      await initializeAuth();
      setIsLoading(false);
    };
    checkAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <div className='flex h-screen w-screen items-center justify-center'>
        <img src={Logo} alt='logo' className='h-8 w-14' />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
