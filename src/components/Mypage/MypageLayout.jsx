import { Outlet } from "react-router-dom";
import MypageHeader from "./MypageHeader";
import BottomNav from "../Layouts/BottomNav";

const MypageLayout = () => {
  return (
    <>
      <div className='main-container relative mx-auto min-h-screen w-full bg-white'>
        <div className='flex h-screen flex-col'>
          <MypageHeader />
          <main className='noScrollbar flex-grow overflow-y-auto p-4'>
            <Outlet />
          </main>
          <BottomNav />
        </div>
      </div>
    </>
  );
};

export default MypageLayout;
