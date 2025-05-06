import { create } from "zustand";

type SearchInfo = {
  searchQuery: string | null;
  setSearchQuery: (data: string) => void;
};

export const useSearchInfo = create<SearchInfo>((set, get) => ({
  searchQuery: null,
  setSearchQuery: (data) => set({ searchQuery: data }),
}));
