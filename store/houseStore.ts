// store/houseStore.ts
import { create } from 'zustand';

export type HouseStatus = 'pending' | 'approved' | 'rejected';

export interface House {
    id: string;
    name: string;
    description: string;
    status: HouseStatus;
}

interface HouseState {
    houses: House[];
    updateStatus: (id: string, status: HouseStatus) => void;
}

export const useHouseStore = create<HouseState>((set) => ({
    houses: [
        { id: '1', name: 'Дача в лесу', description: 'Уютная...', status: 'pending' },
        { id: '2', name: 'Дача у озера', description: 'Роскошная...', status: 'pending' },
        { id: '3', name: 'Дача в горах', description: 'Тихая...', status: 'pending' },
    ],
    updateStatus: (id, status) =>
        set((state) => ({
            houses: state.houses.map((h) => (h.id === id ? { ...h, status } : h)),
        })),
}));
