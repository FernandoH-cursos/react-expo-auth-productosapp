import { productsApi } from "../api/productsApi";

export interface AuthResponse {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
  token: string;
}

const returnUserToken = (data: AuthResponse) => {
  const { token, ...user } = data;

  return { token, user };
};

export const authLogin = async (email: string, password: string) => {
  email = email.toLocaleLowerCase();

  try {
    const { data } = await productsApi.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    return returnUserToken(data);
  } catch (error) {
    console.log(error);
    return null;

  }
};

export const authRegister = async (fullName: string, email: string, password: string) => { 
  email = email.toLocaleLowerCase();

  try {
    const { data } = await productsApi.post<AuthResponse>("/auth/register", {
      fullName,
      email,
      password,
    });

    return returnUserToken(data);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const authCheckStatus = async () => {
  try {
    const { data } = await productsApi.get<AuthResponse>("/auth/check-status");
    // console.log(JSON.stringify(returnUserToken(data), null, 2));

    return returnUserToken(data);
  } catch (error) {
    console.log(error);
    return null;
  }
};

