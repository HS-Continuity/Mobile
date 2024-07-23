import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ProductTopHeader from "./ProductTopHeader";

const ProductLayout = () => {
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
        <ProductTopHeader />
        <main ref={mainRef} className='noScrollbar flex-grow overflow-y-auto pb-16'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProductLayout;
