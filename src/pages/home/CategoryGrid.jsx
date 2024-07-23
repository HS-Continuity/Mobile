import React, { useState } from "react";
import { Link } from "react-router-dom";
import CategorySkeleton from "../../components/Skeletons/CategorySkeleton";

const CategoryGrid = ({ categories, isLoading }) => {
  // 현재 펼쳐진 카테고리 이름 상태 관리
  const [expandedCategory, setExpandedCategory] = useState(null);

  // 카테고리 클릭 시 펼치거나 접기
  const handleCategoryClick = categoryName => {
    setExpandedCategory(categoryName === expandedCategory ? null : categoryName);
  };

  // 카테고리 렌더링 함수
  const renderCategories = () => {
    const rows = [];

    // 카테고리를 3개씩 묶어서 행으로 만들기
    for (let i = 0; i < categories.length; i += 3) {
      const rowCategories = categories.slice(i, i + 3);

      rows.push(
        <React.Fragment key={i}>
          <div className='mb-3 grid grid-cols-3 gap-4'>
            {/* 각 행의 카테고리 렌더링 */}
            {rowCategories.map(category => (
              <div
                key={category.name}
                className='flex cursor-pointer flex-col items-center justify-center'
                onClick={() => handleCategoryClick(category.name)}>
                <div className='mb-2 text-3xl'>{category.icon}</div>
                <span className='text-center text-sm'>{category.name}</span>
              </div>
            ))}
          </div>
          {/* 펼쳐진 카테고리의 하위 카테고리 렌더링 */}
          {expandedCategory && rowCategories.some(cat => cat.name === expandedCategory) && (
            <div className='col-span-3 -mt-2 mb-3 rounded bg-gray-100 p-2'>
              <div className='grid grid-cols-3 gap-2'>
                {categories
                  .find(cat => cat.name === expandedCategory)
                  .subCategories.map(subCategory => (
                    <div key={subCategory} className='py-1 text-center text-sm'>
                      <Link to={"/detailcategory"}>{subCategory}</Link>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </React.Fragment>
      );
    }

    return rows;
  };

  if (isLoading) {
    return (
      <div className='grid grid-cols-3 gap-4'>
        {Array.from({ length: 9 }).map((_, index) => (
          <CategorySkeleton key={index} />
        ))}
      </div>
    );
  }

  return <div className='noScrollbar flex-grow overflow-y-auto p-2'>{renderCategories()}</div>;
};

export default CategoryGrid;
