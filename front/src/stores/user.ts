import { create } from 'zustand';

export interface User {
	account?: string;
	password?: string;
	name?: string;
	age?: number;
	gender?: string;
}

export interface UserStore {
	user: User | null;
	updateUser: (user: UserStore['user']) => void;
}

export const useUserStore = create<UserStore>((set) => ({
	user: null,
	updateUser(user) {
		set({
			user
		});
	}
}));