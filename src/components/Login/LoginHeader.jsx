import { useLocation, useNavigate } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";

const LoginHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getHeaderText = () => {
    if (location.pathname === "/login") {
      return "로그인";
    } else if (location.pathname === "/signup") {
      return "회원가입";
    }
    return "";
  };

  return (
    <div className='flex items-center border-b-2 border-gray-100 p-4'>
      <MdArrowBackIosNew className='mr-auto cursor-pointer text-2xl' onClick={() => navigate(-1)} />
      <h1 className='mr-[24px] flex-grow text-center text-xl font-semibold'>{getHeaderText()}</h1>
    </div>
  );
};

export default LoginHeader;
