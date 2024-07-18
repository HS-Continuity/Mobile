import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Main from "./components/Layouts/Main";
import OrderLayout from "./components/Layouts/OrderLayout";
import Home from "./pages/Home";
import Timesale from "./pages/Timesale";
import Mypage from "./pages/Mypage";
import Coupon from "./pages/Coupon";
import Address from "./pages/Address";
import OrderHistory from "./pages/OrderHistory";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Search from "./pages/Search";
import { useEffect } from "react";
import LoginLayout from "./components/Login/LoginLayout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import DetailCategory from "./pages/DetailCategory";
import ProductDetail from "./pages/ProductDetail";
import ProductReviewAll from "./pages/ProductReviewAll";
import Shop from "./pages/Shop";
import Order from "./pages/Order";
import SubscriptionOrder from "./pages/SubscriptionOrder";
import SubscriptionSetup from "./pages/SubscriptionSetup";
import MypageLayout from "./components/Mypage/MypageLayout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderFail from "./pages/OrderFail";
import ReviewApply from "./pages/ReviewApply";
import RefundApply from "./pages/RefundApply";
import SubscriptionOrderHistory from "./pages/SubscriptionOrderHistory";
import SubscriptionOrderManage from "./pages/SubscriptionOrderManage";

function App() {
  const location = useLocation();

  // 실제 모바일 화면 vh 맞추기
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  useEffect(() => {
    setScreenSize();

    const handleResize = () => {
      setScreenSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className='min-h-[calc(var(--vh,1vh)*100)] min-h-screen'>
        <Routes>
          <Route element={<LoginLayout />}>
            <Route path='/login' element={<Login key={location.pathname} />} />
            <Route path='/signup' element={<SignUp key={location.pathname} />} />
          </Route>

          <Route element={<Main />}>
            <Route path='/' element={<Home key={location.pathname} />} />
            <Route path='/timesale' element={<Timesale key={location.pathname} />} />
            <Route path='/search' element={<Search key={location.pathname} />} />

            {/* 식품 상세 카테고리 선택 시 */}
            <Route path='/detailcategory' element={<DetailCategory key={location.pathname} />} />
            {/* 식품 상세 페이지 */}
            <Route path='/product/:productId' element={<ProductDetail key={location.pathname} />} />
            {/* 식품별 리뷰 전체 조회 페이지 */}
            <Route
              path='/product/review/:productId'
              element={<ProductReviewAll key={location.pathname} />}
            />
            {/* 판매자별 소개 페이지 */}
            <Route path='/shop/:customerId' element={<Shop key={location.pathname} />} />
          </Route>

          <Route element={<OrderLayout />}>
            <Route path='/cart' element={<Cart key={location.pathname} />} />
            <Route path='/order' element={<Order key={location.pathname} />} />
            <Route
              path='/subscription-setup'
              element={<SubscriptionSetup key={location.pathname} />}
            />
            <Route
              path='/subscription-order'
              element={<SubscriptionOrder key={location.pathname} />}
            />
            <Route path='/order-success' element={<OrderSuccess />} />
            <Route path='/order-fail' element={<OrderFail />} />
          </Route>

          <Route element={<MypageLayout />}>
            <Route path='/mypage' element={<Mypage key={location.pathname} />} />
            <Route path='/profile' element={<Profile key={location.pathname} />} />
            <Route path='/coupon' element={<Coupon key={location.pathname} />} />
            <Route path='/address' element={<Address key={location.pathname} />} />
            <Route path='/order-history' element={<OrderHistory key={location.pathname} />} />
            <Route path='/payment' element={<Payment key={location.pathname} />} />
            <Route path='/reviewapply' element={<ReviewApply key={location.pathname} />} />
            <Route path='/refundapply' element={<RefundApply key={location.pathname} />} />
            <Route
              path='/subscription-history'
              element={<SubscriptionOrderHistory key={location.pathname} />}
            />
            <Route
              path='/subscription-manage'
              element={<SubscriptionOrderManage key={location.pathname} />}
            />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
