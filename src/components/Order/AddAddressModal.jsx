import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaPlus, FaSearch } from "react-icons/fa";
import DaumPostcode from "react-daum-postcode";
import { addAddress } from "../../apis";
import Modal from "../../pages/product/Modal";

const AddAddressModal = ({ isOpen, onClose, memberId }) => {
  const queryClient = useQueryClient();

  const [addressName, setAddressName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState("");
  const [generalAddress, setGeneralAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const addAddressMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(["address", memberId]);
      onClose();
    },
  });

  const handleComplete = data => {
    setGeneralAddress(data.address);
    setIsSearchOpen(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    addAddressMutation.mutate({
      memberId,
      addressName,
      recipientName,
      recipientPhoneNumber,
      generalAddress,
      detailAddress,
      isDefaultAddress: isDefaultAddress,
    });
    window.location.reload();
  };

  const formatPhoneNumber = value => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength <= 3) return phoneNumber;
    if (phoneNumberLength <= 7) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  const handlePhoneChange = e => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setRecipientPhoneNumber(formattedPhoneNumber);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='새 배송지 등록'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='label'>
            <span className='label-text'>주소지 명</span>
          </label>
          <input
            type='text'
            name='addressName'
            value={addressName}
            onChange={e => setAddressName(e.target.value)}
            className='input input-bordered w-full'
            placeholder='예) 집, 회사'
          />
        </div>
        <div>
          <label className='label'>
            <span className='label-text'>받는 사람</span>
          </label>
          <input
            type='text'
            name='recipientName'
            value={recipientName}
            onChange={e => setRecipientName(e.target.value)}
            className='input input-bordered w-full'
            placeholder='받는 사람 이름'
          />
        </div>
        <div>
          <label className='label'>
            <span className='label-text'>연락처</span>
          </label>
          <input
            type='tel'
            name='recipientPhoneNumber'
            value={recipientPhoneNumber}
            onChange={handlePhoneChange}
            className='input input-bordered w-full'
            placeholder='받는 사람 연락처(-제외)'
            maxLength={13}
            pattern='[0-9]{3}-[0-9]{3,4}-[0-9]{4}'
            title='올바른 전화번호 형식을 입력해주세요 (예: 010-1234-5678)'
          />
        </div>
        <div>
          <label className='label'>
            <span className='label-text'>주소</span>
          </label>
          <div className='flex space-x-2'>
            <input
              type='text'
              value={generalAddress}
              readOnly
              name='generalAddress'
              className='input input-bordered flex-grow'
              placeholder='주소 검색을 눌러주세요'
            />
            <button
              type='button'
              onClick={() => setIsSearchOpen(true)}
              className='btn bg-[#00835F] text-white'>
              <FaSearch />
            </button>
          </div>
        </div>
        <div>
          <input
            type='text'
            name='detailAddress'
            value={detailAddress}
            onChange={e => setDetailAddress(e.target.value)}
            className='input input-bordered w-full'
            placeholder='상세 주소를 입력해주세요'
          />
        </div>
        <div className='form-control'>
          <label className='label cursor-pointer'>
            <span className='label-text'>기본 배송지로 설정</span>
            <input
              type='checkbox'
              name='isDefaultAddress'
              checked={isDefaultAddress}
              onChange={e => setIsDefaultAddress(e.target.checked)}
              className='checkbox-primary checkbox'
            />
          </label>
        </div>
        <div className='mt-6'>
          <button
            type='submit'
            className='btn w-full bg-green-shine text-base text-white hover:bg-green-shine'>
            <FaPlus className='mr-2 text-base text-white' /> 등록
          </button>
        </div>
      </form>
      {isSearchOpen && (
        <Modal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} title='주소 검색'>
          <DaumPostcode onComplete={handleComplete} />
        </Modal>
      )}
    </Modal>
  );
};

export default AddAddressModal;
