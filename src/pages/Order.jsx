import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import useOrderItemsValidation from "../hooks/useOrderItemsValidation";
import useCardColorStore from "../stores/useCardColorStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addMemberCard,
  deleteMemberCard,
  fetchMemberAddresses,
  fetchMemberCard,
  fetchMemberCoupon,
  fetchMemberInfo,
  updateMemberCard,
} from "../apis";

import OrderItems from "../components/Order/OrderItems";
import OrderMemberInfo from "../components/Order/OrderMemberInfo";
import DeliveryMemberInfo from "../components/Order/DeliveryMemberInfo";
import DeliveryAddress from "../components/Order/DeliveryAddress";
import MemberCouponList from "../components/Order/MemberCouponList";
import OrderPrice from "../components/Order/OrderPrice";
import Payment from "../components/Order/Payment";
import ConsentPayment from "../components/Order/ConsentPayment";

const Order = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  // 주문 아이템
  const { orderItems, totalProductPrice, totalDeliveryFee } = location.state || { orderItems: [] };
  // 쿠폰
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  // 받는 사람
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  // 결제 수단
  const [consentPayment, setConsentPayment] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [isCardRegistrationModalOpen, setIsCardRegistrationModalOpen] = useState(false);
  const [isCardEditModalOpen, setIsCardEditModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  // 결제 버튼 활성화 상태
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);

  // 카드 색깔 전역 변수
  const getCardColor = useCardColorStore(state => state.getCardColor);

  // 주문 아이템 존재하는지
  useOrderItemsValidation(orderItems);

  // 설정 값
  // const member_id = import.meta.env.VITE_MEMBER_ID;
  const member_id = 1;
  const couponDiscount = selectedCoupon ? selectedCoupon.discount_amount : 0;
  const finalPrice = totalProductPrice + totalDeliveryFee - couponDiscount;

  // QUERIES
  // [GET] 회원 쿠폰 조회 쿼리
  const {
    data: coupons,
    isLoading: couponsLoading,
    isError: couponsError,
  } = useQuery({
    queryKey: ["coupon", member_id],
    queryFn: () => fetchMemberCoupon(member_id),
  });

  // [GET] 회원 정보 조회 쿼리
  const {
    data: memberInfo,
    isLoading: memberInfoLoading,
    isError: memberInfoError,
  } = useQuery({
    queryKey: ["member", member_id],
    queryFn: () => fetchMemberInfo(member_id),
  });

  // [GET] 회원 등록한 주소지 조회 쿼리
  const {
    data: addresses,
    isLoading: addressesLoading,
    isError: addressesError,
  } = useQuery({
    queryKey: ["address", member_id],
    queryFn: () => fetchMemberAddresses(member_id),
  });

  // [GET] 회원 카드 조회 쿼리
  const {
    data: cards,
    isLoading: cardsLoading,
    isError: cardsError,
  } = useQuery({
    queryKey: ["card", member_id],
    queryFn: () => fetchMemberCard(member_id),
  });

  // MUTATIONS
  // [POST] 카드 등록
  const addCardMutation = useMutation({
    mutationFn: addMemberCard,
    onSuccess: () => {
      queryClient.invalidateQueries(["card", member_id]);
      setIsCardRegistrationModalOpen(false);
    },
  });

  // [UPDATE] 카드 수정
  const updateCardMutation = useMutation({
    mutationFn: updateMemberCard,
    onSuccess: () => {
      queryClient.invalidateQueries(["card", member_id]);
      setIsCardEditModalOpen(false);
    },
  });

  // [DELETE] 카드 삭제
  const deleteCardMutation = useMutation({
    mutationFn: deleteMemberCard,
    onSuccess: () => {
      queryClient.invalidateQueries(["card", member_id]);
    },
  });

  // 카드 번호 마스킹 함수
  const maskDigits = inputStr => {
    let digitCount = 0;
    return inputStr
      .split("")
      .map(char => {
        if (/\d/.test(char)) {
          digitCount++;
          if (digitCount >= 7 && digitCount <= 12) {
            return "*";
          }
        }
        return char;
      })
      .join("");
  };

  // EVENT HANDLERS
  // 카드 추가 핸들러
  const handleAddCard = cardData => {
    addCardMutation.mutate({ memberId: member_id, ...cardData });
  };

  // 카드 수정 Modal 핸들러
  const handleEditCard = card => {
    setEditingCard(card);
    setIsCardEditModalOpen(true);
  };

  // 카드 수정 핸들러
  const handleUpdateCard = updatedCard => {
    updateCardMutation.mutate({
      memberId: member_id,
      id: updatedCard.id,
      ...updatedCard,
    });
  };

  // 카드 삭제 핸들러
  const handleDeleteCard = cardId => {
    if (window.confirm("정말 이 카드를 삭제하시겠습니까?")) {
      deleteCardMutation.mutate({ memberId: member_id, cardId });
    }
  };

  // 이전 카드 선택
  const handlePrevCard = () => {
    setSelectedCardIndex(prevIndex =>
      prevIndex === 0 ? (cards ? cards.length : 0) : prevIndex - 1
    );
  };

  // 다음 카드 선택
  const handleNextCard = () => {
    setSelectedCardIndex(prevIndex =>
      prevIndex === (cards ? cards.length : 0) ? 0 : prevIndex + 1
    );
  };

  // 결제 수단 핸들러
  const handleConsentPayment = () => {
    setConsentPayment(!consentPayment);
  };

  // 쿠폰 핸들러
  const handleCouponChange = e => {
    const couponId = e.target.value;
    if (couponId === "") {
      setSelectedCoupon(null);
    } else {
      const selected = coupons.find(coupon => coupon.id === couponId);
      setSelectedCoupon(selected || null);
    }
  };

  // 받는 사람 이름 수정 핸들러
  const handleNameChange = e => {
    setRecipientName(e.target.value);
  };

  // 받는 사람 전화번호 핸들러
  const handlePhoneChange = e => {
    setRecipientPhone(e.target.value);
  };

  // 주소지 관리 Modal 열기 핸들러
  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  // 주소지 관리 Modal 닫기 핸들러
  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
    queryClient.invalidateQueries(["address", member_id]);
  };

  useEffect(() => {
    if (memberInfo && memberInfo.length > 0) {
      setRecipientName(memberInfo[0].member_name);
      setRecipientPhone(memberInfo[0].member_phone_number);
    }
  }, [memberInfo]);

  // 결제 버튼 활성화 여부 확인
  useEffect(() => {
    const isValidCard =
      cards &&
      cards.length > 0 &&
      selectedCardIndex !== null &&
      cards[selectedCardIndex] &&
      new Date(cards[selectedCardIndex].expiry_date) > new Date();
    const isValidAddress = addresses && addresses.some(address => address.is_default_address);

    setIsPaymentEnabled(
      recipientName !== "" &&
        recipientPhone !== "" &&
        isValidAddress &&
        isValidCard &&
        consentPayment
    );
  }, [recipientName, recipientPhone, addresses, cards, selectedCardIndex, consentPayment]);

  if (couponsLoading || memberInfoLoading || addressesLoading || cardsLoading)
    return <div>불러오는중...</div>;
  if (couponsError || memberInfoError || addressesError || cardsError)
    return <div>Error loading data</div>;

  const defaultAddress = addresses.find(address => address.is_default_address);

  return (
    <div className='noScrollbar flex h-screen flex-col bg-gray-100'>
      <div className='noScrollbar flex items-center bg-[#00835F] p-4 text-white'>
        <FaChevronLeft className='mr-4 cursor-pointer' onClick={() => navigate(-1)} />
        <h1 className='text-xl font-bold'>단건 주문 결제</h1>
      </div>

      <div className='noScrollbar flex-1 space-y-4 overflow-auto p-4'>
        {/* 주문 아이템 */}
        <OrderItems orderItems={orderItems} />

        {/* 구매자 정보 */}
        <OrderMemberInfo memberInfo={memberInfo[0]} />

        {/* 받는 사람 정보 */}
        <DeliveryMemberInfo
          recipientName={recipientName}
          recipientPhone={recipientPhone}
          handleNameChange={handleNameChange}
          handlePhoneChange={handlePhoneChange}
        />

        {/* 받는 사람 주소 */}
        <DeliveryAddress
          defaultAddress={defaultAddress}
          isAddressModalOpen={isAddressModalOpen}
          handleOpenAddressModal={handleOpenAddressModal}
          handleCloseAddressModal={handleCloseAddressModal}
          memberId={member_id}
        />

        {/* 회원 쿠폰 리스트 */}
        <MemberCouponList
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          handleCouponChange={handleCouponChange}
        />

        {/* 결제 금액 */}
        <OrderPrice
          totalProductPrice={totalProductPrice}
          totalDeliveryFee={totalDeliveryFee}
          selectedCoupon={selectedCoupon}
          finalPrice={finalPrice}
        />

        {/*  결제 수단 */}
        <Payment
          cards={cards}
          selectedCardIndex={selectedCardIndex}
          handlePrevCard={handlePrevCard}
          handleNextCard={handleNextCard}
          handleEditCard={handleEditCard}
          handleDeleteCard={handleDeleteCard}
          isCardEditModalOpen={isCardEditModalOpen}
          setIsCardEditModalOpen={setIsCardEditModalOpen}
          handleUpdateCard={handleUpdateCard}
          editingCard={editingCard}
          isCardRegistrationModalOpen={isCardRegistrationModalOpen}
          setIsCardRegistrationModalOpen={setIsCardRegistrationModalOpen}
          handleAddCard={handleAddCard}
          getCardColor={getCardColor}
          maskDigits={maskDigits}
        />

        {/* 결제 동의 */}
        <div className=''>
          <label className='flex items-center'>
            <input
              type='checkbox'
              className='checkbox-primary checkbox mr-2'
              onChange={handleConsentPayment}
              checked={consentPayment}
            />
            <span className='text-sm'>위 내용을 확인하였으며 결제에 동의합니다.</span>
          </label>
        </div>
      </div>

      {/* 결제하기 버튼 */}
      <ConsentPayment
        consentPayment={consentPayment}
        handleConsentPayment={handleConsentPayment}
        finalPrice={finalPrice}
      />
    </div>
  );
};

export default Order;
