import { Alert } from "react-native";

import { deleteProductById } from "@/core/products/actions";

import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteProduct = (productId: string, productTitle: string) => {
  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation({
    mutationFn: () => deleteProductById(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "infinite"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });

      router.push("/");

      Alert.alert(
        "Producto eliminado",
        `El producto '${productTitle}' ha sido eliminado correctamente`
      );
    },
    onError: (error) => {
      console.log(error);
      Alert.alert("Error", error.message);
    },
  });

  const deleteProduct = () => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar el producto?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => {
            console.log("Cancelado");
          },
        },
        {
          text: "Eliminar",
          onPress: () => {
            deleteProductMutation.mutate();
          },
          style: "destructive",
        },
      ]
    );
  };

  return {
    deleteProduct,
  };
};
