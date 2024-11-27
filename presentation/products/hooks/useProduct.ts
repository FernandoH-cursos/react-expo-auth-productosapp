import { useRef } from "react";
import { Alert } from "react-native";

import { getProductById, updateCreateProduct } from "@/core/products/actions";
import { Product } from "@/core/products/interfaces";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useProduct = (productId: string) => {
  //* Guardar el id del producto en un ref para que no se pierda al cambiar el id 
  const productIdRef = useRef(productId);

  const queryClient = useQueryClient();

  const queryProduct = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const productMutation = useMutation({
    mutationFn:(data: Product) => updateCreateProduct({ ...data, id: productIdRef.current }),
    onSuccess: (data: Product) => {
      //* Cada vez que se cree o actualice un producto, se actualiza el id del producto actual para que no se pierda 
      productIdRef.current = data.id;

      //? Invalidar query para que se vuelva a hacer la petición
      queryClient.invalidateQueries({ queryKey: ["products","infinite"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });

      Alert.alert('Producto guardado',`${data.title} ha sido guardado correctamente`);
    },
    onError: (error) => {
      console.log(error);
      Alert.alert('Error', error.message);
    },
  });
 
 
  return {
    queryProduct,
    productMutation,
  };
}
