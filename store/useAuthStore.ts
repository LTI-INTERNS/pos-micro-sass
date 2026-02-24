import { create } from 'zustand';
import { AuthState, User } from '@/types/user.types';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user: User | null) => set({ user }),
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null });
    },
}));
