import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopHeader from "./TopHeader";
import BottomNav from "./BottomNav";
import style from "./Main.module.css";

const Main = () => {
  const location = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    // 라우트 변경 시 스크롤을 최상단으로 이동
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <div className='relative mx-auto min-h-screen w-full bg-white sm:max-w-full md:max-w-full lg:max-w-[500px] xl:max-w-[500px]'>
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
