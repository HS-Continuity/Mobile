import { Outlet } from "react-router-dom";
import style from "./Main.module.css";

const Main = () => {
  return (
    <div className='relative mx-auto min-h-screen w-full bg-white sm:max-w-full md:max-w-full lg:max-w-[500px] xl:max-w-[500px]'>
      <div className='flex h-screen flex-col'>
        <main className={`${style.noScrollbar} flex-grow overflow-y-auto pb-16`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Main;
