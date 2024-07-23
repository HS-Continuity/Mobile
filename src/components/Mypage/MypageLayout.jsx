import { Outlet, useLocation } from "react-router-dom";
import MypageHeader from "./MypageHeader";
import BottomNav from "../Layouts/BottomNav";
import { useEffect, useRef } from "react";

const MypageLayout = () => {
  const location = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <>
      <div className='main-container relative mx-auto min-h-screen w-full bg-white'>
        <div className='flex h-screen flex-col'>
          <MypageHeader />
          <main ref={mainRef} className='noScrollbar flex-grow overflow-y-auto p-2'>
            <Outlet />
          </main>
          <BottomNav />
        </div>
      </div>
    </>
  );
};

export default MypageLayout;
