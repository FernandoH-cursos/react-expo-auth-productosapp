import { productsApi } from "@/core/api/productsApi";

export const deleteProductById = async (id: string): Promise<void> => {

  try {
    await productsApi.delete(`/products/${id}`);
  } catch (error) {
    throw new Error(`Product with id ${id} not found`);
  }
};
