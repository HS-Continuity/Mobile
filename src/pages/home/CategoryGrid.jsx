import React, { useState } from "react";
import { categories } from "../../components/Layouts/CategoryData";
import CategorySkeleton from "../../components/Skeletons/CategorySkeleton";

const CategoryGrid = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const handleCategoryClick = categoryName => {
    setExpandedCategory(categoryName === expandedCategory ? null : categoryName);
  };

  const renderCategories = () => {
    const rows = [];

    for (let i = 0; i < categories.length; i += 5) {
      const rowCategories = categories.slice(i, i + 5);

      rows.push(
        <React.Fragment key={i}>
          <div className='mb-6 mt-3 grid grid-cols-5 gap-1'>
            {rowCategories.map(category => (
              <div
                key={category.name}
                className='group flex cursor-pointer flex-col items-center justify-center transition-all duration-300 ease-in-out hover:scale-105 hover:transform'
                onClick={() => handleCategoryClick(category.name)}>
                <div className='mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-gray-50 transition-all duration-300 ease-in-out'>
                  <img
                    src={category.icon}
                    alt={category.name}
                    className='h-12 w-12 object-contain transition-all duration-300 ease-in-out group-hover:scale-110'
                  />
                </div>
                <span className='-mt-2 text-center text-sm font-medium text-gray-700 group-hover:text-gray-900'>
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </React.Fragment>
      );
    }
    return rows;
  };

  // if (isLoading) {
  //   return <CategorySkeleton />;
  // }

  return <div className='noScrollbar flex-grow overflow-y-auto p-4'>{renderCategories()}</div>;
};

export default CategoryGrid;
