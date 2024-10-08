import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuthStore from "../../stores/useAuthStore";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    roleType: "ROLE_MEMBER",
  });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [touched, setTouched] = useState({ username: false, password: false });

  const login = useAuthStore(state => state.login);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: data => {
      if (data) {
        toast.success("로그인 성공!");
        const { from } = location.state || { from: { pathname: "/" } };
        if (from.pathname === "/signup") {
          navigate("/");
        } else {
          navigate(from);
        }
      } else {
        toast.error("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    },
    onError: error => {
      console.error("Login error:", error);
      toast.error("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    },
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleBlur = e => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, loginData[name]);
  };

  const validateField = (fieldName, value) => {
    let errorMessage = "";
    if (value.trim() === "") {
      errorMessage = `${fieldName === "username" ? "아이디" : "비밀번호"}를 입력해주세요.`;
    }
    setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (loginData.username && loginData.password) {
      try {
        await loginMutation.mutateAsync(loginData);
      } catch (error) {
        // 오류는 mutation의 onError에서 처리
      }
    } else {
      toast.error("아이디와 비밀번호를 모두 입력해주세요.");
    }
  };

  const isFormValid = () => {
    return Object.keys(loginData).every(key => loginData[key]);
  };

  return (
    <div className='flex h-full flex-col bg-white p-4'>
      <div className='flex flex-grow flex-col justify-center'>
        <form onSubmit={handleSubmit} className='space-y-4 p-4'>
          <img src={logo} alt='logo' className='mx-auto -mb-2 w-14' />
          <p className='text-center text-4xl font-extrabold text-[#00835F]'>연이음</p>
          {/* 아이디 */}
          <div className='relative'>
            <input
              type='text'
              placeholder='아이디'
              name='username'
              value={loginData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete='username'
              className='input input-bordered h-14 w-full rounded-b-none focus:border-black focus:outline-none focus:ring-0'
            />

            {/* 비밀번호 */}
            <input
              type={showPassword ? "text" : "password"}
              placeholder='비밀번호'
              name='password'
              value={loginData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete='current-password'
              className='input input-bordered h-14 w-full rounded-t-none focus:border-black focus:outline-none focus:ring-0'
            />

            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute bottom-4 right-4 text-gray-400'>
              {showPassword ? <FaEyeSlash size={23} /> : <FaEye size={23} />}
            </button>
          </div>
          <div>
            {touched.username && errors.username && (
              <p className='text-xs text-red-500'>{errors.username}</p>
            )}
            {touched.password && errors.password && (
              <p className='text-xs text-red-500'>{errors.password}</p>
            )}
          </div>

          <button
            type='submit'
            className='btn w-full bg-green-shine text-white hover:bg-green-shine'
            disabled={loginMutation.isLoading || !isFormValid()}>
            {loginMutation.isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className='mt-2 flex justify-center space-x-4 text-sm text-[#00835F]'>
          <Link to='/signup'>회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
