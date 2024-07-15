import { Outlet, useLocation } from "react-router-dom";
import LoginHeader from "./LoginHeader";
import { useEffect, useRef } from "react";

const LoginLayout = () => {
  const location = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    // 라우트 변경 시 스크롤을 최상단으로 이동
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <div className='main-container relative mx-auto min-h-screen w-full bg-white'>
      <div className='flex h-screen flex-col'>
        <LoginHeader />
        <main className='noScrollbar flex-grow overflow-y-auto p-4'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LoginLayout;
