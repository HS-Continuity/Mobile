import { Route, Routes } from "react-router-dom";
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

function App() {
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
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
          </Route>
          <Route element={<Main />}>
            <Route path='/' element={<Home />} />
            <Route path='/detailcategory' element={<DetailCategory />} />
            <Route path='/timesale' element={<Timesale />} />
            <Route path='/mypage' element={<Mypage />} />
            <Route path='/search' element={<Search />} />
          </Route>
          <Route element={<MobileMain />}>
            <Route path='/cart' element={<Cart />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
