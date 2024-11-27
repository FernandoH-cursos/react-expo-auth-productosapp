import { API_URL, productsApi } from "@/core/api/productsApi";
import { Gender, type Product } from "../interfaces/product";

const emptyProduct: Product = {
  id: '',
  title: 'Nuevo product',
  description: '',
  price: 0,
  stock: 0,
  images: [],
  slug: '',
  gender: Gender.MEN,
  sizes: [],
  tags: [],
}

export const getProductById = async (id: string): Promise<Product> => {
  //* Habilitando la creación de un nuevo producto para entrar a la página de creación 
  if (id === 'new') return emptyProduct;


  try {
    const { data } = await productsApi.get<Product>(`/products/${id}`);

    return {
      ...data,
      images: data.images.map(
        (image) => `${API_URL}/files/product/${image}`
      ),
    }
  } catch (error) {
    throw new Error(`Product with id ${id} not found`);
  }
};
