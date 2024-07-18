// [GET] 상품별 리뷰 조회
export const fetchLatestProductReviews = async productId => {
  try {
    const response = await axios.get(`${DB_URL}/product-review/${productId}`, {
      params: {
        pageSize: 3,
      },
    });
    return response.data.result.content;
  } catch (error) {
    console.error("Error 상품 최신 리뷰 조회:", error);
    throw error;
  }
};

// [GET] 상품 리뷰 전체 조회
export const fetchProductReviews = async (productId, startPage = 0, sortOption = "latest") => {
  try {
    let sort, direction;
    switch (sortOption) {
      case "lowRating":
        sort = "reviewScore";
        direction = "asc";
        break;
      case "highRating":
        sort = "reviewScore";
        direction = "desc";
        break;
      case "latest":
      default:
        sort = "createDate";
        direction = "desc";
        break;
    }

    const response = await axios.get(`${DB_URL}/product-review/${productId}`, {
      params: {
        startPage,
        pageSize: 10,
        sort,
        direction,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    throw error;
  }
};

