import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className='main-container relative mx-auto min-h-screen w-full bg-white'>
      <div className='flex h-screen flex-col'>
        <main className='noScrollbar flex-grow overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Main;
