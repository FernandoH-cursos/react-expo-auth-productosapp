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

const prepareImages = async (images: string[]): Promise<string[]> => {
  //* Separar las imágenes que son archivos locales de las que ya están guardadas en el servidor.
  const fileImages = images.filter((image) => image.startsWith("file://"));
  const currentImages = images.filter((image) => !image.startsWith("file://"));

  if (fileImages.length > 0) {
    //* Subir las imágenes al servidor. 
    const uploadPromises = fileImages.map((img) => uploadImage(img));
    const uploadedImages = await Promise.all(uploadPromises);

    currentImages.push(...uploadedImages);
  }

  //* Formatear las imágenes para que solo sean el nombre del archivo. 
  return currentImages.map((image) => image.split("/").pop()!);
};

const uploadImage = async(image: string): Promise<string> => {
  const formData = new FormData() as any;
  
  //* Agregar la imagen al formData con el nombre de "file" y valores uri, type y name que son necesarios para subir la imagen. 
  formData.append("file", {
    uri: image,
    type: "image/jpeg",
    name: image.split("/").pop()!,
  });

  try {
    const { data } = await productsApi.post<{ image: string }>(
      "/files/product",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data.image;
  } catch (error) {
    throw new Error("Error al subir la imagen");
  } 
}

const updateProduct = async (product: Partial<Product>) => {
  const { id, images = [], user, ...rest } = product;

  try {
    const checkImages = await prepareImages(images);

    const { data } = await productsApi.patch<Product>(`/products/${id}`, {
      ...rest,
      images: checkImages,
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
    const checkImages = await prepareImages(images);

    const { data } = await productsApi.post<Product>(`/products`, {
      ...rest,
      images: checkImages,
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
