"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchToursForHome, type TravelCardVM } from "@/lib/toursRepo";

type HomeState = {
  cards: TravelCardVM[];
  loading: boolean;
  error?: string;
  lastFetched: number | null;
  ensure: (minCount?: number) => Promise<void>;
  refresh: (minCount?: number) => Promise<void>;
  clear: () => void;
};

const STALE_MS = 5 * 60_000;           // 5 minutes
const KEY = "home-cards";
const MAX_CACHE_CARDS = 24;            // cap persisted size

// Persist fewer/lighter fields to stay under quota
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
>;

// A storage wrapper that swallows quota errors and replaces the entry
const safeSessionStorage: Storage = {
  get length() { return sessionStorage.length; },
  clear() { sessionStorage.clear(); },
  key(i) { return sessionStorage.key(i); },
  getItem(k) { return sessionStorage.getItem(k); },
  removeItem(k) { sessionStorage.removeItem(k); },
  setItem(k, v) {
    try {
      sessionStorage.setItem(k, v);
    } catch (err: unknown) {
      // If we hit quota, drop the old entry and try once more
      // (Keeps the app working instead of crashing)
      if (k) sessionStorage.removeItem(k);
      try { sessionStorage.setItem(k, v); } catch { /* give up silently */ }
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

      clear: () => {
        set({ cards: [], lastFetched: null });
        try { sessionStorage.removeItem(KEY); } catch {}
      },

      ensure: async (minCount = 12) => {
        const { cards, lastFetched } = get();
        const fresh = lastFetched !== null && Date.now() - lastFetched < STALE_MS;
        const enough = cards.length >= minCount;
        if (fresh && enough) return;

        set({ loading: cards.length === 0, error: undefined });
        try {
          const items = await fetchToursForHome(minCount);
          set({ cards: items, loading: false, lastFetched: Date.now() });
        } catch (e) {
          const message = e instanceof Error ? e.message : "Failed to load tours";
          set({ loading: false, error: message });
        }
      },

      refresh: async (minCount = 12) => {
        set({ loading: true, error: undefined });
        try {
          const items = await fetchToursForHome(minCount);
          set({ cards: items, loading: false, lastFetched: Date.now() });
        } catch (e) {
          const message = e instanceof Error ? e.message : "Failed to load tours";
          set({ loading: false, error: message });
        }
      },
    }),
    {
      name: KEY,
      storage: createJSONStorage(() => safeSessionStorage, {
        // if you’re on zustand >=4.5, this keeps only the fields above
        replacer: (_key, value) => value,
      }),
      // Keep the cache tiny: only the first N cards, and only light fields
      partialize: (s) => ({
        cards: (s.cards ?? [])
          .slice(0, MAX_CACHE_CARDS)
          .map((c) => {
            const lc: LightCard = {
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
            };
            return lc as unknown as TravelCardVM;
          }),
        lastFetched: s.lastFetched,
      }),
      // bump this if you previously stored heavy data; it will re-persist in light form
      version: 2,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      migrate: (persisted: any, version) => {
        if (version < 2 && persisted?.cards) {
          persisted.cards = (persisted.cards as TravelCardVM[])
            .slice(0, MAX_CACHE_CARDS)
            .map((c) => ({
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
            }));
        }
        return persisted;
      },
    }
  )
);
