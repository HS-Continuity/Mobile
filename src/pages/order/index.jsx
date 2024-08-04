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
  postOrder,
} from "../../apis";

import OrderItems from "../../components/Order/OrderItems";
import OrderMemberInfo from "../../components/Order/OrderMemberInfo";
import DeliveryAddress from "../../components/Order/DeliveryAddress";
import MemberCouponList from "../../components/Order/MemberCouponList";
import OrderPrice from "../../components/Order/OrderPrice";
import Payment from "../../components/Order/Payment";
import DeliveryMemo from "../../components/Order/DeliveryMemo";
import ConsentPayment from "../../components/Order/ConsentPayment";
import useAuthStore from "../../stores/useAuthStore";
import OrderSkeleton from "../../components/Skeletons/OrderSkeleton";
import toast from "react-hot-toast";
import { showCustomToast } from "../../components/Toast/ToastDisplay";
import {
  AddressError,
  CouponError,
  MypageError,
  PaymentError,
} from "../../components/Errors/ErrorDisplay";

const Order = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  // 주문 아이템
  const { groupedItems, totalProductPrice, totalDeliveryFee } = location.state || {
    groupedItems: [],
  };
  // 쿠폰
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  // 구매자 정보
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // 배송 메모
  const [orderMemo, setOrderMemo] = useState("");

  // 결제 수단
  const [consentPayment, setConsentPayment] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [isCardRegistrationModalOpen, setIsCardRegistrationModalOpen] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [hasUserSelectedAddress, setHasUserSelectedAddress] = useState(false);

  // 결제 버튼 활성화 상태
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);

  // 카드 색깔 전역 변수
  const getCardColor = useCardColorStore(state => state.getCardColor);

  // 주문 아이템 존재하는지
  useOrderItemsValidation(groupedItems);

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
    queryKey: ["cards", memberId],
    queryFn: () => fetchMemberCard(memberId),
  });

  // MUTATIONS
  // [POST] 카드 등록
  const addCardMutation = useMutation({
    mutationFn: addMemberCard,
    onSuccess: () => {
      queryClient.invalidateQueries(["cards", memberId]);
      setIsCardRegistrationModalOpen(false);
    },
  });

  // [DELETE] 카드 삭제
  const deleteCardMutation = useMutation({
    mutationFn: deleteMemberCard,
    onSuccess: () => {
      queryClient.invalidateQueries(["cards", memberId]);
    },
  });

  // 주문 생성
  const createOrderMutation = useMutation({
    mutationFn: postOrder,
    onSuccess: (data, variables) => {
      // 응답 구조 확인 및 안전한 접근
      const orderDetailId = data?.data?.result?.orderDetailId;
      console.log(data);
      if (!orderDetailId) {
        console.error("Order detail ID not found in the response");
        toast.error("주문 생성 중 오류가 발생했습니다.");
        return;
      }

      const successData = {
        recipientName: selectedAddress.recipientName,
        recipientAddress: `${selectedAddress.generalAddress} ${selectedAddress.detailAddress}`,
        recipientPhoneNumber: selectedAddress.recipientPhoneNumber,
        orderMemo: orderMemo,
        totalAmount: finalPrice,
        cardInfo: cards[selectedCardIndex - 1],
        orderDetailId: orderDetailId,
        regularDeliveryApplicationId: 0,
      };
      navigate("/order-success", { state: successData });
    },
    onError: error => {
      console.error("Order creation failed:", error);
      navigate("/order-fail");
    },
  });

  const handlePlaceOrder = () => {
    if (!isPaymentEnabled) {
      if (!selectedAddress) {
        toast.error("배송지를 선택해주세요.");
      } else if (!cards || cards.length === 0 || selectedCardIndex === 0) {
        toast.error("결제 카드를 선택해주세요.");
      } else if (!consentPayment) {
        toast.error("결제 동의가 필요합니다.");
      }
      return;
    }

    const orderRequests = Object.entries(groupedItems).map(([customerId, group]) => ({
      customerId: parseInt(customerId),
      memberCouponId: selectedCoupon ? selectedCoupon.memberCouponId : null,
      storeName: group.storeName,
      productOrderList: {
        productOrderList: group.items.map(item => ({
          productId: item.productId,
          name: item.name,
          originPrice: item.originPrice,
          discountAmount: item.discountAmount,
          finalPrice: item.finalPrice,
          quantity: item.quantity,
          status: "PENDING",
        })),
      },
      recipient: {
        recipient: selectedAddress.recipientName,
        recipientPhoneNumber: selectedAddress.recipientPhoneNumber,
        recipientAddress: `${selectedAddress.generalAddress} ${selectedAddress.detailAddress}`,
      },
      originProductAmount: group.items.reduce(
        (sum, item) => sum + item.originPrice * item.quantity,
        0
      ),
      totalDiscountAmount: group.items.reduce(
        (sum, item) => sum + item.discountAmount * item.quantity,
        0
      ),
      paymentAmount:
        group.items.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0) +
        totalDeliveryFee -
        couponDiscount,
      deliveryFee: totalDeliveryFee,
      orderMemo: orderMemo,
      paymentCardId: cards[selectedCardIndex - 1].memberPaymentCardId,
    }));

    orderRequests.forEach(orderData => {
      createOrderMutation.mutate(orderData);
    });
  };

  // EVENT HANDLERS
  // 카드 추가 핸들러
  const handleAddCard = cardData => {
    addCardMutation.mutate({ memberId: memberId, ...cardData });
  };

  // 카드 삭제 핸들러
  const handleDeleteCard = memberPaymentCardId => {
    showCustomToast({
      message: "결제 수단을 삭제하시겠습니까?",
      onConfirm: () => deleteCardMutation.mutate(memberPaymentCardId),
      onCancel: () => {},
    });
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

  const isCardExpired = expirationDate => {
    const [expirationYear, expirationMonth] = expirationDate.split("-").map(Number);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    return (
      expirationYear < currentYear ||
      (expirationYear === currentYear && expirationMonth < currentMonth)
    );
  };

  // 결제 버튼 활성화 여부 확인
  useEffect(() => {
    const isValidCard =
      cards &&
      cards.length > 0 &&
      selectedCardIndex !== null &&
      selectedCardIndex > 0 &&
      cards[selectedCardIndex - 1] &&
      !isCardExpired(cards[selectedCardIndex - 1].cardExpiration);
    const isValidAddress = selectedAddress !== null;

    console.log(isValidCard);
    console.log(isValidAddress);
    console.log(consentPayment);
    setIsPaymentEnabled(isValidAddress && isValidCard && consentPayment);
  }, [selectedAddress, cards, selectedCardIndex, consentPayment]);

  useEffect(() => {
    if (addresses && addresses.length > 0 && !hasUserSelectedAddress) {
      const defaultAddress = addresses.find(address => address.isDefaultAddress === "ACTIVE");
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    }
  }, [addresses, hasUserSelectedAddress]);

  useEffect(() => {
    if (cards && cards.length > 0) {
      const defaultCardIndex = cards.findIndex(card => card.isDefaultPaymentCard === "ACTIVE");
      setSelectedCardIndex(defaultCardIndex !== -1 ? defaultCardIndex + 1 : 1);
    } else {
      setSelectedCardIndex(0);
    }
  }, [cards]);

  if (couponsLoading || memberInfoLoading || addressesLoading || cardsLoading)
    return <OrderSkeleton />;
  if (couponsError) return <CouponError message={couponsError.message} />;

  if (memberInfoError) return <MypageError message={memberInfoError.message} />;

  if (addressesError) return <AddressError message={addressesError.message} />;

  if (cardsError) return <PaymentError message={cardsError.message} />;

  return (
    <div className='flex flex-col bg-gray-50 pb-20'>
      <div className='noScrollbar flex-1 space-y-2 overflow-auto'>
        {/* 주문 아이템 */}
        <OrderItems groupedItems={groupedItems} />

        {/* 구매자 정보 */}
        <OrderMemberInfo memberInfo={memberInfo} />

        {/* 배송 메모 */}
        <DeliveryMemo onChange={setOrderMemo} />

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
          memberId={memberId}
          cards={cards}
          selectedCardIndex={selectedCardIndex}
          handlePrevCard={handlePrevCard}
          handleNextCard={handleNextCard}
          handleDeleteCard={handleDeleteCard}
          isCardRegistrationModalOpen={isCardRegistrationModalOpen}
          setIsCardRegistrationModalOpen={setIsCardRegistrationModalOpen}
          handleAddCard={handleAddCard}
          getCardColor={getCardColor}
          queryClient={queryClient}
        />

        {/* 결제 동의 */}
        <div className=''>
          <label className='flex items-center justify-center rounded-lg border bg-white p-4'>
            <input
              type='checkbox'
              onChange={handleConsentPayment}
              checked={consentPayment}
              className='checkbox mr-3 border-gray-500 [--chkbg:#00835F] [--chkfg:white] checked:border-[#00835F]'
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
        handlePlaceOrder={handlePlaceOrder}
        isPaymentEnabled={isPaymentEnabled}
      />
    </div>
  );
};

export default Order;
