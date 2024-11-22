import { authCheckStatus, authLogin } from "@/core/auth/actions/auth-actions";
import { User } from "@/core/auth/interface/user";

import { create } from "zustand";

export type AuthStatus = "authenticated" | "unauthenticated" | "checking";

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  login: (email: string, password: string) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;

  changeStatus: (token?: string, user?: User) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "checking",
  token: undefined,
  user: undefined,

  changeStatus: (token?: string, user?: User) => {
    if (!token || !user) {
      set({ status: "unauthenticated", token: undefined, user: undefined });

      // TODO: llamar logout

      return false;
    }

    set({ status: "authenticated", token, user });

    return true;
  },
  login: async (email: string, password: string) => {
    const res = await authLogin(email, password);

    return get().changeStatus(res?.token, res?.user);
  },
  checkStatus: async () => {
    const res = await authCheckStatus();

    get().changeStatus(res?.token, res?.user);  
  },
  logout: async () => {
    // TODO: Borrar el token del secure storage

    set({ status: "unauthenticated", token: undefined, user: undefined });
  },
}));
