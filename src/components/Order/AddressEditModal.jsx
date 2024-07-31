import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import DaumPostcode from "react-daum-postcode";
import { updateAddress, fetchMemberAddressDetail } from "../../apis";
import Modal from "../../pages/product/Modal";
import { toast } from "react-hot-toast";

const AddressEditModal = ({ isOpen, onClose, memberId, addressId }) => {
  const queryClient = useQueryClient();

  const [addressName, setAddressName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState("");
  const [generalAddress, setGeneralAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const {
    data: addressDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["addressDetails", addressId],
    queryFn: () => fetchMemberAddressDetail(addressId),
    enabled: !!addressId,
  });

  useEffect(() => {
    if (addressDetails) {
      setAddressName(addressDetails.addressName);
      setRecipientName(addressDetails.recipientName);
      setRecipientPhoneNumber(addressDetails.recipientPhoneNumber);
      setGeneralAddress(addressDetails.generalAddress);
      setDetailAddress(addressDetails.detailAddress);
      setIsDefaultAddress(addressDetails.isDefaultAddress == true);
    }
  }, [addressDetails]);

  const updateAddressMutation = useMutation({
    mutationFn: updateAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(["addresses", memberId]);
      toast.success("배송지가 성공적으로 수정되었습니다!", {
        style: {
          border: "1px solid #00835F",
          padding: "12px",
          color: "black",
        },
        iconTheme: {
          primary: "#00835F",
          secondary: "#FFFAEE",
        },
        duration: 2000,
        position: "bottom-center",
      });
      onClose();
    },
    onError: () => {
      toast.error("배송지 등록에 실패하였습니다.", {
        style: {
          border: "1px solid #FF0000",
          padding: "12px",
          color: "black",
        },
        iconTheme: {
          primary: "#FF0000",
          secondary: "#FFFAEE",
        },
        duration: 2000,
        position: "bottom-center",
      });

      window.location.reload();
    },
  });

  const handleComplete = data => {
    setGeneralAddress(data.address);
    setIsSearchOpen(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    updateAddressMutation.mutate({
      memberAddressId: addressId,
      memberId: memberId,
      addressName,
      recipientName,
      recipientPhoneNumber,
      generalAddress,
      detailAddress,
      isDefaultAddress: isDefaultAddress ? true : false,
    });
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

  if (isLoading) return <div></div>;
  if (isError) return <div>주소 정보를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='배송지 수정'>
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
              className='btn bg-[#00835F] text-white'
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
              }}>
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
              className='checkbox mr-3 border-gray-500 [--chkbg:#00835F] [--chkfg:white] checked:border-[#00835F]'
            />
            {/* <input
              type='checkbox'
              name='isDefaultAddress'
              checked={isDefaultAddress}
              onChange={e => setIsDefaultAddress(e.target.checked)}
              className='checkbox-primary checkbox'
            /> */}
          </label>
        </div>
        <div className='mt-6'>
          <button
            type='submit'
            className='btn w-full bg-green-shine text-base text-white hover:bg-green-shine'
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
            }}>
            수정하기
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

export default AddressEditModal;
