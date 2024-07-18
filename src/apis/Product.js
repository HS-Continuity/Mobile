// [GET] 상품 내용 상세 조회
export const fetchProductDetail = async productId => {
  try {
    const response = await axios.get(`${DB_URL}/shopping/product/${productId}`);
    // console.log(response.data.result);
    return response.data.result;
  } catch (error) {
    console.error("Error 상품 내용 상세 조회:", error);
    throw error;
  }
};

