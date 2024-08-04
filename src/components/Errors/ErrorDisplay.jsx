// 기본 에러 컴포넌트
const BaseError = ({ mainMessage, subMessage }) => (
  <div className='my-28 text-center'>
    <p className='text-gray-600'>{mainMessage}</p>
    <p className='text-sm text-gray-500'>{subMessage}</p>
  </div>
);

// 광고 에러 컴포넌트
export const AdvertisementError = () => (
  <BaseError
    mainMessage='현재 추천 상품을 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 상품 에러 컴포넌트
export const ProductError = () => (
  <div className='mb-3 py-4 text-center'>
    <p className='text-gray-600'>일시적으로 최신 상품 정보를 불러올 수 없습니다.</p>
    <p className='mt-1 text-sm text-gray-500'>
      아래 표시된 상품은 이전에 인기 있었던 상품들입니다.
    </p>
    <p className='text-sm text-gray-500'>실시간 값과 차이가 있을 수 있습니다.</p>
  </div>
);

// 마이페이지 에러 컴포넌트
export const MypageError = () => (
  <BaseError
    mainMessage='현재 개인정보를 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 프로필 에러 컴포넌트
export const ProfileError = () => (
  <BaseError
    mainMessage='현재 개인정보를 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 쿠폰 에러 컴포넌트
export const CouponError = () => (
  <BaseError
    mainMessage='현재 회원님의 쿠폰을 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 결제수단 에러 컴포넌트
export const PaymentError = () => (
  <BaseError
    mainMessage='현재 회원님의 결제수단을 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 배송지 에러 컴포넌트
export const AddressError = () => (
  <BaseError
    mainMessage='현재 회원님의 배송지를 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 타임세일 에러 컴포넌트
export const TimesaleError = () => (
  <BaseError
    mainMessage='현재 타임세일 상품을 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 타임세일 존재하지 않음
export const TimesaleEmptyError = () => (
  <BaseError
    mainMessage='현재 진행중인 타임세일 상품이 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 인기검색어 에러 컴포넌트
export const PopularKeywordsError = () => (
  <BaseError
    mainMessage='현재 인기검색어를 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 상품 상세 에러 컴포넌트
export const ProductDetailError = () => (
  <BaseError
    mainMessage='현재 상품 정보를 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 주문 리스트 에러 컴포넌트
export const OrderListError = () => (
  <BaseError
    mainMessage='현재 주문 목록을 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 정기주문 리스트 에러 컴포넌트
export const SubscriptionOrderListError = () => (
  <BaseError
    mainMessage='현재 정기주문 목록을 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 주문 상세 에러 컴포넌트
export const OrderDetailError = () => (
  <BaseError
    mainMessage='현재 주문 상세정보를 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 주문 상세 에러 컴포넌트
export const SubscriptionOrderDetailError = () => (
  <BaseError
    mainMessage='현재 정기주문 상세정보를 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 리뷰 에러 컴포넌트
export const ReviewError = () => (
  <BaseError
    mainMessage='현재 상품평을 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 리뷰 없음 컴포넌트
export const ReviewEmptyError = () => (
  <BaseError
    mainMessage='현재 등록된 상품평이 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 장바구니 에러 컴포넌트
export const CartError = () => (
  <BaseError
    mainMessage='현재 장바구니 상품을 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 판매자샵 에러 컴포넌트
export const ShopError = () => (
  <BaseError
    mainMessage='현재 판매자 정보를 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);

// 주문 쿠폰 조회 에러 컴포넌트
export const OrderCouponError = () => (
  <BaseError
    mainMessage='현재 회원님의 쿠폰 목록을 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);
// 주문 회원정보 조회 에러 컴포넌트
export const OrderMemberInfoError = () => (
  <BaseError
    mainMessage='현재 회원님의 정보를 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);
// 주문 배송지 조회 에러 컴포넌트
export const OrderAddressError = () => (
  <BaseError
    mainMessage='현재 회원님의 배송지 목록을 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);
// 주문 결제수단 조회 에러 컴포넌트
export const OrderCardError = () => (
  <BaseError
    mainMessage='현재 회원님의 결제수단 목록을 표시할 수 없습니다.'
    subMessage='잠시 후 다시 확인해 주세요.'
  />
);
