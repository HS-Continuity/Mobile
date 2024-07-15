import { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaUser,
  FaEnvelope,
  FaLock,
  FaBirthdayCake,
  FaPhone,
  FaVenusMars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useMemberStore from "../stores/useMemberStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMemberInfo, updateUser } from "../apis";

const Profile = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useMemberStore();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["member"],
    queryFn: () => fetchMemberInfo(1),
  });

  const updateUserMutation = useMutation({
    mutationFn: updateData => updateUser({ id: userData[0].id, userData: updateData }),
    onSuccess: () => {
      queryClient.invalidateQueries(["member"]);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordError("");
      alert("비밀번호가 성공적으로 변경되었습니다.");
    },
    onError: error => {
      if (error.response && error.response.status === 401) {
        setPasswordError("현재 비밀번호가 올바르지 않습니다.");
      } else {
        setPasswordError("비밀번호 변경에 실패했습니다. " + error.message);
      }
    },
  });

  const [formData, setFormData] = useState({
    member_id: "",
    member_name: "",
    member_email: "",
    member_password: "",
    member_birthday: "",
    member_phone_number: "",
    member_gender: "",
    id: "",
  });

  useEffect(() => {
    if (userData) {
      setUser(userData[0]);
      setFormData(userData[0]);
    }
  }, [userData, setUser]);

  const handlePasswordChange = e => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const validatePasswordChange = () => {
    if (!passwordForm.currentPassword) {
      setPasswordError("현재 비밀번호를 입력해주세요.");
      return false;
    }

    if (passwordForm.currentPassword !== userData[0].member_password) {
      console.log(passwordForm.currentPassword);
      console.log(userData[0].member_password);
      setPasswordError("현재 비밀번호가 일치하지 않습니다.");
      return false;
    }
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("새 비밀번호와 확인 비밀번호를 모두 입력해주세요.");
      return false;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return false;
    }
    return true;
  };

  const handleSubmit = e => {
    e.preventDefault();
    setPasswordError("");

    if (!validatePasswordChange()) {
      return;
    }

    updateUserMutation.mutate({
      ...formData,
      member_password: passwordForm.confirmPassword,
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user data</div>;

  return (
    <div className='flex flex-col'>
      <form onSubmit={handleSubmit} className='flex-1 space-y-4 p-4'>
        <label className='input input-bordered flex items-center gap-2'>
          <FaUser />
          회원명
          <input
            type='text'
            name='member_name'
            className='grow'
            value={formData.member_name}
            disabled
          />
        </label>
        <label className='input input-bordered flex items-center gap-2'>
          <FaEnvelope />
          아이디
          <input
            type='text'
            name='member_email'
            className='grow'
            value={formData.member_email}
            disabled
          />
        </label>

        <label className='input input-bordered flex items-center gap-2'>
          <FaLock />
          현재 비밀번호
          <input
            type='password'
            className='grow'
            name='currentPassword'
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
          />
        </label>
        <label className='input input-bordered flex items-center gap-2'>
          <FaLock />
          새 비밀번호
          <input
            type='password'
            className='grow'
            name='newPassword'
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
          />
        </label>
        <label className='input input-bordered flex items-center gap-2'>
          <FaLock />
          새 비밀번호 확인
          <input
            type='password'
            className='grow'
            name='confirmPassword'
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
          />
        </label>
        <label className='input input-bordered flex items-center gap-2'>
          <FaBirthdayCake />
          생년월일
          <input
            name='member_birthday'
            type='text'
            className='grow'
            value={formData.member_birthday}
            disabled
          />
        </label>
        <label className='input input-bordered flex items-center gap-2'>
          <FaPhone />
          휴대폰번호
          <input
            name='member_phone_number'
            type='text'
            className='grow'
            value={formData.member_phone_number}
            disabled
          />
        </label>
        {/* <label className='input input-bordered flex items-center gap-2'>
          <FaVenusMars />
          성별
          <input
            name='member_gender'
            type='text'
            className='grow'
            value={formData.member_gender}
            disabled
          />
        </label> */}
        {passwordError && <div className='text-red-500'>{passwordError}</div>}
        <button className='btn btn-primary w-full'>비밀번호 변경</button>
      </form>
    </div>
  );
};

export default Profile;
