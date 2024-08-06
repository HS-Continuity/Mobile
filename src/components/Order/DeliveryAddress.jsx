import { FaEdit } from "react-icons/fa";
import AddressModal from "./AddressModal";

const DeliveryAddress = ({
  selectedAddress,
  isAddressModalOpen,
  handleOpenAddressModal,
  handleCloseAddressModal,
  memberId,
  onSelectAddress,
}) => {
  return (
    <div className='rounded-lg border bg-white p-4'>
      <div className='mb-2 flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>배송 정보</h2>
        <button
          className='rounded border border-gray-300 bg-transparent px-3 py-1 text-sm text-black'
          onClick={handleOpenAddressModal}>
          <FaEdit className='mb-1 mr-1 inline-block' />
          {selectedAddress ? "변경" : "등록"}
        </button>
      </div>
      <hr className='mb-3 border-gray-200' />
      <div className='space-y-1'>
        <div>
          <span className='inline-block w-24 font-light text-gray-500'>배송지</span>
          <span>{selectedAddress?.addressName || "미선택"}</span>
        </div>
        <div>
          <span className='inline-block w-24 font-light text-gray-500'>주소</span>
          <span>
            {selectedAddress
              ? selectedAddress.generalAddress + " " + selectedAddress.detailAddress
              : "현재 등록된 배송지가 없습니다"}
          </span>
        </div>
        <div>
          <span className='inline-block w-24 font-light text-gray-500'>받는 분</span>
          <span>{selectedAddress?.recipientName || "정보 없음"}</span>
        </div>
        <div>
          <span className='inline-block w-24 font-light text-gray-500'>전화번호</span>
          <span>{selectedAddress?.recipientPhoneNumber || "정보 없음"}</span>
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={handleCloseAddressModal}
        memberId={memberId}
        onSelectAddress={onSelectAddress}
      />
    </div>
  );
};

export default DeliveryAddress;
