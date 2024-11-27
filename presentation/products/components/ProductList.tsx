import { useState } from "react";
import { FlatList, RefreshControl } from "react-native";

import { Product } from "@/core/products/interfaces/product";
import { ProductCard } from "./ProductCard";

import { useQueryClient } from "@tanstack/react-query";

interface Props {
  products: Product[];
  loadNextPage: () => void;
}

//* En un <FlatList> el 'onEndReached' es un evento que se dispara cuando el usuario llega al final de la lista y se le puede pasar una
//* función para cargar más productos.
//* El 'onEndReachedThreshold' es un número entre 0 y 1 que indica la distancia en porcentaje que el usuario debe llegar al final de la
//* lista para que se dispare el evento 'onEndReached'. Es decir, si se le pasa 0.8, el evento se disparará cuando el usuario llegue al
//* 80% de la lista.
//* 'showsVerticalScrollIndicator' es una propiedad que indica si se muestra o no la barra de scroll vertical.

//* <RefreshControl> es un componente que se utiliza para hacer pull to refresh en una lista. Se le pasa la propiedad 'refreshing' que
//* indica si el usuario está haciendo pull to refresh y la propiedad 'onRefresh' que es la función que se dispara cuando el usuario
//* hace pull to refresh.

//* 'queryClient.invalidateQueries' invalida una query. Se le pasa un objeto con la propiedad 'queryKey' que es un array
//* con la queryKey de la query que se quiere invalidar. En este caso se invalida la query de los productos. con invalidar una query
//* nos referimos a que se vuelve a hacer la query para obtener los datos más actualizados.

export const ProductList = ({ products, loadNextPage }: Props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const queryClient = useQueryClient();

  //* Función que se dispara cuando el usuario hace pull to refresh 
  const onPullToRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    queryClient.invalidateQueries({
      queryKey: ["products", "infinite"],
    });

    setIsRefreshing(false);
  };

  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={(product) => product.id}
      renderItem={({ item }) => <ProductCard product={item} />}
      onEndReached={loadNextPage}
      onEndReachedThreshold={0.8}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onPullToRefresh} />
      }
    />
  );
};
