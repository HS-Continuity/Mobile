import { useEffect, useState } from "react";
import { FaHome, FaChevronLeft, FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import {
  deleteCartItem,
  decrementCartItemQuantity,
  fetchCartItems,
  incrementCartItemQuantity,
  fetchCartItemsCount,
  fetchCustomerDeliveryFee,
} from "../apis/Cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "../components/Skeletons/Skeleton";
import CartSkeleton from "../components/Skeletons/CartSkeleton";

const Cart = () => {
  const memberId = import.meta.env.VITE_MEMBER_ID;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(1);
  const [checkedItems, setCheckedItems] = useState({});

  // [GET] 장바구니 아이템 조회
  const { data: cartItems, isLoading } = useQuery({
    queryKey: ["cart", memberId, activeTab],
    queryFn: () => fetchCartItems(memberId, activeTab),
  });

  // [GET] 장바구니 탭마다 상품 수량 조회
  const { data: cartNormalItemsCount, isNormalCountLoading } = useQuery({
    queryKey: ["normal", memberId, activeTab],
    queryFn: () => fetchCartItemsCount(memberId, 1),
  });
  const { data: cartRegularItemsCount, isRegularCountLoading } = useQuery({
    queryKey: ["regular", memberId, activeTab],
    queryFn: () => fetchCartItemsCount(memberId, 2),
  });

  // [GET] 판매자별 배송비 조회
  const { data: deliveryFees, isDeliveryFeeLoading } = useQuery({
    queryKey: ["fee", cartItems],
    queryFn: async () => {
      if (!cartItems) return {};
      const uniqueCustomerIds = [...new Set(cartItems.map(item => item.customerId))];
      const fees = await Promise.all(
        uniqueCustomerIds.map(async customerId => {
          const response = await fetchCustomerDeliveryFee(customerId);
          return { customerId, fee: response };
        })
      );
      return fees.reduce((acc, { customerId, fee }) => {
        acc[customerId] = fee;
        return acc;
      }, {});
    },
    enabled: !!cartItems,
  });

  useEffect(() => {
    if (cartItems) {
      const initialCheckedState = cartItems.reduce((acc, item) => {
        acc[item.cartProductId] = true;
        return acc;
      }, {});
      setCheckedItems(initialCheckedState);
    }
  }, [cartItems]);

  // [PUT] 장바구니 상품 개수 증가
  const incrementMutation = useMutation({
    mutationFn: incrementCartItemQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", memberId, activeTab]);
    },
  });

  // [PUT] 장바구니 상품 개수 감소
  const decrementMutation = useMutation({
    mutationFn: decrementCartItemQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", memberId, activeTab]);
    },
  });

  // [DELETE] 장바구니 상품 삭제
  const deleteItemMutation = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", memberId, activeTab]);
    },
  });

  const handleQuantityChange = (cartProductId, increment) => {
    if (increment) {
      incrementMutation.mutate(cartProductId);
    } else {
      decrementMutation.mutate(cartProductId);
    }
  };

  const handleDeleteItem = cartProductId => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteItemMutation.mutate(cartProductId);
    }
  };

  const groupedItems = cartItems?.reduce((acc, item) => {
    if (!acc[item.customerId]) {
      acc[item.customerId] = [];
    }
    acc[item.customerId].push(item);
    return acc;
  }, {});

  const handleCheckboxChange = id => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAllCheck = checked => {
    if (cartItems) {
      const newCheckedItems = cartItems.reduce((acc, item) => {
        acc[item.cartProductId] = checked;
        return acc;
      }, {});
      setCheckedItems(newCheckedItems);
    }
  };

  const isAllChecked =
    cartItems &&
    cartItems.length > 0 &&
    cartItems.every(item => checkedItems[item.cartProductId] === true);

  const calculateCustomerTotal = items => {
    return items.reduce((sum, item) => {
      if (checkedItems[item.cartProductId]) {
        return sum + item.productPrice * item.quantity;
      }
      return sum;
    }, 0);
  };

  const calculateTotalPrice = () => {
    if (!cartItems || !deliveryFees) return 0;

    let totalProductPrice = 0;
    let totalDeliveryFee = 0;

    Object.entries(groupedItems || {}).forEach(([customerId, items]) => {
      const customerTotal = calculateCustomerTotal(items);
      totalProductPrice += customerTotal;

      if (activeTab !== 2) {
        // 정기배송이 아닌 경우에만 배송비 추가
        const deliveryFee = deliveryFees[customerId] || 0;
        totalDeliveryFee += deliveryFee;
      }
    });

    return totalProductPrice + totalDeliveryFee;
  };

  const totalPrice = calculateTotalPrice();

  const isOrderDisabled = () => {
    if (isLoading || !cartItems || cartItems.length === 0) return true;

    const hasCheckedItems = cartItems.some(item => checkedItems[item.cartProductId]);
    const hasSoldOutCheckedItems = cartItems.some(
      item => checkedItems[item.cartProductId] && item.soldOut
    );

    return !hasCheckedItems || hasSoldOutCheckedItems;
  };

  const handleOrder = () => {
    const selectedItems = cartItems?.filter(item => checkedItems[item.cartProductId]) || [];

    if (selectedItems.length === 0) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }

    if (selectedItems.some(item => item.soldOut)) {
      alert("품절된 상품은 주문할 수 없습니다.");
      return;
    }

    const totalProductPrice = selectedItems.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );

    const calculateTotalDeliveryFee = selectedItems => {
      const customerIds = [...new Set(selectedItems.map(item => item.customerId))];
      return customerIds.reduce((total, customerId) => {
        return total + (deliveryFees[customerId] || 0);
      }, 0);
    };

    const totalDeliveryFee = activeTab === 2 ? 0 : calculateTotalDeliveryFee(selectedItems);

    navigate(activeTab === 2 ? "/subscription-setup" : "/order", {
      state: {
        orderItems: selectedItems,
        totalProductPrice: totalProductPrice,
        totalDeliveryFee: totalDeliveryFee,
      },
    });
  };
  return (
    <div className='noScrollbar flex h-screen flex-col bg-gray-100'>
      {/* 장바구니 헤더 */}
      <div className='flex items-center bg-[#00835F] p-4 text-white'>
        <FaChevronLeft className='mr-4 cursor-pointer' onClick={() => navigate(-1)} />
        <FaHome className='mr-4 cursor-pointer' onClick={() => navigate("/")} />
        <h1 className='text-xl font-bold'>장바구니</h1>
      </div>

      {/* 배송 탭 */}
      <div className='flex border-b'>
        <button
          className={`flex-1 py-2 ${activeTab === 1 ? "border-b-2 border-emerald-600 text-[#00835F]" : ""}`}
          onClick={() => setActiveTab(1)}>
          일반 ({cartNormalItemsCount})
        </button>
        <button
          className={`flex-1 py-2 ${activeTab === 2 ? "border-b-2 border-emerald-600 text-[#00835F]" : ""}`}
          onClick={() => setActiveTab(2)}>
          정기배송 ({cartRegularItemsCount})
        </button>
      </div>

      {/* 체크박스 전체 선택 */}
      <div className='bg-white p-4'>
        {!isLoading && cartItems && cartItems.length > 0 && (
          <label className='flex items-center'>
            <input
              type='checkbox'
              className='checkbox-primary checkbox mr-2'
              checked={isAllChecked}
              onChange={e => handleAllCheck(e.target.checked)}
            />
            <span>전체 선택</span>
          </label>
        )}
      </div>

      {/* 장바구니 아이템 */}
      <div className='noScrollbar flex-1 overflow-auto p-4'>
        {isLoading || isDeliveryFeeLoading ? (
          <>
            <CartSkeleton />
            <CartSkeleton />
          </>
        ) : cartItems && cartItems.length > 0 ? (
          Object.entries(groupedItems || {}).map(([customerId, items]) => (
            <div key={customerId} className='mb-4 rounded-lg bg-white p-4 shadow'>
              <h3 className='mb-2 font-bold'>{items[0].storeName}</h3>
              {items.map(item => (
                <div key={item.cartProductId} className='mb-4 flex items-center border-b pb-4'>
                  <input
                    type='checkbox'
                    className='checkbox-primary checkbox mr-2'
                    checked={checkedItems[item.cartProductId] === true}
                    onChange={() => handleCheckboxChange(item.cartProductId)}
                  />
                  <Link to={`/product/${item.productId}`} className='mr-4'>
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className='h-20 w-20 rounded object-cover'
                    />
                  </Link>
                  <div className='flex-grow'>
                    <Link to={`/product/${item.productId}`}>
                      <h4 className='font-bold'>{item.productName}</h4>
                    </Link>

                    <div className='flex items-center justify-between'>
                      <div>
                        {item.productDiscountRate > 0 && (
                          <span className='font-bold text-red-500'>
                            {item.productDiscountRate}%{" "}
                          </span>
                        )}
                        <span className='font-bold'>{item.productPrice.toLocaleString()}원 </span>
                        <span className='font-bold text-gray-400 line-through'>
                          {item.productBasePrice.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                    <div className='mt-2 flex items-center justify-between'>
                      <button
                        className='btn btn-circle btn-outline btn-sm'
                        onClick={() => handleDeleteItem(item.cartProductId)}
                        disabled={deleteItemMutation.isLoading}>
                        <FaTrash />
                      </button>
                      <div className='flex items-center'>
                        <button
                          onClick={() => handleQuantityChange(item.cartProductId, false)}
                          className='btn btn-circle btn-sm'
                          disabled={
                            item.quantity <= 1 || item.soldOut || decrementMutation.isLoading
                          }>
                          <FaMinus />
                        </button>
                        <span className='mx-2'>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.cartProductId, true)}
                          className='btn btn-circle btn-sm'
                          disabled={item.soldOut || incrementMutation.isLoading}>
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                    {item.soldOut && <p className='mt-2 text-red-500'>품절</p>}
                  </div>
                </div>
              ))}
              <div className='mt-2 text-center'>
                {(() => {
                  const customerTotal = calculateCustomerTotal(items);
                  const deliveryFee =
                    deliveryFees && deliveryFees[customerId] ? deliveryFees[customerId] : 0;
                  return (
                    <>
                      <p>상품금액 : {customerTotal.toLocaleString()}원</p>
                      {activeTab === 2 ? (
                        <p className='text-red-600 line-through'>
                          배송비 : {deliveryFee.toLocaleString()}원
                        </p>
                      ) : (
                        <p>배송비 : {deliveryFee.toLocaleString()}원</p>
                      )}

                      {activeTab === 2 ? (
                        <p className='font-bold'>총 금액 : {customerTotal.toLocaleString()}원</p>
                      ) : (
                        <p className='font-bold'>
                          총 금액 : {(customerTotal + deliveryFee).toLocaleString()}원
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          ))
        ) : (
          <p>장바구니가 비어있습니다.</p>
        )}
      </div>

      {/* 주문 금액 */}
      <div className='bg-white p-4'>
        {isLoading ? (
          <>
            <Skeleton className='mb-2 h-6 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </>
        ) : (
          <div className='mb-2 flex justify-between'>
            <span>총 주문금액</span>
            <span className='font-bold'>{totalPrice.toLocaleString()}원</span>
          </div>
        )}
      </div>

      {/* 주문 버튼 */}
      <button
        className={`p-4 text-lg font-bold text-white ${
          isOrderDisabled() ? "bg-gray-400" : "bg-[#00835F]"
        }`}
        disabled={isOrderDisabled()}
        onClick={handleOrder}>
        {activeTab === 2 ? "정기 배송 신청하기" : "주문하기"}
      </button>
    </div>
  );
};

export default Cart;
