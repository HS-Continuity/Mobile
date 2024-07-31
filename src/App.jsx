import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
import ProductLayout from "./components/Product/ProductLayout";
import ProtectedRoute from "./components/Login/ProtectedRoute";
import General from "./pages/general";
import Eco from "./pages/eco";
import OrderDetail from "./pages/orderManage/OrderDetail";
import SubscriptionOrderDetail from "./pages/subscriptionOrderManage/SubscriptionOrderDetail";
import TimeSaleDetail from "./pages/timeSale/timeSaleDetail";
import useAuthStore from "./stores/useAuthStore";
import { Toaster } from "react-hot-toast";

function App() {
  const location = useLocation();
  const { initializeAuth, setupInterceptors } = useAuthStore();

  useEffect(() => {
    setupInterceptors();
    initializeAuth();
  }, []);

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
      <div className='min-h-[calc(var(--vh,1vh)*100)] min-h-screen bg-gray-50'>
        <Routes>
          <Route element={<LoginLayout />}>
            <Route path='/login' element={<Login key={location.pathname} />} />
            <Route path='/signup' element={<SignUp key={location.pathname} />} />
          </Route>

          <Route element={<Main />}>
            <Route path='/' element={<Home key={location.pathname} />} />
            <Route path='/search' element={<Search key={location.pathname} />} />
            <Route path='/search-result' element={<SearchResult key={location.pathname} />} />
            <Route path='/general' element={<General key={location.pathname} />} />
            <Route path='/eco' element={<Eco key={location.pathname} />} />
            <Route path='/timesale' element={<Timesale key={location.pathname} />} />
            {/* <Route path='/detailcategory' element={<DetailCategory key={location.pathname} />} /> */}
            <Route path='/shop/:customerId' element={<Shop key={location.pathname} />} />
          </Route>

          <Route element={<ProductLayout />}>
            <Route path='/product/:productId' element={<ProductDetail key={location.pathname} />} />
            <Route
              path='/product/review/:productId'
              element={<ProductReviewAll key={location.pathname} />}
            />
            <Route
              path='/timesale/:timesaleId'
              element={<TimeSaleDetail key={location.pathname} />}
            />
          </Route>

          <Route element={<OrderLayout />}>
            <Route
              path='/cart'
              element={
                <ProtectedRoute>
                  <Cart key={location.pathname} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/order'
              element={
                <ProtectedRoute>
                  <Order key={location.pathname} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/subscription-setup'
              element={
                <ProtectedRoute>
                  <SubscriptionSetup key={location.pathname} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/subscription-order'
              element={
                <ProtectedRoute>
                  <SubscriptionOrder key={location.pathname} />
                </ProtectedRoute>
              }
            />
            <Route path='/order-success' element={<OrderSuccess key={location.pathname} />} />
            <Route path='/order-fail' element={<OrderFail key={location.pathname} />} />
          </Route>

          <Route element={<MypageLayout />}>
            <Route
              path='/mypage'
              element={
                <ProtectedRoute>
                  <Mypage key={location.pathname} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile key={location.pathname} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/coupon'
              element={
                <ProtectedRoute>
                  <Coupon key={location.pathname} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/address'
              element={
                <ProtectedRoute>
                  <Address key={location.pathname} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/order-history'
              element={
                <ProtectedRoute>
                  <OrderHistory key={location.pathname} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/order-history/:orderDetailId'
              element={
                <ProtectedRoute>
                  <OrderDetail key={location.pathname} />
                </ProtectedRoute>
              }
            />

            <Route
              path='/payment'
              element={
                <ProtectedRoute>
                  <Payment key={location.pathname} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reviewapply/:productId'
              element={
                <ProtectedRoute>
                  <ReviewApply key={location.pathname} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/refundapply'
              element={
                <ProtectedRoute>
                  <RefundApply key={location.pathname} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/subscription-history'
              element={
                <ProtectedRoute>
                  <SubscriptionOrderHistory key={location.pathname} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/subscription-history/:regularOrderId'
              element={
                <ProtectedRoute>
                  <SubscriptionOrderDetail key={location.pathname} />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 허용되지 않은 URL */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
        <Toaster position='bottom-center' />
      </div>
    </>
  );
}

export default App;
