import { create } from "zustand";

interface TagState {
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

export const useTagStore = create<TagState>((set) => ({
  selectedTag: null,
  setSelectedTag: (tag) => set({ selectedTag: tag }),
}));
