import React from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../../components/Layouts/CategoryData";

const CategoryGrid = () => {
  const navigate = useNavigate();

  const handleCategoryClick = categoryId => {
    if (categoryId <= 5) {
      navigate(`/category/${categoryId}`);
    }
  };

  const renderCategories = () => {
    const rows = [];

    for (let i = 0; i < categories.length; i += 5) {
      const rowCategories = categories.slice(i, i + 5);

      rows.push(
        <React.Fragment key={i}>
          <div className='mb-6 mt-3 grid grid-cols-5 gap-1'>
            {rowCategories.map((category, index) => {
              const categoryId = i + index + 1;
              const isClickable = categoryId <= 5;
              return (
                <div
                  key={category.name}
                  className={`group flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
                    isClickable
                      ? "cursor-pointer hover:scale-105 hover:transform"
                      : "cursor-default opacity-50"
                  }`}
                  onClick={() => handleCategoryClick(categoryId)}>
                  <div className='mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-gray-50 transition-all duration-300 ease-in-out'>
                    <img
                      src={category.icon}
                      alt={category.name}
                      className={`h-12 w-12 object-contain transition-all duration-300 ease-in-out ${
                        isClickable ? "group-hover:scale-110" : ""
                      }`}
                    />
                  </div>
                  <span
                    className={`-mt-2 text-center text-sm font-medium ${
                      isClickable ? "text-gray-700 group-hover:text-gray-900" : "text-gray-400"
                    }`}>
                    {category.name}
                  </span>
                </div>
              );
            })}
          </div>
        </React.Fragment>
      );
    }
    return rows;
  };

  return <div className='noScrollbar flex-grow overflow-y-auto p-4'>{renderCategories()}</div>;
};

export default CategoryGrid;
