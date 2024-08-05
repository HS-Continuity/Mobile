import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMemberOrderDetail, patchOrderStatus } from "../../apis";
import { BsHouse } from "react-icons/bs";

import getStatusText from "../../components/Order/GetStatusText";
import getStatusStyle from "../../components/Order/GetStatusStyle";
import OrderDetailSkeleton from "../../components/Skeletons/OrderDetailSkeleton";
import { OrderDetailError } from "../../components/Errors/ErrorDisplay";
import { showCustomToast } from "../../components/Toast/ToastDisplay";
import { FaLeaf } from "react-icons/fa";

const OrderDetail = () => {
  const { orderDetailId } = useParams();

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orderdetail", String(orderDetailId)],
    queryFn: () => fetchMemberOrderDetail(String(orderDetailId)),
  });

  const order = data?.data?.result;

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId, productId, orderStatusCode) =>
      patchOrderStatus(orderId, productId, orderStatusCode),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["orderdetail", orderDetailId], oldData => {
        if (!oldData) return oldData;

        const updatedOrder = {
          ...oldData,
          data: {
            result: {
              ...oldData.data.result,
              status: variables.orderStatusCode,
              productOrderList: {
                productOrderList: oldData.data.result.productOrderList.productOrderList.map(
                  product =>
                    product.productId === variables.productId
                      ? { ...product, status: variables.orderStatusCode }
                      : product
                ),
              },
            },
          },
        };
        return updatedOrder;
      });
      queryClient.invalidateQueries(["orderdetail", orderDetailId]);
      toast.success("주문이 성공적으로 취소되었습니다.");
    },
    onError: error => {
      console.error("주문 취소 중 오류 발생:", error);
      toast.error("주문 취소 중 오류가 발생했습니다. 다시 시도해 주세요.");
    },
  });

  if (!order) {
    return (
      <div className='flex h-screen items-center justify-center'>주문 정보를 찾을 수 없습니다.</div>
    );
  }

  const formatPrice = price => price.toLocaleString() + "원";
  const formatDate = dateString => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
      date.getDate()
    ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  const totalPrice = order.productOrderList.productOrderList.reduce(
    (sum, product) => sum + product.finalPrice * product.quantity,
    0
  );
  const totalDiscountAmount = order.productOrderList.productOrderList.reduce(
    (sum, product) => sum + product.discountAmount * product.quantity,
    0
  );

  const renderActionButtons = (status, orderDetailId, productId) => {
    const buttons = [];

    switch (status) {
      case "DELIVERED":
        buttons.push(
          <button
            key='cancel'
            className='btn btn-sm h-10 w-full flex-1 bg-transparent hover:bg-white'
            onClick={() => handleCancelOrder(orderDetailId, productId, "REFUND_REQUEST")}>
            환불 요청
          </button>
        );
        buttons.push(
          <Link
            key='review'
            to={`/reviewapply/${productId}`}
            className='btn btn-sm h-10 w-full flex-1 border bg-white text-[#00835F] hover:bg-white'>
            리뷰 작성
          </Link>
        );
        break;
      case "SHIPPED":
        buttons.push(
          <button
            key='track'
            className='btn btn-sm h-10 w-full flex-1 bg-green-shine text-white hover:bg-green-shine'>
            배송 조회
          </button>
        );
        break;
      case "IN_DELIVERY":
        buttons.push(
          <button
            key='track'
            className='btn btn-sm h-10 w-full flex-1 bg-green-shine text-white hover:bg-green-shine'>
            배송 조회
          </button>
        );
        break;
      case "PENDING":
      case "PAYMENT_COMPLETED":
        buttons.push(
          <button
            key='cancel'
            className='btn btn-sm h-10 w-full flex-1 bg-transparent hover:bg-white'
            onClick={() => handleCancelOrder(orderDetailId, productId, "CANCELED")}>
            결제 취소
          </button>
        );
        break;
      case "AWAITING_RELEASE":
      case "PREPARING_PRODUCT":
        break;
      default:
        return null;
    }

    return buttons;
  };

  const handleCancelOrder = (orderDetailId, productId, orderStatusCode) => {
    showCustomToast({
      message: "주문을 취소하시겠습니까?",
      onConfirm: () =>
        cancelOrderMutation.mutate({
          orderId: orderDetailId,
          productId: productId,
          orderStatusCode: orderStatusCode,
        }),
      onCancel: () => {},
    });
  };

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }
  if (isError || error) {
    return <OrderDetailError />;
  }

  return (
    <div className='container mx-auto max-w-2xl p-4 pb-12'>
      <div className='mb-2 rounded-lg border p-4'>
        <div className='flex justify-between'>
          <span className='font-semibold'>No. {order.orderDetailId}</span>
          <div className='text-sm text-gray-500'>
            <span className='font-light'> {formatDate(order.orderDate)}</span>
          </div>
        </div>

        <div className='mt-2 flex items-center justify-between text-sm text-gray-500'>
          <div className='mt-[2px] flex'>
            <BsHouse className='mt-[2px] text-lg' />
            <h3 className='ml-2 mt-[2px]'>{order.storeName}</h3>
          </div>
          <div
            className={`rounded bg-gradient-shine px-2 py-1 text-sm font-semibold ${getStatusStyle(order.status).bg} ${getStatusStyle(order.status).text}`}>
            {getStatusText(order.status)}
          </div>
        </div>
      </div>

      <div className='rounded-lg border p-4'>
        <h2 className='mb-2 text-xl font-semibold'>배송 정보</h2>
        <hr className='mb-3 border-gray-200' />
        <div className='space-y-1'>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>받는 분</span>
            <span>{order.recipient.recipient}</span>
          </div>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>전화번호</span>
            <span>{order.recipient.recipientPhoneNumber}</span>
          </div>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>배송지</span>
            <span>{order.recipient.recipientAddress}</span>
          </div>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>배송방법</span>
            <span>{order.orderMemo}</span>
          </div>
        </div>
      </div>

      <div className='mb-2 mt-2 space-y-4 rounded-lg border p-4'>
        <h2 className='text-lg font-semibold'>주문 상품</h2>
        {order.productOrderList.productOrderList.map((product, index) => (
          <div key={index} className='flex flex-col border-t border-gray-100 pt-4'>
            <div className='flex items-start'>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name || "상품 이미지"}
                  className='h-20 w-20 object-cover'
                  onError={e => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : (
                <div
                  className='flex h-20 w-20 items-center justify-center bg-gradient-to-br from-green-100 to-green-200'
                  style={{ display: order.image ? "none" : "flex" }}>
                  <FaLeaf className='mx-auto mb-2 text-4xl text-green-500' />
                </div>
              )}
              <div className='ml-3 flex-grow'>
                <p className='font-medium'>{product.name}</p>
                <div className='text-sm'>
                  {formatPrice(product.finalPrice)} | {product.quantity}개
                </div>
              </div>
              <div className={`text-sm ${getStatusStyle(product.status).text}`}>
                {getStatusText(product.status)}
              </div>
            </div>
            <div className='mt-3 flex gap-2'>
              {renderActionButtons(product.status, order.orderDetailId, product.productId)}
            </div>
          </div>
        ))}
      </div>

      <div className='mb-8 rounded-lg border p-4 shadow-sm'>
        <h2 className='mb-4 text-xl font-semibold'>결제 정보</h2>
        <div className='space-y-2'>
          <div className='flex justify-between'>
            <span>상품 금액</span>
            <span>{formatPrice(totalPrice + totalDiscountAmount)}</span>
          </div>
          <div className='flex justify-between'>
            <span>할인 금액</span>
            <span className='text-red-500'>- {formatPrice(totalDiscountAmount)}</span>
          </div>
          <div className='flex justify-between border-t pt-2 font-bold'>
            <span>총 결제 금액</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
