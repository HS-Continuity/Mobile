import React, { useState, useEffect } from "react";
import ProductList from "../components/Product/ProductList";
import CategorySkeleton from "../components/Skeletons/CategorySkeleton";
import { Link } from "react-router-dom";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      // API 작성
      setCategories([
        {
          name: "과일",
          icon: "🍎",
          subCategories: ["딸기", "바나나", "아보카도"],
        },
        {
          name: "채소",
          icon: "🥬",
          subCategories: ["당근", "양파", "토마토"],
        },
        {
          name: "쌀/잡곡",
          icon: "🌾",
          subCategories: ["백미", "현미", "찹쌀"],
        },
        {
          name: "정육/계란",
          icon: "🥩🥚",
          subCategories: ["소고기", "돼지고기", "닭고기"],
        },
        {
          name: "수산/건어물",
          icon: "🐟",
          subCategories: ["고등어", "연어", "새우"],
        },
        {
          name: "김치/반찬",
          icon: "🍱",
          subCategories: ["배추김치", "총각김치", "깍두기"],
        },
        {
          name: "유제품",
          icon: "🥛",
          subCategories: ["우유", "요구르트", "치즈"],
        },
        {
          name: "장/양념",
          icon: "🧉",
          subCategories: ["고추장", "된장", "간장"],
        },
        {
          name: "친환경/유기농",
          icon: "🌱",
          subCategories: ["유기농 채소", "무농약 과일", "친환경 계란"],
        },
      ]);
      setIsLoading(false);
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = categoryName => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryName);
    }
  };

  const renderCategories = () => {
    const rows = [];
    for (let i = 0; i < categories.length; i += 3) {
      const rowCategories = categories.slice(i, i + 3);
      rows.push(
        <React.Fragment key={i}>
          <div className='mb-3 grid grid-cols-3 gap-4'>
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

  return (
    <div>
      <div className='noScrollbar flex-grow overflow-y-auto p-2'>
        {isLoading ? (
          <div className='grid grid-cols-3 gap-4'>
            {Array.from({ length: 9 }).map((_, index) => (
              <CategorySkeleton key={index} />
            ))}
          </div>
        ) : (
          renderCategories()
        )}
      </div>
      <ProductList />
    </div>
  );
};

export default Home;
