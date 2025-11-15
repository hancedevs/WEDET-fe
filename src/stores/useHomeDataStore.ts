"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchToursForHome, type TravelCardVM } from "@/lib/toursRepo";

interface HomeState {
    cards: TravelCardVM[];
    loading: boolean;
    error?: string;
    lastFetched: number | null;
    query: string;
    filters: {
        minPrice?: string;
        maxPrice?: string;
        nearestDate?: boolean;
    };
    setQuery: (q: string) => void;
    setFilters: (f: Partial<HomeState["filters"]>) => void;
    clear: () => void;
    ensure: (minCount?: number) => Promise<void>;
    refresh: (minCount?: number) => Promise<void>;
}

const STALE_MS = 5 * 60_000; // 5 minutes
const KEY = "home-cards";

export const useHomeDataStore = create<HomeState>()(
    persist(
        (set, get) => ({
            cards: [],
            loading: false,
            error: undefined,
            lastFetched: null,
            query: "",
            filters: { minPrice: "", maxPrice: "", nearestDate: false },
            setQuery: (q) => set({ query: q }),
            setFilters: (f) => set({ filters: { ...get().filters, ...f } }),
            clear: () => {
                set({ cards: [], lastFetched: null });
                try {
                    sessionStorage.removeItem(KEY);
                } catch {}
            },
            ensure: async (minCount = 12) => {
                const { cards, lastFetched } = get();
                const fresh =
                    lastFetched !== null && Date.now() - lastFetched < STALE_MS;
                const enough = cards.length >= minCount;
                if (fresh && enough) return;
                set({ loading: cards.length === 0, error: undefined });
                try {
                    const items = await fetchToursForHome(minCount);
                    set({
                        cards: items,
                        loading: false,
                        lastFetched: Date.now(),
                    });
                } catch (e) {
                    const message =
                        e instanceof Error ? e.message : "Failed to load tours";
                    set({ loading: false, error: message });
                }
            },
            refresh: async (minCount = 12) => {
                set({ loading: true, error: undefined });
                try {
                    const items = await fetchToursForHome(minCount);
                    set({
                        cards: items,
                        loading: false,
                        lastFetched: Date.now(),
                    });
                } catch (e) {
                    const message =
                        e instanceof Error ? e.message : "Failed to load tours";
                    set({ loading: false, error: message });
                }
            },
        }),
        {
            name: KEY,
            storage: createJSONStorage(() => sessionStorage),
            version: 3,
        }
    )
);
