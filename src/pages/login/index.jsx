import React from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import kakaoLogo from "../../assets/images/kakao_icon.png";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const socialLogins = [
    { name: "kakao", icon: kakaoLogo },
    // { name: 'facebook', icon: facebookLogo },
    // { name: 'apple', icon: appleLogo },
    // { name: 'naver', icon: naverLogo },
  ];

  return (
    <div className='flex h-full flex-col bg-white p-4'>
      <div className='flex flex-grow flex-col justify-center'>
        <div className='space-y-4 p-4'>
          <div className='relative'>
            <input
              type='text'
              placeholder='아이디'
              className='input input-bordered h-14 w-full rounded-b-none focus:border-black focus:outline-none focus:ring-0'
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder='비밀번호'
              className='input input-bordered h-14 w-full rounded-t-none focus:border-black focus:outline-none focus:ring-0'
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className='absolute bottom-4 right-4 text-gray-400'>
              {showPassword ? <FaEyeSlash size={23} /> : <FaEye size={23} />}
            </button>
          </div>

          <div className='flex items-center'>
            <input type='checkbox' className='checkbox-success checkbox checkbox-sm mr-2' />
            <span className='text-sm text-gray-600'>로그인 상태 유지</span>
          </div>

          <button className='btn btn-success w-full text-white'>로그인</button>
        </div>

        <div className='mt-4 flex justify-center space-x-4 text-sm text-gray-500'>
          <Link to='/find-id'>아이디 찾기</Link>
          <span>|</span>
          <Link to='/reset-password'>비밀번호 재설정</Link>
          <span>|</span>
          <Link to='/signup'>회원가입</Link>
        </div>

        {/* 간편 로그인 */}
        <div className='mt-8 p-4'>
          <h2 className='mb-4 text-center text-gray-500'>간편 로그인</h2>
          <div className='flex justify-center space-x-4'>
            {socialLogins.map(social => (
              <button key={social.name} className='h-12 w-12 overflow-hidden rounded-full'>
                <img
                  src={social.icon}
                  alt={`${social.name} login`}
                  className='h-full w-full object-cover'
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
