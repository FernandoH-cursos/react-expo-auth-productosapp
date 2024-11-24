import { Platform } from "react-native";

import { SecureStorageAdapter } from "@/helpers/adapters/secure-storage.adapter";

import axios from "axios";


//? Conectar mediante envs vars, Android e IOS
const STAGE = process.env.EXPO_PUBLIC_STAGE || 'dev';

export const API_URL = 
  (STAGE === 'dev') 
    ? process.env.EXPO_PUBLIC_API_URL
    : Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_API_URL_IOS
      : process.env.EXPO_PUBLIC_API_URL_ANDROID;


const productsApi = axios.create({  
  baseURL: API_URL,
});


//* En axios un interceptor es un middleware que se ejecuta antes de que se envíe una solicitud o después de que se reciba una respuesta.
//* Se pueden utilizar para modificar la solicitud o la respuesta, agregar encabezados, manejar errores, etc.
//* Para agregar un interceptor se utiliza el método 'interceptors' del objeto 'axios'. Este método recibe dos parámetros, el primero es
//* el tipo de interceptor y el segundo es una función que se ejecuta antes de que se envíe la solicitud o después de que se reciba la
//* respuesta.

//* En este caso usamos este interceptor para agregar el token de autenticación a las solicitudes que se envíen al servidor.
productsApi.interceptors.request.use(async(config) => { 
  const token = await SecureStorageAdapter.getItem("token");

  if (token) { 
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export { productsApi };