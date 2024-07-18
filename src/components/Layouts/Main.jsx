import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopHeader from "./TopHeader";
import BottomNav from "./BottomNav";
import style from "./Main.module.css";

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
        <TopHeader />
        <main ref={mainRef} className={`${style.noScrollbar} flex-grow overflow-y-auto p-4 pb-16`}>
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default Main;
