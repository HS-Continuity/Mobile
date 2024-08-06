import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addMemberCard,
  deleteCartItem,
  deleteMemberCard,
  fetchMemberAddresses,
  fetchMemberCard,
  fetchMemberCoupon,
  fetchMemberInfo,
  postSubscriptionOrder,
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
import DeliveryMemo from "../../components/Order/DeliveryMemo";
import SubscriptionInfo from "../../components/Order/SubscriptionInfo";
import OrderSkeleton from "../../components/Skeletons/OrderSkeleton";
import toast from "react-hot-toast";
import { showCustomToast } from "../../components/Toast/ToastDisplay";
import {
  AddressError,
  CouponError,
  MypageError,
  PaymentError,
} from "../../components/Errors/ErrorDisplay";

const SubscriptionOrder = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  // 주문 아이템
  const {
    groupedItems,
    totalProductPrice,
    totalDeliveryFee,
    subscriptionDetails,
    selectedCartProductIds,
  } = location.state || {
    groupedItems: {},
    totalProductPrice: 0,
    totalDeliveryFee: 0,
    subscriptionDetails: {},
  };
  // 쿠폰
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  // 받는 사람
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // 배송 메모
  const [orderMemo, setOrderMemo] = useState("");

  // 결제 수단
  const [consentPayment, setConsentPayment] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [isCardRegistrationModalOpen, setIsCardRegistrationModalOpen] = useState(false);

  // 카드 색깔 전역 변수
  const getCardColor = useCardColorStore(state => state.getCardColor);

  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);
  const [hasUserSelectedAddress, setHasUserSelectedAddress] = useState(false);

  // const { subscriptionDetails } = useSubscriptionSetupStore();

  useOrderItemsValidation(groupedItems);
  useCheckSubscriptionDetails(subscriptionDetails);

  // 설정 값
  const { username } = useAuthStore();
  const memberId = username;
  const couponDiscount = selectedCoupon ? selectedCoupon.discountAmount : 0;
  const finalPrice = totalProductPrice - couponDiscount;

  const createOrderMutation = useMutation({
    mutationFn: postSubscriptionOrder,
    onSuccess: (data, variables) => {
      console.log(data.data.result.regularDeliveryApplicationId);
      const successData = {
        recipientName: selectedAddress.recipientName,
        recipientAddress: `${selectedAddress.generalAddress} ${selectedAddress.detailAddress}`,
        recipientPhoneNumber: selectedAddress.recipientPhoneNumber,
        orderMemo: orderMemo,
        totalAmount: finalPrice,
        cardInfo: cards[selectedCardIndex - 1],
        orderDetailId: 0,
        regularDeliveryApplicationId: data.data.result.regularDeliveryApplicationId,
      };
      navigate("/order-success", { state: successData });
    },
    onError: () => {
      navigate("/order-fail");
    },
  });

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

  // [DELETE] 장바구니 개별 삭제
  const deleteCartItemMutation = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", memberId]);
    },
    onError: error => {
      console.error("Failed to delete cart item:", error);
    },
  });

  const isCardExpired = expirationDate => {
    const [expirationYear, expirationMonth] = expirationDate.split("-").map(Number);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줍니다.

    // 년도가 현재보다 크거나, 년도가 같고 월이 현재 이상이면 만료되지 않은 것
    return (
      expirationYear < currentYear ||
      (expirationYear === currentYear && expirationMonth < currentMonth)
    );
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

  useEffect(() => {
    const isValidCard =
      cards &&
      cards.length > 0 &&
      selectedCardIndex !== null &&
      selectedCardIndex > 0 &&
      cards[selectedCardIndex - 1] &&
      !isCardExpired(cards[selectedCardIndex - 1].cardExpiration);
    const isValidAddress = selectedAddress !== null;

    setIsPaymentEnabled(isValidAddress && isValidCard && consentPayment);
  }, [selectedAddress, cards, selectedCardIndex, consentPayment]);

  if (couponsLoading || memberInfoLoading || addressesLoading || cardsLoading)
    return <OrderSkeleton />;

  if (couponsError) return <CouponError message={couponsError.message} />;

  if (memberInfoError) return <MypageError message={memberInfoError.message} />;

  if (addressesError) return <AddressError message={addressesError.message} />;

  if (cardsError) return <PaymentError message={cardsError.message} />;

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

    const convertDeliveryCycle = cycle => {
      return cycle.replace(/[^0-9]/g, "");
    };

    const convertDayOfWeek = day => {
      const dayMap = {
        월: "MONDAY",
        화: "TUESDAY",
        수: "WEDNESDAY",
        목: "THURSDAY",
        금: "FRIDAY",
        토: "SATURDAY",
        일: "SUNDAY",
      };
      return dayMap[day] || day;
    };

    const orderRequests = Object.entries(groupedItems).map(([customerId, group]) => ({
      customerId: parseInt(customerId),
      memberId: memberId,
      memberCouponId: selectedCoupon ? selectedCoupon.memberCouponId : null,
      orderMemo: orderMemo,
      paymentCardId: cards[selectedCardIndex - 1].memberPaymentCardId,
      productOrderList: {
        productOrderList: group.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
      deliveryPeriod: {
        startDate: subscriptionDetails.startDate,
        endDate: subscriptionDetails.endDate,
        deliveryCycle: parseInt(convertDeliveryCycle(subscriptionDetails.deliveryCycle)),
        deliveryDayOfWeeks: subscriptionDetails.deliveryDayOfWeeks.map(convertDayOfWeek),
      },
      recipient: {
        recipient: selectedAddress.recipientName,
        recipientPhoneNumber: selectedAddress.recipientPhoneNumber,
        recipientAddress: `${selectedAddress.generalAddress} ${selectedAddress.detailAddress}`,
      },
    }));

    // orderRequests.forEach(orderData => {
    //   createOrderMutation.mutate(orderData);
    // });

    // 주문 생성
    Promise.all(orderRequests.map(orderData => createOrderMutation.mutateAsync(orderData)))
      .then(() => {
        // 주문 완료 후 장바구니 아이템 개별 삭제
        if (selectedCartProductIds.length > 0) {
          return Promise.all(
            selectedCartProductIds.map(id => deleteCartItemMutation.mutateAsync(id))
          );
        }
      })
      .then(() => {})
      .catch(error => {
        console.error("Error during order process:", error);
      });
  };

  return (
    <div className='noScrollbar flex h-screen flex-col bg-gray-50 pb-16'>
      <div className='noScrollbar flex-1 space-y-2 overflow-auto'>
        {/* 주문 아이템 */}
        <OrderItems groupedItems={groupedItems} />

        {/* 배송 주기 */}
        <SubscriptionInfo subscriptionDetails={subscriptionDetails} />

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
          regularShippingDiscount={true}
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

export default SubscriptionOrder;
