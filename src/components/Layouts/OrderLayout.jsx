import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import OrderHeader from "../Order/OrderHeader";

const OrderLayout = () => {
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
        <OrderHeader />
        <main ref={mainRef} className='noScrollbar flex-grow overflow-y-auto bg-gray-100'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrderLayout;
