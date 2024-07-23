import { useState, useEffect } from "react";
import { useProductsQuery } from "../../apis";

import ProductList from "../../components/Product/ProductList";
import ProductSlider from "./ProductSlider";
import CategoryGrid from "./CategoryGrid";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div>
      <ProductSlider />
      <CategoryGrid categories={categories} isLoading={isLoading} />
      <ProductList useQueryHook={useProductsQuery} gridCols={1} />
    </div>
  );
};

export default Home;
