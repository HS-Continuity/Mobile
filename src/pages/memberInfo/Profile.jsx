import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock, FaBirthdayCake, FaPhone } from "react-icons/fa";
import useMemberStore from "../../stores/useMemberStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changePassword, fetchMemberInfo, verifyPassword } from "../../apis";
import useAuthStore from "../../stores/useAuthStore";
import toast from "react-hot-toast";
import { FaPerson } from "react-icons/fa6";
import { ProfileError } from "../../components/Errors/ErrorDisplay";
import { ProfileSkeleton } from "../../components/Skeletons/ProfileSkeleton";

const InfoField = ({ icon, label, value }) => (
  <div className='flex items-center space-x-3 rounded-lg bg-gray-50 p-1'>
    <span className='ml-3 text-gray-500'>{icon}</span>
    <div>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='font-medium text-gray-800'>{value}</p>
    </div>
  </div>
);

const PasswordField = ({ icon, label, name, value, onChange, autoComplete }) => (
  <div className='flex items-center space-x-4 rounded-lg border border-gray-200 bg-white p-3'>
    <div className='flex min-w-[120px] items-center space-x-3'>
      <span className='text-gray-500'>{icon}</span>
      <label htmlFor={name} className='text-sm font-medium text-gray-700'>
        {label}
      </label>
    </div>
    <input
      id={name}
      type='password'
      name={name}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className='flex-1 border-b border-gray-200 bg-transparent py-1 text-gray-800 focus:border-[#00835F] focus:outline-none'
      placeholder='8글자 이상 영문, 숫자를 입력하세요'
    />
  </div>
);

const Profile = () => {
  const { username } = useAuthStore();
  const memberId = username;
  const queryClient = useQueryClient();
  const { user, setUser } = useMemberStore();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [formData, setFormData] = useState(null);

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["member", memberId],
    queryFn: () => fetchMemberInfo(memberId),
  });

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setFormData(userData);
    }
  }, [userData, setUser]);

  const handlePasswordChange = e => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const validatePasswordChange = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError("모든 비밀번호 필드를 입력해주세요.");
      return false;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return false;
    }
    return true;
  };

  const verifyPasswordMutation = useMutation({
    mutationFn: () => verifyPassword(memberId, passwordForm.currentPassword),
    onSuccess: isValid => {
      console.log(isValid);
      if (isValid) {
        changePasswordMutation.mutate();
      } else {
        setPasswordError("현재 비밀번호가 올바르지 않습니다.");
      }
    },
    onError: () => {
      setPasswordError("비밀번호 검증에 실패했습니다.");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: () =>
      changePassword({
        memberId: memberId,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }),
    onSuccess: data => {
      if (data.resultCode == "200") {
        queryClient.invalidateQueries(["member"]);
        toast.success("비밀번호가 성공적으로 변경되었습니다.");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordError("");
      }
    },
    onError: error => {
      setPasswordError("비밀번호 변경에 실패했습니다. " + error.message);
    },
  });

  const handleSubmit = e => {
    e.preventDefault();
    setPasswordError("");

    if (!validatePasswordChange()) {
      return;
    }

    verifyPasswordMutation.mutate();
  };

  const getGenderDisplay = gender => {
    switch (gender) {
      case "MALE":
        return "남성";
      case "FEMALE":
        return "여성";
      default:
        return "미지정";
    }
  };

  if (isLoading) return <ProfileSkeleton />;
  if (isError) return <ProfileError />;
  if (!formData) return null;

  return (
    <div className='flex flex-col bg-gray-50'>
      <form onSubmit={handleSubmit} className='flex-1 bg-white shadow-sm'>
        <div className='space-y-4 p-4'>
          <div className='grid grid-cols-2 gap-4'>
            <InfoField icon={<FaUser />} label='회원명' value={formData.memberName} />
            <InfoField icon={<FaBirthdayCake />} label='생년월일' value={formData.memberBirthday} />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <InfoField icon={<FaEnvelope />} label='아이디' value={formData.memberId} />
            <InfoField icon={<FaEnvelope />} label='이메일' value={formData.memberEmail} />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <InfoField icon={<FaPhone />} label='전화번호' value={formData.memberPhoneNumber} />
            <InfoField icon={<FaPerson />} label='성별' value={getGenderDisplay(formData.gender)} />
          </div>
        </div>

        <div className='p-4'>
          <h2 className='mb-1 text-lg font-semibold text-gray-700'>비밀번호 변경</h2>
          <div className='space-y-2'>
            <input
              type='text'
              autoComplete='username'
              value={formData.memberId}
              readOnly
              style={{ display: "none" }}
            />
            <PasswordField
              icon={<FaLock />}
              label='현재 비밀번호'
              name='currentPassword'
              autoComplete='current-password'
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
            />
            <PasswordField
              icon={<FaLock />}
              label='새 비밀번호'
              name='newPassword'
              autoComplete='new-password'
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
            />
            <PasswordField
              icon={<FaLock />}
              label='새 비밀번호 확인'
              name='confirmPassword'
              autoComplete='new-password'
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>
        </div>

        {passwordError && <div className='pb-4 pl-4 text-sm text-red-500'>{passwordError}</div>}
        <div className='px-4'>
          <button
            className='btn w-full bg-[#00835F] p-4 text-white hover:bg-[#00734F]'
            disabled={verifyPasswordMutation.isLoading || changePasswordMutation.isLoading}>
            {verifyPasswordMutation.isLoading || changePasswordMutation.isLoading
              ? "처리 중..."
              : "비밀번호 변경"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
