import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Main from "./components/Layouts/Main";
import MobileMain from "./components/Layouts/MobileMain";
import Home from "./pages/Home";
import Timesale from "./pages/Timesale";
import Mypage from "./pages/Mypage";
import Cart from "./pages/Cart";
import Search from "./pages/Search";
import { useEffect } from "react";
import MainLogin from "./components/Login/MainLogin";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import DetailCategory from "./pages/DetailCategory";
import ProductDetail from "./pages/ProductDetail";
import ProductReviewAll from "./pages/ProductReviewAll";

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
          <Route element={<MainLogin />}>
            <Route path='/login' element={<Login key={location.pathname} />} />
            <Route path='/signup' element={<SignUp key={location.pathname} />} />
          </Route>
          <Route element={<Main />}>
            <Route path='/' element={<Home key={location.pathname} />} />
            <Route path='/timesale' element={<Timesale key={location.pathname} />} />
            <Route path='/mypage' element={<Mypage key={location.pathname} />} />
            <Route path='/search' element={<Search key={location.pathname} />} />
            <Route path='/detailcategory' element={<DetailCategory key={location.pathname} />} />
            <Route path='/product/:productId' element={<ProductDetail key={location.pathname} />} />
            <Route
              path='/product/review/:productId'
              element={<ProductReviewAll key={location.pathname} />}
            />
          </Route>
          <Route element={<MobileMain />}>
            <Route path='/cart' element={<Cart key={location.pathname} />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
