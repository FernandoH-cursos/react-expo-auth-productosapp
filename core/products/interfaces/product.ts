import { User } from "@/core/auth/interfaces/user";

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: Size[];
  gender: Gender;
  tags: string[];
  user?: User;
  images: string[];
}

export enum Gender{
  KID = "kid",
  MEN = "men",
  WOMEN = "women",
}

export enum Size{
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
  XXXL = "XXXL"
}
