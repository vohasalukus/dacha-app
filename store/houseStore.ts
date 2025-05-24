import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

export type HouseStatus = 'pending' | 'approved' | 'rejected';

export interface House {
    id: string;
    name: string;
    description: string;
    status: HouseStatus;
}

const statusToVerified = {
    pending: 'new',
    approved: 'verified',
    rejected: 'not_verified',
};

const verifiedToStatus = {
    new: 'pending',
    verified: 'approved',
    not_verified: 'rejected',
};

interface HouseState {
    houses: House[];
    updateStatus: (id: string, status: HouseStatus) => Promise<void>;
    fetchHouses: () => Promise<void>;
}

export const useHouseStore = create<HouseState>((set, get) => ({
    houses: [],

    updateStatus: async (id, status) => {
        const token = useAuthStore.getState().user?.access;
        await axios.patch(`http://10.0.2.2:8000/dacha/${id}/`, {
            is_verified: statusToVerified[status],
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        set((state) => ({
            houses: state.houses.map(h =>
                h.id === id ? { ...h, status } : h
            ),
        }));
    },

    fetchHouses: async () => {
        const token = useAuthStore.getState().user?.access;
        const { data } = await axios.get('http://10.0.2.2:8000/dacha/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const mapped = data.map((item: any) => ({
            id: String(item.id),
            name: item.name,
            description: item.description,
            status: verifiedToStatus[item.is_verified] as HouseStatus,
        }));

        set({ houses: mapped });
    },
}));
