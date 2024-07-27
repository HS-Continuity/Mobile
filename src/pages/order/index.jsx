import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useOrderItemsValidation from "../../hooks/useOrderItemsValidation";
import useCardColorStore from "../../stores/useCardColorStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addMemberCard,
  deleteMemberCard,
  fetchMemberAddresses,
  fetchMemberCard,
  fetchMemberCoupon,
  fetchMemberInfo,
} from "../../apis";

import OrderItems from "../../components/Order/OrderItems";
import OrderMemberInfo from "../../components/Order/OrderMemberInfo";
import DeliveryMemberInfo from "../../components/Order/DeliveryMemberInfo";
import DeliveryAddress from "../../components/Order/DeliveryAddress";
import MemberCouponList from "../../components/Order/MemberCouponList";
import OrderPrice from "../../components/Order/OrderPrice";
import Payment from "../../components/Order/Payment";
import ConsentPayment from "../../components/Order/ConsentPayment";
import useAuthStore from "../../stores/useAuthStore";

const Order = () => {
  const queryClient = useQueryClient();
  const location = useLocation();

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

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [hasUserSelectedAddress, setHasUserSelectedAddress] = useState(false);

  // 결제 버튼 활성화 상태
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);

  // 카드 색깔 전역 변수
  const getCardColor = useCardColorStore(state => state.getCardColor);

  // 주문 아이템 존재하는지
  useOrderItemsValidation(orderItems);

  // 설정 값
  const { username } = useAuthStore();
  const memberId = username;
  // const memberId = import.meta.env.VITE_memberId;
  const couponDiscount = selectedCoupon ? selectedCoupon.discountAmount : 0;
  const finalPrice = totalProductPrice + totalDeliveryFee - couponDiscount;

  // QUERIES
  // [GET] 회원 쿠폰 조회 쿼리
  const {
    data: coupons,
    isLoading: couponsLoading,
    isError: couponsError,
  } = useQuery({
    queryKey: ["coupon", memberId],
    queryFn: () => fetchMemberCoupon(memberId),
  });

  // [GET] 회원 정보 조회 쿼리
  const {
    data: memberInfo,
    isLoading: memberInfoLoading,
    isError: memberInfoError,
  } = useQuery({
    queryKey: ["member", memberId],
    queryFn: () => fetchMemberInfo(memberId),
  });

  // [GET] 회원 등록한 주소지 조회 쿼리
  const {
    data: addresses,
    isLoading: addressesLoading,
    isError: addressesError,
  } = useQuery({
    queryKey: ["address", memberId],
    queryFn: () => fetchMemberAddresses(memberId),
  });

  // [GET] 회원 카드 조회 쿼리
  const {
    data: cards,
    isLoading: cardsLoading,
    isError: cardsError,
  } = useQuery({
    queryKey: ["card", memberId],
    queryFn: () => fetchMemberCard(memberId),
  });

  // MUTATIONS
  // [POST] 카드 등록
  const addCardMutation = useMutation({
    mutationFn: addMemberCard,
    onSuccess: () => {
      queryClient.invalidateQueries(["card", memberId]);
      setIsCardRegistrationModalOpen(false);
    },
  });

  // [DELETE] 카드 삭제
  const deleteCardMutation = useMutation({
    mutationFn: deleteMemberCard,
    onSuccess: () => {
      queryClient.invalidateQueries(["card", memberId]);
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
    addCardMutation.mutate({ memberId: memberId, ...cardData });
  };

  // 카드 삭제 핸들러
  const handleDeleteCard = memberPaymentCardId => {
    if (window.confirm("정말 이 카드를 삭제하시겠습니까?")) {
      deleteCardMutation.mutate(memberPaymentCardId);
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
    const memberCouponId = e.target.value;
    console.log(memberCouponId);
    if (memberCouponId == "") {
      setSelectedCoupon(null);
    } else {
      const selected = coupons.find(coupon => coupon.memberCouponId == memberCouponId);
      setSelectedCoupon(selected || null);
    }
  };

  // 주소지 관리 Modal 열기 핸들러
  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  // 주소지 관리 Modal 닫기 핸들러
  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
    queryClient.invalidateQueries(["address", memberId]);
  };

  const handleSelectAddress = address => {
    setSelectedAddress(address);
    setHasUserSelectedAddress(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (memberInfo && memberInfo.length > 0) {
      setRecipientName(memberInfo[0].memberName);
      setRecipientPhone(memberInfo[0].memberPhoneNumber);
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

  useEffect(() => {
    if (addresses && addresses.length > 0 && !hasUserSelectedAddress) {
      const defaultAddress = addresses.find(address => address.isDefaultAddress === "ACTIVE");
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    }
  }, [addresses, hasUserSelectedAddress]);

  if (couponsLoading || memberInfoLoading || addressesLoading || cardsLoading)
    return <div>불러오는중...</div>;
  if (couponsError || memberInfoError || addressesError || cardsError)
    return <div>Error loading data</div>;

  // const defaultAddress = addresses.find(address => address.isDefaultAddress);

  return (
    <div className='flex flex-col bg-gray-50 pb-20'>
      <div className='noScrollbar flex-1 space-y-4 overflow-auto'>
        {/* 주문 아이템 */}
        <OrderItems orderItems={orderItems} />

        {/* 구매자 정보 */}
        <OrderMemberInfo memberInfo={memberInfo} />

        {/* 받는 사람 주소 */}
        <DeliveryAddress
          selectedAddress={selectedAddress}
          isAddressModalOpen={isAddressModalOpen}
          handleOpenAddressModal={handleOpenAddressModal}
          handleCloseAddressModal={handleCloseAddressModal}
          memberId={memberId}
          onSelectAddress={handleSelectAddress}
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
          handleDeleteCard={handleDeleteCard}
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
