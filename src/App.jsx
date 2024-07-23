import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Main from "./components/Layouts/Main";
import OrderLayout from "./components/Layouts/OrderLayout";
import Home from "./pages/home/";
import Timesale from "./pages/timeSale/";
import Mypage from "./pages/memberInfo/";
import Coupon from "./pages/coupon/";
import Address from "./pages/address/";
import OrderHistory from "./pages/orderManage/";
import Payment from "./pages/payment/";
import Profile from "./pages/memberInfo/Profile";
import Cart from "./pages/cart/";
import Search from "./pages/search/";
import SearchResult from "./pages/search/SearchResult";
import LoginLayout from "./components/Login/LoginLayout";
import Login from "./pages/login/";
import SignUp from "./pages/signup/";
import DetailCategory from "./pages/DetailCategory";
import ProductDetail from "./pages/product/";
import ProductReviewAll from "./pages/review/";
import Shop from "./pages/shop/";
import Order from "./pages/order/";
import SubscriptionOrder from "./pages/subscriptionOrder/SubscriptionOrder";
import SubscriptionSetup from "./pages/subscriptionOrder/SubscriptionSetup";
import MypageLayout from "./components/Mypage/MypageLayout";
import OrderSuccess from "./pages/order/OrderSuccess";
import OrderFail from "./pages/order/OrderFail";
import ReviewApply from "./pages/review/ReviewApply";
import RefundApply from "./pages/orderManage/RefundApply";
import SubscriptionOrderHistory from "./pages/subscriptionOrderManage/";
import SubscriptionOrderManage from "./pages/subscriptionOrderManage/SubscriptionOrderManage";
import ProductLayout from "./components/Product/ProductLayout";

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
            <Route path='/search' element={<Search key={location.pathname} />} />
            <Route path='/search-result' element={<SearchResult key={location.pathname} />} />
            <Route path='/timesale' element={<Timesale key={location.pathname} />} />

            {/* 식품 상세 카테고리 선택 시 */}
            <Route path='/detailcategory' element={<DetailCategory key={location.pathname} />} />

            {/* 판매자별 소개 페이지 */}
            <Route path='/shop/:customerId' element={<Shop key={location.pathname} />} />
          </Route>

          <Route element={<ProductLayout />}>
            {/* 식품 상세 페이지 */}
            <Route path='/product/:productId' element={<ProductDetail key={location.pathname} />} />
            {/* 식품별 리뷰 전체 조회 페이지 */}
            <Route
              path='/product/review/:productId'
              element={<ProductReviewAll key={location.pathname} />}
            />
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
            <Route path='/order-success' element={<OrderSuccess key={location.pathname} />} />
            <Route path='/order-fail' element={<OrderFail key={location.pathname} />} />
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
