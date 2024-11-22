import { Platform } from "react-native";
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

// TODO: Interceptores

export { productsApi };