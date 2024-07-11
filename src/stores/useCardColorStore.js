import { create } from "zustand";

const useCardColorStore = create(set => ({
  cardColors: {
    국민카드: "#FFBE00",
    신한카드: "#144494",
    하나카드: "#009944",
    우리카드: "#0656B4",
    농협카드: "#00A54D",
    기업카드: "#004B98",
    카카오뱅크: "#FFCD00",
    케이뱅크: "#2B7DE9",
    토스뱅크: "#7AC943",
  },
  getCardColor: cardName => {
    const state = useCardColorStore.getState();
    return state.cardColors[cardName] || "#000000"; // 기본값은 검정색
  },
}));

export default useCardColorStore;
