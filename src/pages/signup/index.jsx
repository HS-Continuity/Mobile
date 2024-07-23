import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    memberName: "",
    memberEmail: "",
    memberPassword: "",
    passwordConfirm: "",
    memberBirthday: "",
    memberPhoneNumber: "",
    gender: "M",
  });

  const [emailSent, setEmailSent] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateField = (field, value) => {
    const patterns = {
      memberName: /^[a-zA-Z가-힣]{2,20}$/,
      memberPassword: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      passwordConfirm: val => val === formData.memberPassword,
      memberEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      memberBirthday: /^\d{8}$/,
      memberPhoneNumber: /^010\d{8}$/,
    };

    if (field === "passwordConfirm") {
      return patterns[field](value);
    }
    return patterns[field].test(value);
  };

  const sendEmailCode = () => {
    console.log("이메일 인증 코드 발송:", formData.memberEmail);
    setEmailSent(true);
    // 이메일 인증 로직 구현
  };

  const registerMutation = useMutation({
    mutationFn: data => axios.post("/api/members/register", data),
    onSuccess: () => {
      alert("회원가입이 완료되었습니다.");
      // 회원가입 성공 후 처리 (예: 로그인 페이지로 이동)
    },
    onError: error => {
      alert(
        "회원가입에 실패했습니다: " + error.response?.data?.message ||
          "알 수 없는 오류가 발생했습니다."
      );
    },
  });

  const handleSubmit = e => {
    e.preventDefault();
    if (formData.memberPassword !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    // 생년월일 형식 변환 (YYYYMMDD to ISO Date)
    const formattedBirthday = `${formData.memberBirthday.slice(0, 4)}-${formData.memberBirthday.slice(4, 6)}-${formData.memberBirthday.slice(6, 8)}`;

    const registerData = {
      ...formData,
      memberBirthday: formattedBirthday,
    };
    delete registerData.passwordConfirm;

    registerMutation.mutate(registerData);
  };

  const renderInput = (name, label, type = "text", placeholder = "") => {
    return (
      <div key={name} className='mb-4'>
        <label className='input input-bordered flex items-center gap-2'>
          {label}
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className='grow'
            placeholder={placeholder}
          />
        </label>
        {name === "memberEmail" && (
          <button
            onClick={sendEmailCode}
            className='mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400'
            disabled={!validateField("memberEmail", formData.memberEmail) || emailSent}>
            {emailSent ? "인증 코드 발송됨" : "인증 코드 발송"}
          </button>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className='noScrollbar p-4'>
      {renderInput("memberName", "이름")}
      {renderInput("memberPassword", "비밀번호", "password")}
      {renderInput("passwordConfirm", "비밀번호 재입력", "password")}
      {renderInput("memberEmail", "이메일", "email")}
      {renderInput("memberBirthday", "생년월일", "text", "YYYYMMDD")}
      {renderInput("memberPhoneNumber", "휴대폰 번호")}
      <div className='mb-4'>
        <label className='input input-bordered flex items-center gap-2'>
          성별
          <select name='gender' value={formData.gender} onChange={handleChange} className='grow'>
            <option value='MALE'>남성</option>
            <option value='FEMALE'>여성</option>
          </select>
        </label>
      </div>
      <button
        type='submit'
        className='btn btn-success w-full text-white'
        disabled={registerMutation.isPending}>
        {registerMutation.isPending ? "처리 중..." : "회원가입"}
      </button>
    </form>
  );
};

export default SignUp;
