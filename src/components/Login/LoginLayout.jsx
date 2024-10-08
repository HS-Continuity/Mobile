import { Outlet, useLocation } from "react-router-dom";
import LoginHeader from "./LoginHeader";
import { useEffect, useRef } from "react";

const LoginLayout = () => {
  const location = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <div className='main-container relative mx-auto min-h-screen w-full bg-white'>
      <div className='flex h-screen flex-col'>
        <LoginHeader />
        <main ref={mainRef} className='noScrollbar flex-grow overflow-y-auto p-4'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LoginLayout;
