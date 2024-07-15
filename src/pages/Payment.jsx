import { useState } from "react";
import CardRegisterModal from "../components/Order/CardRegisterModal";
import CardEditModal from "../components/Order/CardEditModal";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addMemberCard, deleteMemberCard, fetchMemberCard, updateMemberCard } from "../apis";
import useCardColorStore from "../stores/useCardColorStore";

const Payment = () => {
  const queryClient = useQueryClient();
  const getCardColor = useCardColorStore(state => state.getCardColor);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const {
    data: cards,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cards", 1],
    queryFn: () => fetchMemberCard(1),
  });

  const addCardMutation = useMutation({
    mutationFn: addMemberCard,
    onSuccess: () => {
      queryClient.invalidateQueries(["cards", 1]);
      setIsRegisterModalOpen(false);
    },
  });

  const updateCardMutation = useMutation({
    mutationFn: updateMemberCard,
    onSuccess: () => {
      queryClient.invalidateQueries(["cards", 1]);
      setIsEditModalOpen(false);
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: deleteMemberCard,
    onSuccess: () => {
      queryClient.invalidateQueries(["cards", 1]);
    },
  });

  const handleAddCard = cardData => {
    addCardMutation.mutate({ memberId: 1, ...cardData });
  };

  const handleUpdateCard = cardData => {
    updateCardMutation.mutate({ memberId: 1, ...cardData });
  };

  const handleDeleteCard = cardId => {
    if (window.confirm("정말로 이 카드를 삭제하시겠습니까?")) {
      deleteCardMutation.mutate({ memberId: 1, cardId });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading cards</div>;

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-4 text-2xl font-bold'>등록 카드 {cards.length}개</h1>
      <div className='grid grid-cols-1 gap-4'>
        {cards.map(card => (
          <div
            key={card.id}
            className='flex items-center justify-between rounded-lg bg-white p-6 shadow-md'>
            <div className='flex items-center'>
              <div
                className='mr-4 h-8 w-10 rounded'
                style={{ backgroundColor: getCardColor(card.card_company) }}
              />
              <div>
                <h2 className='font-semibold'>{card.card_company}</h2>
                <p className='text-sm text-gray-600'>{card.card_number}</p>
              </div>
            </div>
            <div>
              <button
                onClick={() => {
                  setSelectedCard(card);
                  setIsEditModalOpen(true);
                }}
                className='mr-2 text-blue-500'>
                <FaEdit />
              </button>
              <button onClick={() => handleDeleteCard(card.id)} className='text-red-500'>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setIsRegisterModalOpen(true)}
        className='mt-4 flex items-center rounded bg-green-500 px-4 py-2 text-white'>
        <FaPlus className='mr-2' /> 카드 추가
      </button>

      <CardRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSubmit={handleAddCard}
      />

      <CardEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateCard}
        cardData={selectedCard}
      />
    </div>
  );
};

export default Payment;
