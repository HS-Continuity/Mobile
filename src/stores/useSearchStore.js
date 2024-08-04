import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useSearchStore = create(
  persist(
    (set, get) => ({
      recentSearches: [],
      addSearch: search => {
        const currentSearches = get().recentSearches;
        const updatedSearches = [search, ...currentSearches.filter(s => s !== search)].slice(0, 5);
        set({ recentSearches: updatedSearches });
      },
      removeSearch: search => {
        set(state => ({
          recentSearches: state.recentSearches.filter(s => s !== search),
        }));
      },
      clearSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "search-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { useSearchStore };
