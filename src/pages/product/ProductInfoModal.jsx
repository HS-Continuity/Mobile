import React from "react";

export const MODAL_TYPES = {
  PRODUCT_INFO: "PRODUCT_INFO", // 상품 정보
  SHIPPING_INFO: "SHIPPING_INFO", // 배송 정보
  RETURN_POLICY: "RETURN_POLICY", // 교환 및 반품 정책
};

const ProductInfoModal = ({ product, activeModal }) => {
  const renderModalContent = () => {
    switch (activeModal) {
      // 상품 정보 모달 내용
      case MODAL_TYPES.PRODUCT_INFO:
        return (
          <div className='space-y-4 text-sm'>
            <div className='flex flex-col space-y-1'>
              <h3 className='font-bold'>품명 및 모델명</h3>
              <p className='font-light'>{product.productName}</p>
            </div>
            <div className='flex flex-col space-y-1'>
              <h3 className='font-bold'>식품의 유형</h3>
              <p className='font-light'>{product.foodType || "상세설명참조"}</p>
            </div>
            <div className='flex flex-col space-y-1'>
              <h3 className='font-bold'>생산자 및 소재지</h3>
              <p className='font-light'>{product.manufacturer || "상세설명참조"}</p>
            </div>
            <div className='flex flex-col space-y-1'>
              <h3 className='font-bold'>수입자</h3>
              <p className='font-light'>{product.importer || "상세설명참조"}</p>
            </div>
            <div className='flex flex-col space-y-1'>
              <h3 className='font-bold'>제조연월일/유통기한</h3>
              <p className='text-xs font-light leading-5'>
                소비자 인근의 점포에서 배송되는 상품으로 각 점 통기한 소비기 포별 제조일과 인고일이
                상이하여 일자가 다를니 다. 이마트 점포상품과 동일한 품질을 유지한 상품 이
                배송됩니다. *해당 정보에 대한 문의는 고객센터 로 문의해주시면 안내 가능합니다./
                소비기한-식품 소비기한표시제 도입으로, 24년 1월 1일부터 제조·생산·수입된 상품은
                소비기한으로 표시됩니다. (단, 일부 식품 제외) 제조일자에 따라 소비기한 또는
                유통기한으로 표시된 상품이 배송 될 수 있습니다.
              </p>
            </div>
            <div className='flex flex-col space-y-1'>
              <h3 className='font-bold'>포장 단위별 내용물의 용량(중량), 수량, 크기</h3>
              <p className='font-light'>{product.packageInfo || "상세설명참조"}</p>
            </div>
            <div className='flex flex-col space-y-1'>
              <h3 className='font-bold'>원재료/함량(원산지)</h3>
              <p className='font-light'>{product.ingredients || "상세설명참조"}</p>
            </div>
            <div className='flex flex-col space-y-1'>
              <h3 className='font-bold'>영양성분</h3>
              <p className='font-light'>{product.nutritionInfo || "해당사항 없음"}</p>
            </div>
            <div className='flex flex-col space-y-1'>
              <h3 className='font-bold'>유전자변형식품 여부</h3>
              <p className='font-light'>{product.gmoInfo || "해당사항 없음"}</p>
            </div>
            <div className='flex flex-col space-y-1'>
              <h3 className='font-bold'>소비자 안전을 위한 주의사항</h3>
              <p className='font-light'>
                {product.safetyWarning || "부정, 불량식품 신고는 국번없이 1399 상세설명참조"}
              </p>
            </div>
            <div className='flex flex-col space-y-1'>
              <h3 className='font-bold'>소비자 상담 관련 전화번호</h3>
              <p className='font-light'>{product.customerServiceNumber || "080-080-8866"}</p>
            </div>
          </div>
        );
      // 배송 정보 모달 내용
      case MODAL_TYPES.SHIPPING_INFO:
        return (
          <div className='space-y-4 text-sm'>
            <div className='flex flex-col space-y-1'>
              <h3 className='font-bold'>배송 방법</h3>
              <p className='font-light'>택배</p>
            </div>
            <div className='flex flex-col space-y-1'>
              <h3 className='font-bold'>배송비</h3>
              <p className='font-light'>상세내용참고</p>
            </div>
            <div className='flex flex-col space-y-1'>
              <h3 className='font-bold'>배송 지역</h3>
              <p className='font-light'>전국 (제주 및 도서산간 지역 추가 비용 발생)</p>
            </div>
            <div className='flex flex-col space-y-1'>
              <h3 className='font-bold'>배송 기간</h3>
              <p className='font-light'>2-3일 소요 (주말 및 공휴일 제외)</p>
            </div>
          </div>
        );
      // 교환 및 반품 정책 모달 내용
      case MODAL_TYPES.RETURN_POLICY:
        return (
          <div className='space-y-4 text-sm'>
            <div className='space-y-2'>
              <h3 className='font-bold'>교환/반품 신청 기간</h3>
              <ul className='list-disc space-y-1 pl-5 font-light'>
                <li>교환/취소/반품/교환/환불은 배송 완료 후 7일 이내에 가능합니다.</li>
                <li>
                  고객님이 받으신 상품의 내용이 표시·광고 및 계약 내용과 다른 경우 상품을 수령하신
                  날로부터 3개월 이내, 그 사실을 안 날(알 수 있었던 날)부터 30일 이내에 신청이
                  가능합니다.
                </li>
              </ul>
            </div>
            <div className='space-y-2'>
              <h3 className='font-bold'>교환/반품 회수(배송) 비용</h3>
              <ul className='list-disc space-y-1 pl-5 font-light'>
                <li>
                  상품의 불량/하자 및 표시광고 및 계약 내용과 다른 경우 해당 상품 회수(배송)비용은
                  무료이나,
                </li>
                <li>
                  고객님의 단순변심 및 색상/사이즈 불만에 관련된 교환/반품의 경우 택배비는 고객님
                  부담입니다.
                </li>
                <li>
                  * 구매 시 선택한 옵션과 수량 또는 프로모션 적용 여부에 따라 반품/교환 배송비가
                  변경될 수 있습니다. 자세한 반품/교환 배송비는 MY SSG에서 반품/교환 시 확인
                  가능합니다.
                </li>
              </ul>
            </div>
            <div className='space-y-2'>
              <p className='font-light'>
                <strong>반품 배송비:</strong> 3,000원 (최초 배송비가 무료인 경우, 6,000원 부과)
              </p>
              <p className='font-light'>
                <strong>교환 배송비:</strong> 6,000원
              </p>
              <p>제주/도서산간 지역은 추가 운임이 발생할 수 있습니다.</p>
              <p>
                단, 반품/교환 비용은 상품 및 반품/교환 사유에 따라 변경될 수 있으므로 반품/교환 신청
                화면에서 확인 부탁드립니다.
              </p>
            </div>
            <div className='space-y-2'>
              <h3 className='font-bold'>교환/반품 불가안내</h3>
              <ul className='list-disc space-y-1 pl-5 font-light'>
                <li>
                  고객님이 상품 포장을 개봉하여 사용 또는 설치 완료되어 상품의 가치가 훼손된 경우
                  (단, 내용 확인을 위한 포장 개봉의 경우는 예외)
                </li>
                <li>
                  고객님의 단순변심으로 인한 교환/반품 신청이 상품 수령한 날로부터 7일이 경과한 경우
                </li>
                <li>신선식품(냉장/냉동 포함)을 단순변심/주문착오로 교환/반품 신청하는 경우</li>
                <li>고객님의 사용 또는 일부 소비에 의해 상품의 가치가 현저히 감소한 경우</li>
                <li>
                  시간의 경과에 따라 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우
                </li>
                <li>복제가 가능한 상품 등의 포장을 훼손한 경우</li>
                <li>고객님의 주문에 따라 개별적으로 생산되는 상품이 제작에 들어간 경우</li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return renderModalContent();
};

export default ProductInfoModal;
