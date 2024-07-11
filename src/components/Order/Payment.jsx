import { FaChevronLeft, FaChevronRight, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import CardEditModal from "./CardEditModal";
import CardRegisterModal from "./CardRegisterModal";

const Payment = ({
  cards,
  selectedCardIndex,
  handlePrevCard,
  handleNextCard,
  handleEditCard,
  handleDeleteCard,
  isCardEditModalOpen,
  setIsCardEditModalOpen,
  handleUpdateCard,
  editingCard,
  isCardRegistrationModalOpen,
  setIsCardRegistrationModalOpen,
  handleAddCard,
  getCardColor,
  maskDigits,
}) => {
  const isCardExpired = card => {
    const [expirationYear, expirationMonth] = card.card_expiration.split("/").map(Number);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    return (
      expirationYear < currentYear ||
      (expirationYear === currentYear && expirationMonth < currentMonth)
    );
  };

  const selectedCard = cards && cards[selectedCardIndex - 1];

  return (
    <div className='rounded-lg bg-white p-4 shadow'>
      <h2 className='mb-4 font-bold'>결제 수단</h2>
      <div className='relative w-full' style={{ height: "200px" }}>
        <div className='absolute inset-0 flex items-center justify-center overflow-hidden'>
          <div className='relative w-[312px]'>
            <div
              className='flex transition-transform duration-300 ease-in-out'
              style={{
                transform: `translateX(${-selectedCardIndex * 27.8}%)`,
                width: `${((cards ? cards.length : 0) + 1) * (300 / (cards.length + 1))}%`,
              }}>
              {/* 카드 등록하기 카드 */}
              {/* 카드 5개 까지 */}
              {cards.length < 6 && (
                <div
                  className={`ml-[52px] w-[208px] flex-shrink-0 transition-all duration-300 ease-in-out ${
                    selectedCardIndex === 0 ? "z-10 scale-110" : "scale-100 opacity-50"
                  }`}>
                  <div
                    className='flex h-36 cursor-pointer items-center justify-center rounded-lg bg-gray-300 p-4 text-white shadow-lg'
                    onClick={() => setIsCardRegistrationModalOpen(true)}>
                    <FaPlus className='text-4xl text-gray-500' />
                    <span className='ml-2 text-xl font-bold text-gray-500'>카드 등록하기</span>
                  </div>
                </div>
              )}

              {/* 기존 카드들 */}
              {cards &&
                cards.map((card, index) => {
                  const expired = isCardExpired(card);
                  return (
                    <div
                      key={index}
                      className={`ml-[52px] w-[208px] flex-shrink-0 transition-all duration-300 ease-in-out ${
                        index + 1 === selectedCardIndex
                          ? "z-10 scale-110"
                          : expired
                            ? "scale-100 cursor-not-allowed opacity-50"
                            : "scale-100 opacity-50"
                      }`}>
                      <div
                        className={`h-36 rounded-lg p-4 text-white shadow-lg ${
                          expired ? "bg-gray-400" : ""
                        }`}
                        style={{
                          backgroundColor: expired ? "#808080" : getCardColor(card.card_company),
                        }}>
                        <p className='mb-4 text-xl font-bold'>{card.card_company}</p>
                        <p className='text-lg'>{maskDigits(card.card_number)}</p>
                        <div className='flex'>
                          <p className='text-md'>{card.card_expiration}</p>
                          {expired && <p className='text-sm font-bold text-red-700'>만료됨</p>}
                        </div>

                        {/* 카드 수정 버튼 */}
                        <button onClick={() => handleEditCard(card)} className='text-blue-500'>
                          <FaEdit />
                        </button>
                        {/* 카드 삭제 버튼 */}
                        <button onClick={() => handleDeleteCard(card.id)} className='text-red-500'>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <CardEditModal
            isOpen={isCardEditModalOpen}
            onClose={() => setIsCardEditModalOpen(false)}
            onSubmit={handleUpdateCard}
            cardData={editingCard}
          />
        </div>
        {/* 이전 카드 */}
        <button
          onClick={handlePrevCard}
          className='absolute left-8 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-6 text-xl shadow'>
          <FaChevronLeft />
        </button>
        {/* 다음 카드 */}
        <button
          onClick={handleNextCard}
          className='absolute right-8 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-6 text-xl shadow'>
          <FaChevronRight />
        </button>
      </div>
      <p className='mt-4 text-center text-sm text-gray-600'>법인/체크카드는 일시불로 결제됩니다</p>
      {selectedCard && selectedCard.is_simple_payment_agreed === 0 && (
        <div className='mt-4 flex items-center justify-center'>
          <input type='checkbox' id='regularPaymentAgreement' className='mr-2' />
          <label htmlFor='regularPaymentAgreement' className='text-sm text-gray-700'>
            정기결제 동의하시겠습니까?
          </label>
        </div>
      )}
      <CardRegisterModal
        isOpen={isCardRegistrationModalOpen}
        onClose={() => setIsCardRegistrationModalOpen(false)}
        onSubmit={handleAddCard}
      />
    </div>
  );
};

export default Payment;
