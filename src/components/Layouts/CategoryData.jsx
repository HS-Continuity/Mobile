import Apple from "../../assets/icon/apple.png";
import Green from "../../assets/icon/green.png";
import Rice from "../../assets/icon/rice.png";
import Meat from "../../assets/icon/meat.png";
import Fish from "../../assets/icon/fish.png";
import Bento from "../../assets/icon/bento.png";
import Milk from "../../assets/icon/milk.png";
import Mate from "../../assets/icon/mate.png";
import Seed from "../../assets/icon/seed.png";
import Egg from "../../assets/icon/egg.png";

export const categories = [
  {
    name: "과일",
    icon: Apple,
    emoji: "🍎",
    subCategories: ["딸기", "바나나", "아보카도"],
  },
  {
    name: "채소",
    icon: Green,
    emoji: "🥬",
    subCategories: ["당근", "양파", "토마토"],
  },
  {
    name: "쌀/잡곡",
    icon: Rice,
    emoji: "🌾",
    subCategories: ["백미", "현미", "찹쌀"],
  },
  {
    name: "정육",
    icon: Meat,
    emoji: "🥩🥚",
    subCategories: ["소고기", "돼지고기", "닭고기"],
  },
  {
    name: "계란",
    icon: Egg,
    emoji: "🥚",
    subCategories: ["소고기", "돼지고기", "닭고기"],
  },
  {
    name: "수산/건어물",
    icon: Fish,
    emoji: "🐟",
    subCategories: ["고등어", "연어", "새우"],
  },
  {
    name: "김치/반찬",
    icon: Bento,
    emoji: "🍱",
    subCategories: ["배추김치", "총각김치", "깍두기"],
  },
  {
    name: "유제품",
    icon: Milk,
    emoji: "🥛",
    subCategories: ["우유", "요구르트", "치즈"],
  },
  {
    name: "장/양념",
    icon: Mate,
    emoji: "🧉",
    subCategories: ["고추장", "된장", "간장"],
  },
  {
    name: "유기농",
    icon: Seed,
    emoji: "🌱",
    subCategories: ["유기농 채소", "무농약 과일", "친환경 계란"],
  },
];
