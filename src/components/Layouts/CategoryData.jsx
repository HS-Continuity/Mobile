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
    subCategories: [
      "사과/배",
      "감귤/한라봉",
      "딸기/블루베리/체리",
      "토마토/수박/참외",
      "오렌지/자몽/레몬",
      "포도/복숭아/자두",
    ],
  },
  {
    name: "채소",
    icon: Green,
    emoji: "🥬",
    subCategories: [
      "고구마/감자/당근",
      "옥수수/오이/호박",
      "파프리카/고추",
      "양파/마늘/생강/파",
      "시금치/부추/나물",
      "쌈채소/샐러드",
    ],
  },
  {
    name: "쌀/잡곡",
    icon: Rice,
    emoji: "🌾",
    subCategories: [
      "쌀",
      "친환경양곡",
      "슈퍼푸드잡곡",
      "차류/건강식재",
      "미숫가루/선식",
      "국산잡곡",
    ],
  },
  {
    name: "수산/건어물",
    icon: Fish,
    emoji: "🐟",
    subCategories: [
      "고등어/갈치/대중생선",
      "굴비/명태/반건생선",
      "오징어/낙지/연체류",
      "전복/새우/조개류",
    ],
  },
  {
    name: "계란",
    icon: Egg,
    emoji: "🥚",
    subCategories: ["계란10구이하", "계란15구", "계란30구이상", "메추리알"],
  },
  {
    name: "정육",
    icon: Meat,
    emoji: "🥩🥚",
    subCategories: ["소고기", "돼지고기", "닭고기"],
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
