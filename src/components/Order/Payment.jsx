import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus, FaStar } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import CardRegisterModal from "./CardRegisterModal";
import { putDefaultCard } from "../../apis";

const Payment = ({
  cards,
  selectedCardIndex,
  handlePrevCard,
  handleNextCard,
  handleDeleteCard,
  isCardRegistrationModalOpen,
  setIsCardRegistrationModalOpen,
  handleAddCard,
  getCardColor,
  maskDigits,
  memberId,
  refetch,
}) => {
  const [localDefaultCard, setLocalDefaultCard] = useState(
    () => cards.find(card => card.isDefaultPaymentCard === "ACTIVE")?.memberPaymentCardId
  );

  const isCardExpired = card => {
    const expirationMonth = parseInt(card.cardExpiration.slice(0, 2), 10);
    const expirationYear = parseInt("20" + card.cardExpiration.slice(2), 10);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    return (
      expirationYear < currentYear ||
      (expirationYear === currentYear && expirationMonth < currentMonth)
    );
  };

  const handleSetDefaultCard = (memberPaymentCardId, memberId) => {
    setLocalDefaultCard(memberPaymentCardId);
    putDefaultCard(memberPaymentCardId, memberId);
  };

  const selectedCard = cards && selectedCardIndex !== null ? cards[selectedCardIndex - 1] : null;
  const canRegisterCard = cards.length < 3;
  const hasCards = cards.length > 0;

  return (
    <div className='rounded-lg border bg-white p-4'>
      <svg width='0' height='0' style={{ position: "absolute" }}>
        <defs>
          <filter id='outline'>
            <feMorphology
              in='SourceAlpha'
              result='DILATED'
              operator='dilate'
              radius='1'></feMorphology>
            <feFlood floodColor='gray' floodOpacity='1' result='COLORED'></feFlood>
            <feComposite in='COLORED' in2='DILATED' operator='in' result='OUTLINE'></feComposite>
            <feMerge>
              <feMergeNode in='OUTLINE' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <h2 className='mb-2 text-xl font-bold'>결제 수단</h2>
      <hr className='mb-3 border-gray-200' />
      <div className='relative w-full' style={{ height: "220px" }}>
        <div className='absolute inset-0 flex items-center justify-center overflow-hidden'>
          <div className='relative w-[312px]'>
            <div
              className='flex transition-transform duration-300 ease-in-out'
              style={{
                transform: `translateX(${-selectedCardIndex * 27.8}%)`,
                width: `${(cards.length + 1) * (300 / (cards.length + 1))}%`,
              }}>
              {/* 카드 등록하기 카드 */}
              <div
                className={`ml-[52px] w-[208px] flex-shrink-0 bg-gradient-shine transition-all duration-300 ease-in-out ${
                  selectedCardIndex === 0 ? "z-10 scale-110" : "scale-100 opacity-50"
                } ${!canRegisterCard ? "cursor-not-allowed opacity-50" : ""}`}>
                <div
                  className={`flex h-[140px] flex-col items-center justify-center rounded-xl bg-gradient-shine bg-gradient-to-br from-green-400 to-blue-500 p-4 text-white shadow ${
                    canRegisterCard ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                  onClick={() => canRegisterCard && setIsCardRegistrationModalOpen(true)}>
                  <FaPlus className='mb-2 text-4xl' />
                  <span className='text-center text-xl font-bold'>카드 등록하기</span>
                </div>
              </div>

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
                        className={`relative h-[140px] overflow-hidden rounded-xl p-4 text-white shadow ${
                          expired ? "bg-gray-400" : ""
                        }`}
                        style={{
                          backgroundColor: expired ? "#808080" : getCardColor(card.cardCompany),
                          backgroundImage:
                            "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
                        }}>
                        <div className='mb-2 flex justify-between'>
                          <p className='text-lg font-bold'>{card.cardCompany}</p>
                          <div>
                            <button
                              onClick={() =>
                                handleSetDefaultCard(card.memberPaymentCardId, memberId)
                              }
                              className='text-white opacity-70'>
                              <FaStar
                                className={`text-lg ${
                                  localDefaultCard === card.memberPaymentCardId
                                    ? "text-yellow-400 opacity-100"
                                    : "text-gray-300"
                                }`}
                                style={{ filter: "url(#outline)" }}
                              />
                            </button>
                            <button
                              onClick={() => handleDeleteCard(card.memberPaymentCardId)}
                              className='ml-2 text-lg text-white opacity-70 hover:opacity-100'>
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                        <div className='mb-2 mt-4'>
                          <p className='text-lg tracking-wider'>{maskDigits(card.cardNumber)}</p>
                        </div>
                        <div className='flex justify-between'>
                          <div>
                            <p className='text-xs opacity-70'>만료일</p>
                            <p className='text-sm'>{card.cardExpiration}</p>
                          </div>
                          {expired && (
                            <p className='self-end text-sm font-bold text-red-300'>만료됨</p>
                          )}
                        </div>
                        <div className='absolute bottom-2 right-4 opacity-30'>
                          <svg
                            width='50'
                            height='30'
                            viewBox='0 0 50 30'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'>
                            <circle cx='15' cy='15' r='15' fill='white' />
                            <circle cx='35' cy='15' r='15' fill='white' fillOpacity='0.7' />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {/* 이전 카드 */}
        {hasCards && (
          <button
            onClick={handlePrevCard}
            className='absolute left-8 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-6 text-xl shadow'>
            <FaChevronLeft />
          </button>
        )}
        {/* 다음 카드 */}
        {hasCards && (
          <button
            onClick={handleNextCard}
            className='absolute right-8 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-6 text-xl shadow'>
            <FaChevronRight />
          </button>
        )}
      </div>
      <p className='text-center text-sm text-gray-600'>법인/체크카드는 일시불로 결제됩니다</p>
      <CardRegisterModal
        isOpen={isCardRegistrationModalOpen}
        onClose={() => setIsCardRegistrationModalOpen(false)}
        onSubmit={handleAddCard}
        refetch={refetch}
      />
    </div>
  );
};

export default Payment;
