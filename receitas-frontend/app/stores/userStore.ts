import { defineStore } from "pinia";

interface UserData {
  id: number;
  login: string;
  access_token: string;
  nome?: string;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    data: null as UserData | null,
  }),
  actions: {
    setUserData(payload: UserData | null) {
      this.data = payload;
      localStorage.setItem("user", JSON.stringify(payload));
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.data,
    userName: (state) => state.data?.nome || 'Usuário',
  }
});
