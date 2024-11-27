import { API_URL, productsApi } from "@/core/api/productsApi";
import type { Product } from "../interfaces/product";

export const getProducts = async (
  limit: number = 20,
  offset: number = 0
): Promise<Product[]> => {
  try {
    const { data } = await productsApi.get<Product[]>("/products", {
      params: {
        limit,
        offset,
      },
    });


    //* Formateando imagenes para que se muestren correctamente como URL de la API 
    return data.map((product) => ({
      ...product,
      images: product.images.map(
        (image) => `${API_URL}/files/product/${image}`
      ),
    }));

  } catch (error) {
    throw new Error("Unable to load products");
  }
};
