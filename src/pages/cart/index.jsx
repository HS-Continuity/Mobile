import { useEffect, useState } from "react";
import {
  deleteCartItem,
  decrementCartItemQuantity,
  fetchCartItems,
  incrementCartItemQuantity,
  fetchCartItemsCount,
  fetchCustomerDeliveryFee,
} from "../../apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import CartSkeleton from "../../components/Skeletons/CartSkeleton";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import useAuthStore from "../../stores/useAuthStore";
import { FaLeaf } from "react-icons/fa";
import EmptyCart from "./EmptyCart";

const Cart = () => {
  const { username } = useAuthStore();
  const memberId = username;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(1);
  const [checkedItems, setCheckedItems] = useState({});
  const [imgError, setImgError] = useState(false);

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
        acc[item.cartProductId] = !item.soldOut;
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

  // 이미지 에러 핸들러
  const handleImageError = () => {
    setImgError(true);
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

    // Group selected items by customerId
    const groupedItems = selectedItems.reduce((acc, item) => {
      if (!acc[item.customerId]) {
        acc[item.customerId] = {
          items: [],
          storeName: item.storeName, // 각 그룹에 storeName 추가
        };
      }
      acc[item.customerId].items.push({
        productId: item.productId,
        name: item.productName,
        originPrice: item.productBasePrice,
        discountAmount: item.productBasePrice - item.productPrice,
        finalPrice: item.productPrice,
        quantity: item.quantity,
        status: "PENDING",
      });
      return acc;
    }, {});

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
        groupedItems: groupedItems,
        totalProductPrice: totalProductPrice,
        totalDeliveryFee: totalDeliveryFee,
      },
    });
  };

  return (
    <div className='noScrollbar flex flex-col bg-gray-50 pb-12'>
      {/* 배송 탭 */}
      <div className='flex border-b bg-white'>
        <button
          className={`flex-1 py-2 font-bold ${activeTab === 1 ? "border-b-2 border-emerald-600 text-[#00835F]" : ""}`}
          onClick={() => setActiveTab(1)}>
          일반 ({cartNormalItemsCount})
        </button>
        <button
          className={`flex-1 py-2 font-bold ${activeTab === 2 ? "border-b-2 border-emerald-600 text-[#00835F]" : ""}`}
          onClick={() => setActiveTab(2)}>
          정기배송 ({cartRegularItemsCount})
        </button>
      </div>

      {/* 장바구니 아이템 */}
      <div className='noScrollbar flex-1 overflow-auto bg-gray-50 p-2'>
        {isLoading || isDeliveryFeeLoading ? (
          <>
            <CartSkeleton />
            <CartSkeleton />
          </>
        ) : cartItems && cartItems.length > 0 ? (
          <>
            {/* 체크박스 전체 선택 */}
            <div className='-mt-2 mb-2 bg-white px-6 py-3'>
              {!isLoading && cartItems && cartItems.length > 0 && (
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={isAllChecked}
                    onChange={e => handleAllCheck(e.target.checked)}
                    className='checkbox mr-3 border-gray-500 [--chkbg:#00835F] [--chkfg:white] checked:border-[#00835F]'
                  />
                  {/* <input
                    type='checkbox'
                    className='checkbox-primary checkbox mr-2'
                    checked={isAllChecked}
                    onChange={e => handleAllCheck(e.target.checked)}
                  /> */}
                  <span>전체 선택</span>
                </label>
              )}
            </div>
            {Object.entries(groupedItems || {}).map(([customerId, items]) => (
              <div key={customerId} className='mb-4 rounded-lg bg-white p-4 shadow-sm'>
                <h3 className='mb-2 font-bold'>{items[0].storeName}</h3>
                {items.map(item => (
                  <div
                    key={item.cartProductId}
                    className='relative mb-2 flex items-start border-b p-2'>
                    <input
                      type='checkbox'
                      checked={checkedItems[item.cartProductId] === true}
                      onChange={() => handleCheckboxChange(item.cartProductId)}
                      className='checkbox mr-3 border-gray-500 [--chkbg:#00835F] [--chkfg:white] checked:border-[#00835F]'
                    />
                    {/* <input
                      type='checkbox'
                      className='checkbox-primary checkbox mr-2 mt-1'
                      checked={checkedItems[item.cartProductId] === true}
                      onChange={() => handleCheckboxChange(item.cartProductId)}
                    /> */}
                    <Link to={`/product/${item.productId}`} className='mr-4'>
                      {!imgError ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className='h-20 w-20 rounded object-cover'
                          onError={handleImageError}
                        />
                      ) : (
                        <div className='flex h-20 w-20 items-center justify-center bg-gradient-to-br from-green-100 to-green-200'>
                          <FaLeaf className='mx-auto mb-2 text-4xl text-green-500' />
                        </div>
                      )}
                    </Link>
                    <div className='mt-2 flex-grow'>
                      <div className='flex justify-between'>
                        <Link to={`/product/${item.productId}`}>
                          <h4 className='font-bold'>{item.productName}</h4>
                        </Link>
                        <button
                          className='text-gray-500 hover:text-red-500'
                          onClick={() => handleDeleteItem(item.cartProductId)}
                          disabled={deleteItemMutation.isLoading}>
                          <GoTrash />
                        </button>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div>
                          <span className='font-normal'>
                            {item.productPrice.toLocaleString()}원{" "}
                          </span>
                          <span className='text-xs font-normal text-gray-400 line-through'>
                            {item.productBasePrice.toLocaleString()}원
                          </span>
                        </div>
                        <div className='flex items-center rounded-md border'>
                          <button
                            onClick={() => handleQuantityChange(item.cartProductId, false)}
                            className={`${item.quantity == 1 || item.soldOut ? "bg-gray-100 hover:bg-gray-100" : ""} px-2 py-2 text-gray-500 hover:bg-gray-100`}
                            disabled={
                              item.quantity == 1 || item.soldOut || decrementMutation.isLoading
                            }>
                            <AiOutlineMinus />
                          </button>
                          <input
                            type='text'
                            value={item.soldOut ? "품절" : item.quantity}
                            readOnly
                            className={`w-12 border-none text-center focus:outline-none ${item.soldOut ? "text-red-300" : ""}`}
                          />
                          <button
                            onClick={() => handleQuantityChange(item.cartProductId, true)}
                            className={`${item.soldOut && "bg-gray-100 hover:bg-gray-100"} px-3 py-2 text-gray-500 hover:bg-gray-100`}
                            disabled={item.soldOut || incrementMutation.isLoading}>
                            <AiOutlinePlus />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className='mt-2 flex-col justify-center text-center'>
                  {(() => {
                    const customerTotal = calculateCustomerTotal(items);
                    const deliveryFee =
                      deliveryFees && deliveryFees[customerId] ? deliveryFees[customerId] : 0;
                    return (
                      <>
                        {activeTab === 2 ? (
                          <div className='mt-1 flex items-center justify-center'>
                            <p className='text-sm font-bold'>주문 금액 {"\u00A0"}</p>
                            <p className='text-lg font-bold'> {customerTotal.toLocaleString()}</p>원
                          </div>
                        ) : (
                          <div className='mt-1 flex items-center justify-center'>
                            <p className='text-sm font-bold'>주문 금액 {"\u00A0"}</p>
                            <p className='text-lg font-bold'>
                              {(customerTotal + deliveryFee).toLocaleString()}
                            </p>
                            원
                          </div>
                        )}
                        <div className='flex items-center justify-center'>
                          <p className='text-sm'>{customerTotal.toLocaleString()}원 + </p>
                          {activeTab === 2 ? (
                            <p className='text-xs text-red-600 line-through'>
                              배송비 {deliveryFee.toLocaleString()}원
                            </p>
                          ) : (
                            <p className='text-xs'>배송비 {deliveryFee.toLocaleString()}원</p>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            ))}
          </>
        ) : (
          <EmptyCart />
        )}
      </div>

      {/* 주문 버튼 */}
      <div className='fixed bottom-0 left-0 right-0 flex justify-center bg-gray-50'>
        <div className='main-container w-full'>
          <button
            className={`w-full p-4 text-lg font-bold text-white ${
              isOrderDisabled() ? "bg-gray-400" : "bg-green-shine"
            }`}
            disabled={isOrderDisabled()}
            onClick={handleOrder}>
            {activeTab === 2 ? "정기 배송 신청하기" : `${totalPrice.toLocaleString()}원 주문하기`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
