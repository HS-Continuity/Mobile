import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addMemberCard,
  deleteMemberCard,
  fetchMemberAddresses,
  fetchMemberCard,
  fetchMemberCoupon,
  fetchMemberInfo,
} from "../../apis/index";
import { useSubscriptionSetupStore } from "../../stores/useSubscriptionSetupStore";
import useCheckSubscriptionDetails from "../../hooks/useCheckSubscriptionDetails";
import useOrderItemsValidation from "../../hooks/useOrderItemsValidation";

import OrderItems from "../../components/Order/OrderItems";
import OrderMemberInfo from "../../components/Order/OrderMemberInfo";
import DeliveryAddress from "../../components/Order/DeliveryAddress";
import MemberCouponList from "../../components/Order/MemberCouponList";
import OrderPrice from "../../components/Order/OrderPrice";
import Payment from "../../components/Order/Payment";
import ConsentPayment from "../../components/Order/ConsentPayment";
import useCardColorStore from "../../stores/useCardColorStore";
import useAuthStore from "../../stores/useAuthStore";

const SubscriptionOrder = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  // 주문 아이템
  const { orderItems, totalProductPrice, totalDeliveryFee } = location.state || { orderItems: [] };
  // 쿠폰
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  // 받는 사람
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  // 결제 수단
  const [consentPayment, setConsentPayment] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [isCardRegistrationModalOpen, setIsCardRegistrationModalOpen] = useState(false);

  // 카드 색깔 전역 변수
  const getCardColor = useCardColorStore(state => state.getCardColor);

  const { subscriptionDetails } = useSubscriptionSetupStore();

  useCheckSubscriptionDetails(subscriptionDetails);
  useOrderItemsValidation(orderItems);

  // 설정 값
  const { username } = useAuthStore();
  const memberId = username;
  // const memberId = import.meta.env.VITE_memberId;
  // const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // const shippingFee = 2500;
  // const regularShippingDiscount = -2500;
  // const totalPrice = totalProductPrice;
  const couponDiscount = selectedCoupon ? selectedCoupon.discount_amount : 0;
  const finalPrice = totalProductPrice - couponDiscount;

  // const createOrderMutation = useMutation({
  //   mutationFn: createSubscriptionOrder,
  //   onSuccess: data => {
  //     navigate("/order-complete", { state: { orderId: data.id } });
  //   },
  // });

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
  const handleDeleteCard = cardId => {
    if (window.confirm("정말 이 카드를 삭제하시겠습니까?")) {
      deleteCardMutation.mutate({ memberId: memberId, cardId });
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

  // 주소지 관리 Modal 열기 핸들러
  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  // 주소지 관리 Modal 닫기 핸들러
  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
    queryClient.invalidateQueries(["address", memberId]);
  };

  // useEffect(() => {
  //   if (memberInfo && memberInfo.length > 0) {
  //     setRecipientName(memberInfo[0].memberName);
  //     setRecipientPhone(memberInfo[0].memberPhoneNumber);
  //   }
  // }, [memberInfo]);

  if (couponsLoading || memberInfoLoading || addressesLoading || cardsLoading)
    return <div>불러오는중...</div>;
  if (couponsError || memberInfoError || addressesError || cardsError)
    return <div>Error loading data</div>;

  const defaultAddress = addresses.find(address => address.is_default_address);

  // const handleSubmit = () => {
  //   const orderData = {
  //     items: orderItems,
  //     subscriptionDetails,
  //     totalPrice: finalPrice,
  //     paymentMethod,
  //   };
  //   createOrderMutation.mutate(orderData);
  // };

  return (
    <div className='noScrollbar flex h-screen flex-col bg-gray-50 pb-14'>
      <div className='noScrollbar flex-1 space-y-4 overflow-auto p-4'>
        {/* 주문 아이템 */}
        <OrderItems orderItems={orderItems} />

        {/* 배송 주기 */}
        <div className='mb-4 rounded-lg bg-white p-4 shadow'>
          <h2 className='mb-2 font-bold'>정기 배송 정보</h2>
          <p>배송주기: {subscriptionDetails.frequency}</p>
          <p>배송기간: {subscriptionDetails.duration}</p>
          <p>배송요일: {subscriptionDetails.selectedDays.join(", ")}</p>
        </div>

        {/* 구매자 정보 */}
        <OrderMemberInfo memberInfo={memberInfo} />

        {/* 받는 사람 주소 */}
        <DeliveryAddress
          defaultAddress={defaultAddress}
          isAddressModalOpen={isAddressModalOpen}
          handleOpenAddressModal={handleOpenAddressModal}
          handleCloseAddressModal={handleCloseAddressModal}
          memberId={memberId}
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
          regularShippingDiscount={true}
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

export default SubscriptionOrder;
