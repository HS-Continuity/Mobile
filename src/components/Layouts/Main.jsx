import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopHeader from "./TopHeader";
import BottomNav from "./BottomNav";

const Main = () => {
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
        {location.pathname == "/search" || location.pathname == "/search-result" ? (
          <></>
        ) : (
          <TopHeader />
        )}
        <main ref={mainRef} className='noScrollbar flex-grow overflow-y-auto pb-16'>
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default Main;
