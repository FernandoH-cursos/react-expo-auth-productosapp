import { productsApi } from "@/core/api/productsApi";
import { Product } from "../interfaces";

export const updateCreateProduct = async (product: Partial<Product>) => {
  product.stock = isNaN(Number(product.stock)) ? 0 : Number(product.stock);
  product.price = isNaN(Number(product.price)) ? 0 : Number(product.price);

  if (product.id && product.id !== "new") {
    return updateProduct(product);
  }

  return createProduct(product);
};

const updateProduct = async (product: Partial<Product>) => {
  const { id, images = [], user, ...rest } = product;

  try {
    const { data } = await productsApi.patch<Product>(`/products/${id}`, {
      ...rest,
    });

    return data;
  } catch (error) {
    const errorMessage = (error as any).response?.data?.message;

    if (errorMessage) {
      throw new Error(errorMessage);
    }
    
    throw new Error("Error al actualizar el producto");
  }
};

const createProduct = async (product: Partial<Product>) => {
  const { id, images = [], user, ...rest } = product;

  try {
    const { data } = await productsApi.post<Product>(`/products`, {
      ...rest,
    });

    return data;
  } catch (error) {
    const errorMessage = (error as any).response?.data?.message;
    if (errorMessage) {
      throw new Error(errorMessage);
    }

    throw new Error("Error al crear el producto");
  }
};
