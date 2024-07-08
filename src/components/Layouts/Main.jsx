import TopHeader from "./TopHeader";
import BottomNav from "./BottomNav";
import { Outlet } from "react-router-dom";
import style from "./Main.module.css";

const Main = () => {
  return (
    <div className='relative mx-auto min-h-screen w-full bg-white sm:max-w-full md:max-w-full lg:max-w-[500px] xl:max-w-[500px]'>
      <div className='flex h-screen flex-col'>
        <TopHeader />
        <main className={`${style.noScrollbar} flex-grow overflow-y-auto p-4 pb-16`}>
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default Main;
