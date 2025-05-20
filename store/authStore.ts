// store/authStore.ts
import { create } from 'zustand';

type User = { email: string; role: 'admin' | 'user' };

interface AuthState {
    user: User | null;
    login: (email: string, password: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
    user: null,
    login: (email, password) => {
        // простая мок-проверка
        const role =
            email === 'admin@admin.com' && password === 'admin'
                ? 'admin'
                : 'user';
        set({ user: { email, role } });
    },
    logout: () => set({ user: null }),
}));
