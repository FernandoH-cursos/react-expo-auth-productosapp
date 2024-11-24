import { authCheckStatus, authLogin, authRegister } from "@/core/auth/actions/auth-actions";
import { User } from "@/core/auth/interface/user";

import { SecureStorageAdapter } from "@/helpers/adapters";

import { create } from "zustand";

export type AuthStatus = "authenticated" | "unauthenticated" | "checking";

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;

  changeStatus: (token?: string, user?: User) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "checking",
  token: undefined,
  user: undefined,

  changeStatus: async (token?: string, user?: User) => {
    if (!token || !user) {
      set({ status: "unauthenticated", token: undefined, user: undefined });

      //* llamar logout cuando no hay token o usuario
      get().logout();

      return false;
    }

    set({ status: "authenticated", token, user });

    //? Guardar token en secure storage
    await SecureStorageAdapter.setItem("token", token);

    return true;
  },
  login: async (email: string, password: string) => {
    const res = await authLogin(email, password);

    return get().changeStatus(res?.token, res?.user);
  },
  register: async (fullName: string, email: string, password: string) => { 
    const res = await authRegister(fullName, email, password);

    return get().changeStatus(res?.token, res?.user);
  },
  checkStatus: async () => {
    const res = await authCheckStatus();

    get().changeStatus(res?.token, res?.user);
  },
  logout: async () => {
    //? Borrar el token del secure storage
    await SecureStorageAdapter.deleteItem("token");

    set({ status: "unauthenticated", token: undefined, user: undefined });
  },
}));
