// store/filterStore.ts
import { create } from 'zustand';

interface FilterState {
    searchQuery: string;
    minPrice: string;
    maxPrice: string;
    region: string;
    district: string;
    city: string;
    country: string;
    wifi: boolean;
    sauna: boolean;
    pool: boolean;
    billiards: boolean;
    alcohol: boolean;
    smoking: boolean;
    party: boolean;
    pets: boolean;
    available_only_family: boolean;
    playstation_3: boolean;
    playstation_4: boolean;
    playstation_5: boolean;
    air_conditioner: boolean;
    table_tennis: boolean;
    football_field: boolean;
    karaoke: boolean;
    sauna: boolean;
    jacuzzi: boolean;
    turkish_bath: boolean;
    indoor_swimming_pool: boolean;
    outdoor_swimming_pool: boolean;
    set: (updates: Partial<FilterState>) => void;
    reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    searchQuery: '',
    minPrice: '',
    maxPrice: '',
    region: '',
    district: '',
    city: '',
    country: '',
    wifi: false,
    sauna: false,
    pool: false,
    billiards: false,
    alcohol: false,
    smoking: false,
    party: false,
    pets: false,
    available_only_family: false,
    playstation_3: false,
    playstation_4: false,
    playstation_5: false,
    air_conditioner: false,
    table_tennis: false,
    football_field: false,
    karaoke: false,
    sauna: false,
    jacuzzi: false,
    turkish_bath: false,
    indoor_swimming_pool: false,
    outdoor_swimming_pool: false,
    set: (updates) => set((state) => ({ ...state, ...updates })),
    reset: () => set({
        searchQuery: '',
        minPrice: '',
        maxPrice: '',
        region: '',
        district: '',
        city: '',
        country: '',
        wifi: false,
        sauna: false,
        pool: false,
        billiards: false,
        alcohol: false,
        smoking: false,
        party: false,
        pets: false,
        available_only_family: false,
        playstation_3: false,
        playstation_4: false,
        playstation_5: false,
        air_conditioner: false,
        table_tennis: false,
        football_field: false,
        karaoke: false,
        sauna: false,
        jacuzzi: false,
        turkish_bath: false,
        indoor_swimming_pool: false,
        outdoor_swimming_pool: false,
    }),
}));
