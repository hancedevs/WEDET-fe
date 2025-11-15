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
    setQuery: (q: string) => void;
    clear: () => void;
    ensure: (minCount?: number) => Promise<void>;
    refresh: (minCount?: number) => Promise<void>;
}

const STALE_MS = 5 * 60_000; // 5 minutes
const KEY = "home-cards";
const MAX_CACHE_CARDS = 24;

// Light persisted subset
type LightCard = Pick<
    TravelCardVM,
    | "id"
    | "imageUrl"
    | "placeName"
    | "location"
    | "tripDuration"
    | "price"
    | "oldPrice"
    | "discountPercent"
    | "rating"
    | "reviews"
    | "agencyName"
    | "agencyAbout"
>;

// Safe session storage wrapper (quota-safe)
const safeSessionStorage: Storage = {
    get length() {
        return sessionStorage.length;
    },
    clear() {
        sessionStorage.clear();
    },
    key(i: number) {
        return sessionStorage.key(i);
    },
    getItem(k: string) {
        return sessionStorage.getItem(k);
    },
    removeItem(k: string) {
        sessionStorage.removeItem(k);
    },
    setItem(k: string, v: string) {
        try {
            sessionStorage.setItem(k, v);
        } catch {
            if (k) sessionStorage.removeItem(k);
            try {
                sessionStorage.setItem(k, v);
            } catch {
                // swallow
            }
        }
    },
};

export const useHomeDataStore = create<HomeState>()(
    persist(
        (set, get) => ({
            cards: [],
            loading: false,
            error: undefined,
            lastFetched: null,
            query: "",
            setQuery: (q: string) => set({ query: q }),
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
            storage: createJSONStorage(() => safeSessionStorage),
            partialize: (s) => ({
                cards: (s.cards ?? [])
                    .slice(0, MAX_CACHE_CARDS)
                    .map<LightCard>((c) => ({
                        id: c.id,
                        imageUrl: c.imageUrl,
                        placeName: c.placeName,
                        location: c.location,
                        tripDuration: c.tripDuration,
                        price: c.price,
                        oldPrice: c.oldPrice,
                        discountPercent: c.discountPercent,
                        rating: c.rating,
                        reviews: c.reviews,
                        agencyName: c.agencyName,
                        agencyAbout: c.agencyAbout,
                    })),
                lastFetched: s.lastFetched,
            }),
            version: 3,
        }
    )
);
