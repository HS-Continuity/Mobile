import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LuCake, LuLock, LuUser2 } from "react-icons/lu";
import { SlEnvolope } from "react-icons/sl";
import { PiGenderNeuterLight } from "react-icons/pi";
import { MdSmartphone } from "react-icons/md";
import { fetchMessageVerify, postMember, postMessage } from "../../apis";

const SignUp = () => {
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    memberId: "",
    memberName: "",
    memberEmail: "",
    memberPassword: "",
    memberBirthday: "",
    memberPhoneNumber: "",
    gender: "",
    verificationCode: "",
  });

  const [errors, setErrors] = useState({
    memberId: "",
    memberName: "",
    memberEmail: "",
    memberPassword: "",
    memberBirthday: "",
    memberPhoneNumber: "",
    gender: "",
  });

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(150);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [reAuthCooldown, setReAuthCooldown] = useState(0);

  const handleChange = e => {
    const { name, value, type } = e.target;
    if (name === "memberPhoneNumber") {
      const formattedNumber = formatPhoneNumber(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedNumber,
      }));
      const validationResult = validateField(name, formattedNumber);
      setErrors(prev => ({ ...prev, [name]: validationResult.error }));
      setIsPhoneValid(validationResult.isValid);
    } else if (name === "memberId") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "radio" ? value : value,
      }));
      const validationResult = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: validationResult.error }));
    }
  };

  const formatPhoneNumber = value => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength <= 3) return phoneNumber;
    if (phoneNumberLength <= 7) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  const validateField = (field, value) => {
    const patterns = {
      memberId: {
        regex: /^[a-zA-Z0-9]{4,20}$/,
        message: "아이디 - 4~20자의 영문 대소문자와 숫자만 사용 가능합니다.",
      },
      memberName: {
        regex: /^[가-힣]{2,10}$/,
        message: "이름 - 2~10자의 한글만 사용 가능합니다.",
      },
      memberPassword: {
        regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        message: "비밀번호 - 8자 이상의 영문자와 숫자 조합이어야 합니다.",
      },
      memberEmail: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "이메일 - 올바른 이메일 형식이 아닙니다.",
      },
      memberBirthday: { regex: /^\d{8}$/, message: "8자리 숫자로 입력해주세요." },
      memberPhoneNumber: {
        regex: /^010-\d{4}-\d{4}$/,
        message: "전화번호 - 올바른 전화번호 형식이 아닙니다.",
      },
      gender: { regex: /^(MALE|FEMALE)$/, message: "성별 - 성별을 선택해주세요." },
    };

    const pattern = patterns[field];
    if (!pattern) return { isValid: true, error: "" };

    const isValid = pattern.regex.test(value);
    return { isValid, error: isValid ? "" : pattern.message };
  };

  const isFormValid = () => {
    return (
      Object.keys(formData).every(key => formData[key] && !errors[key] && isChecked) && isVerified
    );
  };

  const resetVerificationState = () => {
    setIsCodeSent(false);
    setTimeLeft(150);
    setVerificationFailed(false);
    setFormData(prev => ({ ...prev, verificationCode: "" }));
  };

  const sendVerificationCodeMutation = useMutation({
    mutationFn: postMessage,
    onSuccess: () => {
      setIsCodeSent(true);
      setTimeLeft(150);
      toast.success("인증번호가 발송되었습니다.");
    },
    onError: () => {
      toast.error("인증번호 발송에 실패했습니다.");
    },
  });

  const sendVerificationCode = () => {
    if (isPhoneValid) {
      const memberPhoneInfo = {
        phoneNumber: formData.memberPhoneNumber,
        userName: formData.memberId,
      };
      sendVerificationCodeMutation.mutate(memberPhoneInfo);
      resetVerificationState();
      if (verificationFailed) {
        setReAuthCooldown(5);
      }
    } else {
      toast.error("올바른 전화번호를 입력해주세요.");
    }
  };

  useEffect(() => {
    let timer;
    if (reAuthCooldown > 0) {
      timer = setInterval(() => {
        setReAuthCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [reAuthCooldown]);

  useEffect(() => {
    let timer;
    if (isCodeSent && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsCodeSent(false);
    }
    return () => clearInterval(timer);
  }, [isCodeSent, timeLeft]);

  const { data: isVerify, refetch: verifyRefetch } = useQuery({
    queryKey: ["verifyMessage"],
    queryFn: () =>
      fetchMessageVerify({ username: formData.memberId, code: formData.verificationCode }),
    enabled: false,
  });

  const handleVerify = () => {
    verifyRefetch().then(result => {
      const isSuccess = result.data;
      const message = isSuccess ? "인증이 완료되었습니다." : "인증에 실패했습니다.";
      const toastType = isSuccess ? toast.success : toast.error;

      toastType(message);
      setIsVerified(isSuccess);
      setVerificationFailed(!isSuccess);
      if (isSuccess) {
        setIsCodeSent(false);
      }
    });
  };

  const registerMutation = useMutation({
    mutationFn: postMember,
    onSuccess: () => {
      toast.success("회원가입이 완료되었습니다.");
      navigate("/login");
    },
    onError: error => {
      toast.error("회원가입에 실패했습니다. ");
    },
  });

  const handleSubmit = e => {
    e.preventDefault();
    if (!isVerified) {
      toast.error("전화번호 인증을 완료해주세요.");
      return;
    }
    const formattedBirthday = `${formData.memberBirthday.slice(0, 4)}-${formData.memberBirthday.slice(4, 6)}-${formData.memberBirthday.slice(6, 8)}`;

    const registerData = {
      ...formData,
      memberBirthday: formattedBirthday,
    };
    delete registerData.verificationCode;

    registerMutation.mutate(registerData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 p-4 px-12'>
      <div className='relative'>
        <div className='relative'>
          <LuUser2 className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400' />
          <input
            type='text'
            name='memberId'
            value={formData.memberId}
            onChange={handleChange}
            placeholder='아이디'
            className='input input-bordered h-12 w-full rounded-b-none pl-10 focus:border-black focus:outline-none focus:ring-0'
          />
        </div>
        <div className='relative'>
          <LuLock className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400' />
          <input
            type='password'
            name='memberPassword'
            value={formData.memberPassword}
            onChange={handleChange}
            placeholder='비밀번호'
            className='input input-bordered h-12 w-full rounded-none pl-10 focus:border-black focus:outline-none focus:ring-0'
          />
        </div>
        <div className='relative'>
          <SlEnvolope className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400' />
          <input
            type='email'
            name='memberEmail'
            value={formData.memberEmail}
            onChange={handleChange}
            placeholder='이메일'
            className='input input-bordered h-12 w-full rounded-t-none pl-10 focus:border-black focus:outline-none focus:ring-0'
          />
        </div>
        {errors.memberId && <p className='mt-1 text-xs text-red-500'>{errors.memberId}</p>}
        {errors.memberPassword && (
          <p className='mt-1 text-xs text-red-500'>{errors.memberPassword}</p>
        )}
        {errors.memberEmail && <p className='mt-1 text-xs text-red-500'>{errors.memberEmail}</p>}
      </div>
      <div className='relative'>
        <div className='relative'>
          <LuUser2 className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400' />
          <input
            type='text'
            name='memberName'
            value={formData.memberName}
            onChange={handleChange}
            placeholder='이름'
            className='input input-bordered h-12 w-full rounded-b-none pl-10 focus:border-black focus:outline-none focus:ring-0'
          />
        </div>
        <div className='relative'>
          <LuCake className='absolute left-3 top-1/2 -translate-y-1/2 transform text-xl text-gray-400' />
          <input
            type='tel'
            name='memberBirthday'
            value={formData.memberBirthday}
            onChange={handleChange}
            placeholder='생년월일 8자리'
            className='input input-bordered h-12 w-full rounded-none pl-10 focus:border-black focus:outline-none focus:ring-0'
          />
        </div>
        <div className='border-l-1 relative border-[1px]'>
          <PiGenderNeuterLight className='absolute left-2 top-1/2 -translate-y-1/2 transform text-2xl text-gray-400' />
          <div className='flex w-full justify-center'>
            <label className='flex cursor-pointer items-center'>
              <input
                type='radio'
                name='gender'
                value='MALE'
                onChange={handleChange}
                className='peer sr-only'
              />
              <span className='my-[7.2px] rounded-l-lg border border-gray-300 px-10 py-1 focus:outline-none peer-checked:border-[#00835F] peer-checked:bg-green-shine peer-checked:text-white'>
                남성
              </span>
            </label>
            <label className='flex cursor-pointer items-center'>
              <input
                type='radio'
                name='gender'
                value='FEMALE'
                onChange={handleChange}
                className='peer sr-only'
              />
              <span className='rounded-r-lg border border-gray-300 px-10 py-1 focus:outline-none peer-checked:border-[#00835F] peer-checked:bg-green-shine peer-checked:text-white'>
                여성
              </span>
            </label>
          </div>
        </div>

        <div className='relative'>
          <MdSmartphone className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400' />
          <input
            type='tel'
            name='memberPhoneNumber'
            value={formData.memberPhoneNumber}
            onChange={handleChange}
            placeholder='전화번호'
            className='input input-bordered h-12 w-full rounded-t-none pl-10 focus:border-black focus:outline-none focus:ring-0'
            disabled={isVerified}
          />
          {isPhoneValid && !isVerified && (
            <button
              type='button'
              onClick={sendVerificationCode}
              className='btn absolute right-0 top-0 w-16 rounded-s-none rounded-t-none bg-green-shine text-white hover:bg-green-shine'
              disabled={isCodeSent && timeLeft > 0}>
              {isCodeSent && timeLeft > 0
                ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`
                : "인증"}
            </button>
          )}
        </div>

        {isCodeSent && !isVerified && (
          <div className='form-control'>
            <label className='input input-bordered flex items-center gap-2'>
              <input
                type='text'
                name='verificationCode'
                value={formData.verificationCode}
                onChange={handleChange}
                placeholder='인증번호 입력'
                className='grow'
              />
            </label>
            <button type='button' onClick={handleVerify} className='btn btn-outline btn-info mt-2'>
              인증번호 확인
            </button>
          </div>
        )}
        {verificationFailed && (
          <button
            type='button'
            onClick={sendVerificationCode}
            className='btn btn-error w-full'
            disabled={reAuthCooldown > 0}>
            {reAuthCooldown > 0 ? `재인증 (${reAuthCooldown}초 후 가능)` : "재인증"}
          </button>
        )}

        {errors.memberName && <p className='mt-1 text-xs text-red-500'>{errors.memberName}</p>}
        {errors.memberBirthday && (
          <p className='mt-1 text-xs text-red-500'>{errors.memberBirthday}</p>
        )}
        {errors.gender && <p className='mt-1 text-xs text-red-500'>{errors.gender}</p>}
        {errors.memberPhoneNumber && (
          <p className='mt-1 text-xs text-red-500'>{errors.memberPhoneNumber}</p>
        )}

        <div className='flex items-center space-x-2 rounded-lg bg-white p-4'>
          <input
            type='checkbox'
            className='checkbox'
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <span className='text-sm'>[필수] 인증 약관 전체동의</span>
        </div>

        <button
          type='submit'
          className='btn w-full bg-green-shine hover:bg-green-shine'
          disabled={registerMutation.isPending || !isFormValid()}>
          {registerMutation.isPending ? "처리 중..." : "회원가입"}
        </button>
      </div>
    </form>
  );
};
export default SignUp;
