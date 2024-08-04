import { useState } from "react";
import CardRegisterModal from "../../components/Order/CardRegisterModal";
import { FaPlus, FaCreditCard } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addMemberCard, deleteMemberCard, fetchMemberCard, putDefaultCard } from "../../apis";
import useCardColorStore from "../../stores/useCardColorStore";
import { FiTrash2 } from "react-icons/fi";
import useAuthStore from "../../stores/useAuthStore";
import NoCard from "./NoCard";
import PaymentSkeleton from "../../components/Skeletons/PaymentSkeleton";
import { PaymentError } from "../../components/Errors/ErrorDisplay";
import { showCustomToast } from "../../components/Toast/ToastDisplay";
import maskDigits from "../../components/Order/MaskDigits";

const Payment = () => {
  const { username } = useAuthStore();
  const memberId = username;
  const queryClient = useQueryClient();
  const getCardColor = useCardColorStore(state => state.getCardColor);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const {
    data: cards,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cards", memberId],
    queryFn: () => fetchMemberCard(memberId),
  });

  const addCardMutation = useMutation({
    mutationFn: addMemberCard,
    onSuccess: () => {
      queryClient.invalidateQueries(["cards"]);
      setIsRegisterModalOpen(false);
    },
  });

  const putDefaultCardMutation = useMutation({
    mutationFn: ({ memberPaymentCardId, memberId }) =>
      putDefaultCard(memberPaymentCardId, memberId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["cards", memberId], oldData => {
        return oldData.map(card => ({
          ...card,
          isDefaultPaymentCard:
            card.memberPaymentCardId === variables.memberPaymentCardId ? "ACTIVE" : "INACTIVE",
        }));
      });
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: deleteMemberCard,
    onSuccess: () => {
      queryClient.invalidateQueries(["cards"]);
    },
  });

  const handleAddCard = async cardData => {
    if (cards && cards.length < 3) {
      try {
        await addCardMutation.mutateAsync({ memberId: memberId, ...cardData });
        setIsRegisterModalOpen(false);
      } catch (error) {
        console.error("결제수단을 3개 이상 추가할 수 없습니다.");
      }
    }
  };

  const handleSetDefaultCard = memberPaymentCardId => {
    putDefaultCardMutation.mutate({ memberPaymentCardId, memberId });
  };

  const handleDeleteCard = memberPaymentCardId => {
    showCustomToast({
      message: "카드를 삭제하시겠습니까?",
      onConfirm: () => deleteCardMutation.mutate(memberPaymentCardId, memberId),
      onCancel: () => {},
    });
  };

  if (isLoading) return <PaymentSkeleton />;
  if (isError) return <PaymentError />;

  const canAddCard = cards && cards.length < 3;

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-6 text-xl font-semibold'>
        {cards && cards.length > 0 ? `등록 카드 ${cards.length} / 3` : "등록된 카드"}
      </h1>
      {cards && cards.length > 0 ? (
        <div className='space-y-4'>
          {cards.map(card => (
            <div
              key={card.memberPaymentCardId}
              className='card bg-base-100 transition-colors duration-200'>
              <div className='card-body rounded-2xl border border-gray-200 p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <div
                      className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-shine'
                      style={{ backgroundColor: getCardColor(card.cardCompany) }}>
                      <FaCreditCard className='text-xl text-white' />
                    </div>
                    <div>
                      <h2 className='card-title text-lg'>{card.cardCompany}</h2>
                      <p className='text-sm text-gray-600'>{maskDigits(card.cardNumber)}</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    {card.isDefaultPaymentCard === "ACTIVE" ? (
                      <span className='btn btn-xs ml-2 cursor-default bg-green-shine text-sm text-white hover:bg-green-shine'>
                        대표카드
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefaultCard(card.memberPaymentCardId)}
                        className='btn btn-xs ml-2 border border-gray-300 bg-white text-sm hover:bg-white'>
                        대표 카드로 설정
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteCard(card.memberPaymentCardId)}
                      className='btn btn-circle btn-sm ml-2 border border-gray-300 bg-white text-sm hover:bg-white'>
                      <FiTrash2 className='text-gray-400' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoCard onAddCard={() => setIsRegisterModalOpen(true)} />
      )}
      {canAddCard && (
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className='btn mt-6 w-full bg-green-shine text-base text-white hover:bg-green-shine'>
          <FaPlus className='mr-2 text-base text-white' /> 카드 추가
        </button>
      )}

      <CardRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSubmit={handleAddCard}
      />
    </div>
  );
};

export default Payment;
