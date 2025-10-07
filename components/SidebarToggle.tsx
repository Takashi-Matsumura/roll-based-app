"use client";

import { create } from "zustand";

interface SidebarStore {
  isOpen: boolean;
  width: number;
  toggle: () => void;
  setWidth: (width: number) => void;
}

const MIN_WIDTH = 200;
const MAX_WIDTH = 500;
const DEFAULT_WIDTH = 256; // 16rem (w-64)

export const useSidebar = create<SidebarStore>((set) => ({
  isOpen: true,
  width: DEFAULT_WIDTH,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setWidth: (width: number) =>
    set({ width: Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH) }),
}));

export { MIN_WIDTH, MAX_WIDTH, DEFAULT_WIDTH };
