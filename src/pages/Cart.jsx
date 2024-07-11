import { useEffect, useState } from "react";
import { FaHome, FaChevronLeft, FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { deleteCartItem, fetchCartItems, updateCartItem } from "../apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Skeleton from "../components/Skeletons/Skeleton";
import CartSkeleton from "../components/Skeletons/CartSkeleton";

const Cart = () => {
  // Member id = 1
  const member_id = 1;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("regular");
  const [checkedItems, setCheckedItems] = useState({});

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => fetchCartItems(member_id),
  });

  // 초기 모든 장바구니 아이템 체크
  useEffect(() => {
    if (cartItems) {
      const initialCheckedState = cartItems.reduce((acc, item) => {
        acc[item.id] = true;
        return acc;
      }, {});
      setCheckedItems(initialCheckedState);
    }
  }, [cartItems]);

  // [UPDATE] 장바구니 상품 수량 수정 쿼리
  const updateItemMutation = useMutation({
    mutationFn: updateCartItem,
    onMutate: async ({ id, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], old =>
        old.map(item => (item.id === id ? { ...item, quantity } : item))
      );
      return { previousCart };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["cart"], context.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // [DELETE] 장바구니 상품 삭제 쿼리
  const deleteItemMutation = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries("cart");
    },
  });

  // 장바구니 상품 수량 변경 Handler
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      updateItemMutation.mutate({ id, quantity: newQuantity });
    }
  };

  // 장바구니 상품 삭제 Handler
  const handleDeleteItem = id => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteItemMutation.mutate(id);
    }
  };

  const filteredItems = cartItems?.filter(item => item.cart_type_id === activeTab) || [];

  const regularCount = cartItems?.filter(item => item.cart_type_id === "regular").length || 0;
  const subscriptionCount =
    cartItems?.filter(item => item.cart_type_id === "subscription").length || 0;

  const handleCheckboxChange = id => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAllCheck = checked => {
    const newCheckedItems = filteredItems.reduce((acc, item) => {
      acc[item.id] = checked;
      return acc;
    }, {});
    setCheckedItems(prev => ({ ...prev, ...newCheckedItems }));
  };

  const totalPrice = filteredItems
    .filter(item => checkedItems[item.id])
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = () => {
    const selectedItems = filteredItems.filter(item => checkedItems[item.id]);
    if (activeTab === "regular" && selectedItems.length > 0) {
      navigate("/order", { state: { orderItems: selectedItems } });
    } else if (activeTab === "subscription" && selectedItems.length > 0) {
      navigate("/subscription-setup", { state: { orderItems: selectedItems } });
    } else {
      alert("주문할 상품을 선택해주세요.");
    }
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
          className={`flex-1 py-2 ${activeTab === "regular" ? "border-b-2 border-emerald-600 text-[#00835F]" : ""}`}
          onClick={() => setActiveTab("regular")}>
          일반({regularCount})
        </button>
        <button
          className={`flex-1 py-2 ${activeTab === "subscription" ? "border-b-2 border-emerald-600 text-[#00835F]" : ""}`}
          onClick={() => setActiveTab("subscription")}>
          정기배송({subscriptionCount})
        </button>
      </div>

      {/* 체크박스 전체 선택 */}
      <div className='bg-white p-4'>
        <label className='flex items-center'>
          <input
            type='checkbox'
            className='checkbox-primary checkbox mr-2'
            checked={filteredItems.every(item => checkedItems[item.id])}
            onChange={e => handleAllCheck(e.target.checked)}
          />
          <span>전체 선택</span>
        </label>
      </div>

      {/* 장바구니 아이템 */}
      <div className='noScrollbar flex-1 overflow-auto p-4'>
        {isLoading ? (
          <>
            <CartSkeleton />
            <CartSkeleton />
          </>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className='mb-4 flex rounded-lg bg-white p-4 shadow'>
              <img
                src={item.image}
                alt={item.name}
                className='mr-4 h-20 w-20 rounded object-cover'
              />
              <div className='flex-grow'>
                <div className='mb-2 flex items-center'>
                  <input
                    type='checkbox'
                    className='checkbox-primary checkbox mr-2'
                    checked={checkedItems[item.id] || false}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                  <h3 className='font-bold'>{item.name}</h3>
                </div>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-lg font-bold'>{item.price.toLocaleString()}원</p>
                    <p className='text-sm text-gray-500 line-through'>
                      {item.originalPrice.toLocaleString()}원
                    </p>
                    <button
                      className='btn btn-circle btn-outline btn-sm'
                      onClick={() => handleDeleteItem(item.id)}>
                      <FaTrash />
                    </button>
                  </div>
                  <div className='flex items-center'>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className='btn btn-circle btn-sm'>
                      <FaMinus />
                    </button>
                    <span className='mx-2'>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className='btn btn-circle btn-sm'>
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
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
          <>
            <div className='mb-2 flex justify-between'>
              <span>주문금액</span>
              <span className='font-bold'>{totalPrice.toLocaleString()}원</span>
            </div>
            <div className='flex justify-between text-sm text-gray-500'>
              <span>배송비</span>
              <span>0원</span>
            </div>
          </>
        )}
      </div>

      {/* 주문 버튼 */}
      <button
        className={`bg-[#00835F] p-4 text-lg font-bold text-white ${filteredItems.filter(item => checkedItems[item.id]).length === 0 ? "bg-gray-400" : ""}`}
        disabled={isLoading || filteredItems.filter(item => checkedItems[item.id]).length === 0}
        onClick={handleOrder}>
        {activeTab === "subscription" ? "정기 배송 신청하기" : "주문하기"}
      </button>
    </div>
  );
};

export default Cart;
