// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { zustandAsyncStorage } from './zustandStorage';
import {Alert} from "react-native";

type Role = 'admin' | 'user';

type User = {
    email: string;
    role: Role;
    access: string;
    refresh: string;
};

interface AuthState {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string, re_password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,

            login: async (username, password) => {
                const { data } = await axios.post('http://10.0.2.2:8000/auth/jwt/create/', {
                    username,
                    password,
                });

                const token = data.access;
                const refresh = data.refresh;

                const profile = await axios.get('http://10.0.2.2:8000/auth/users/me/', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const role: Role = profile.data.is_staff ? 'admin' : 'user'; // ✅ правильное место
                console.log('🔍 Профиль пользователя:', profile.data);


                set({
                    user: {
                        email: profile.data.email,
                        role,
                        access: token,
                        refresh,
                    },
                });
            },

            register: async (email, username, password, re_password) => {
                try {
                    await axios.post('http://10.0.2.2:8000/auth/users/', {
                        email,
                        username,
                        password,
                        re_password,
                    });

                    await get().login(username, password);
                } catch (error: any) {
                    const data = error?.response?.data;

                    if (data) {
                        const messages = Object.entries(data)
                            .map(([field, value]) => `${field}: ${(value as string[]).join(', ')}`)
                            .join('\n');

                        Alert.alert('Ошибка,человек с таким именем пользователя уже существует');
                        console.error('❌ Ошибка регистрации:', data);
                    } else {
                        Alert.alert('Ошибка', error.message || 'Что-то пошло не так');
                    }
                }
            },


            logout: () => {
                set({ user: null });
            },
        }),
        {
            name: 'auth',
            storage: zustandAsyncStorage,
            onRehydrateStorage: () => {
                console.log('✅ Zustand: hydration started...');
                return (state) => {
                    console.log('✅ Zustand: hydration finished.', state);
                };
            },
        }
    )
);
