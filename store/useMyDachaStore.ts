import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

interface Dacha {
    id: number;
    name: string;
    description: string;
    is_verified: string;
    [key: string]: any;
}

interface MyDachaState {
    myDachas: Dacha[];
    fetchMyDachas: () => Promise<void>;
}

export const useMyDachaStore = create<MyDachaState>((set) => ({
    myDachas: [],
    fetchMyDachas: async () => {
        const token = useAuthStore.getState().user?.access;
        if (!token) return;

        try {
            const res = await axios.get('http://10.0.2.2:8000/dacha/my_dachas/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ myDachas: res.data });
        } catch (err) {
            console.error('Ошибка загрузки моих дач', err);
        }
    },
}));
