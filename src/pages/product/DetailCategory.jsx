import React, { useState } from "react";
import CategoryProductList from "../../components/Product/CategoryProductList";
import { useDetailCategoryProductsQuery } from "../../apis";
import { useParams } from "react-router-dom";

const DetailCategory = () => {
  const { detailCategoryId } = useParams();
  const [isCertification, setIsCertification] = useState("");
  const [sortOption, setSortOption] = useState({ sort: "productPrice", direction: "asc" });

  const handleCertificationChange = value => {
    setIsCertification(value);
  };

  const handleSortChange = e => {
    const value = e.target.value;
    switch (value) {
      case "priceLow":
        setSortOption({ sort: "productPrice", direction: "asc" });
        break;
      case "priceHigh":
        setSortOption({ sort: "productPrice", direction: "desc" });
        break;
      case "ratingLow":
        setSortOption({ sort: "averageScore", direction: "asc" });
        break;
      case "ratingHigh":
        setSortOption({ sort: "averageScore", direction: "desc" });
        break;
      default:
        setSortOption({ sort: "productPrice", direction: "asc" });
    }
  };

  return (
    <div className='container mx-auto px-4 py-6'>
      <div className='mb-6 flex flex-wrap items-center justify-between rounded-lg p-4 shadow-sm'>
        <div className='mb-4 sm:mb-0'>
          <button
            onClick={() => handleCertificationChange("INACTIVE")}
            className={`btn mr-2 rounded-full px-6 py-2 font-semibold transition-colors duration-200 ${
              isCertification === "INACTIVE"
                ? "bg-green-shine text-white"
                : "bg-white hover:bg-gray-200"
            }`}>
            일반상품
          </button>
          <button
            onClick={() => handleCertificationChange("ACTIVE")}
            className={`btn rounded-full px-6 py-2 font-semibold transition-colors duration-200 ${
              isCertification === "ACTIVE"
                ? "bg-green-shine text-white"
                : "bg-white hover:bg-gray-200"
            }`}>
            친환경상품
          </button>
        </div>
        <div className='w-full sm:w-auto'>
          <select
            onChange={handleSortChange}
            className='w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 sm:w-auto'>
            <option value='priceLow'>가격 낮은순</option>
            <option value='priceHigh'>가격 높은순</option>
            <option value='ratingLow'>평점 낮은순</option>
            <option value='ratingHigh'>평점 높은순</option>
          </select>
        </div>
      </div>
      <CategoryProductList
        useQueryHook={() =>
          useDetailCategoryProductsQuery(
            detailCategoryId,
            isCertification,
            sortOption.sort,
            sortOption.direction
          )
        }
      />
    </div>
  );
};

export default DetailCategory;
