import { Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./components/Layouts/Main";
import Home from "./pages/Home";
import Timesale from "./pages/Timesale";
import Mypage from "./pages/Mypage";
import Cart from "./pages/Cart";
import Search from "./pages/Search";
import { useEffect } from "react";

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
          <Route element={<Main />}>
            <Route path='/' element={<Home />} />
            <Route path='/timesale' element={<Timesale />} />
            <Route path='/mypage' element={<Mypage />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/search' element={<Search />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
