import { useState } from "react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    passwordConfirm: "",
    email: "",
    emailCode: "",
    birthDate: "",
    phone: "010",
  });

  const [emailSent, setEmailSent] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateField = (field, value) => {
    const patterns = {
      id: /^[a-zA-Z0-9]{4,20}$/,
      password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      passwordConfirm: val => val === formData.password,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      emailCode: /^\d{6}$/,
      birthDate: /^\d{8}$/,
      phone: /^010\d{8}$/,
    };

    if (field === "passwordConfirm") {
      return patterns[field](value);
    }
    return patterns[field].test(value);
  };

  const sendEmailCode = () => {
    console.log("이메일 인증 코드 발송:", formData.email);
    setEmailSent(true);
  };

  const renderInput = (name, label, type = "text", placeholder = "정규식 설명") => {
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
            onFocus={
              name === "phone"
                ? () => setFormData(prev => ({ ...prev, phone: prev.phone || "010" }))
                : undefined
            }
          />
        </label>
        {name === "email" && (
          <button
            onClick={sendEmailCode}
            className='mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400'
            disabled={!validateField("email", formData.email) || emailSent}>
            {emailSent ? "인증 코드 발송됨" : "인증 코드 발송"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className='noScrollbar p-4'>
      {renderInput("id", "아이디")}
      {renderInput("password", "비밀번호", "password")}
      {renderInput("passwordConfirm", "비밀번호 재입력", "password")}
      {renderInput("email", "이메일", "email")}
      {renderInput("emailCode", "인증번호")}
      {renderInput("birthDate", "생년월일")}
      {renderInput("phone", "휴대폰 번호")}
      <button className='btn btn-success w-full text-white'>회원가입</button>
    </div>
  );
};

export default SignUp;
