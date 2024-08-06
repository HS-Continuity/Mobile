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
      { name: "사과/배", id: 27 },
      { name: "감귤/한라봉", id: 28 },
      { name: "딸기/블루베리/체리", id: 29 },
      { name: "토마토/수박/참외", id: 30 },
      { name: "오렌지/자몽/레몬", id: 31 },
      { name: "포도/복숭아/자두", id: 32 },
    ],
  },
  {
    name: "채소",
    icon: Green,
    emoji: "🥬",
    subCategories: [
      { name: "고구마/감자/당근", id: 33 },
      { name: "옥수수/오이/호박", id: 34 },
      { name: "파프리카/고추", id: 35 },
      { name: "양파/마늘/생강/파", id: 36 },
      { name: "시금치/부추/나물", id: 37 },
      { name: "쌈채소/샐러드", id: 38 },
    ],
  },
  {
    name: "쌀/잡곡",
    icon: Rice,
    emoji: "🌾",
    subCategories: [
      { name: "쌀", id: 39 },
      { name: "친환경양곡", id: 40 },
      { name: "슈퍼푸드잡곡", id: 41 },
      { name: "차류/건강식재", id: 42 },
      { name: "미숫가루/선식", id: 43 },
      { name: "국산잡곡", id: 44 },
    ],
  },
  {
    name: "수산/건어물",
    icon: Fish,
    emoji: "🐟",
    subCategories: [
      { name: "고등어/갈치/대중생선", id: 45 },
      { name: "굴비/명태/반건생선", id: 46 },
      { name: "오징어/낙지/연체류", id: 47 },
      { name: "전복/새우/조개류", id: 48 },
    ],
  },
  {
    name: "계란",
    icon: Egg,
    emoji: "🥚",
    subCategories: [
      { name: "계란10구이하", id: 49 },
      { name: "계란15구", id: 50 },
      { name: "계란30구이상", id: 51 },
      { name: "메추리알", id: 52 },
    ],
  },
  {
    name: "정육",
    icon: Meat,
    emoji: "🥩🥚",
    subCategories: [
      { name: "소고기", id: 0 },
      { name: "돼지고기", id: 0 },
      { name: "닭고기", id: 0 },
    ],
  },
  {
    name: "김치/반찬",
    icon: Bento,
    emoji: "🍱",
    subCategories: [
      { name: "배추김치", id: 0 },
      { name: "총각김치", id: 0 },
      { name: "깍두기", id: 0 },
    ],
  },
  {
    name: "유제품",
    icon: Milk,
    emoji: "🥛",
    subCategories: [
      { name: "우유", id: 0 },
      { name: "요구르트", id: 0 },
      { name: "치즈", id: 0 },
    ],
  },
  {
    name: "장/양념",
    icon: Mate,
    emoji: "🧉",
    subCategories: [
      { name: "고추장", id: 0 },
      { name: "된장", id: 0 },
      { name: "간장", id: 0 },
    ],
  },
  {
    name: "유기농",
    icon: Seed,
    emoji: "🌱",
    subCategories: [
      { name: "유기농 채소", id: 0 },
      { name: "무농약 과일", id: 0 },
      { name: "친환경 계란", id: 0 },
    ],
  },
];
