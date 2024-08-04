import { Outlet } from "react-router-dom";
import LoginHeader from "./LoginHeader";

const MainLogin = () => {
  return (
    <div className='relative mx-auto min-h-screen w-full bg-white sm:max-w-full md:max-w-full lg:max-w-[500px] xl:max-w-[500px]'>
      <div className='flex h-screen flex-col'>
        <LoginHeader />
        <main className='noScrollbar flex-grow overflow-y-auto p-4'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLogin;
