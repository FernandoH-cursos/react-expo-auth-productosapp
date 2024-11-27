import { getProducts } from "@/core/products/actions/get-products.action";
import { useInfiniteQuery } from "@tanstack/react-query";


//* El hook 'useInfinteQuery' de react query se utiliza para realizar consultas infinitas. Es decir, se pueden realizar consultas
//* que devuelvan un número indefinido de resultados.

//* El argumento 'staleTime' se utiliza para definir el tiempo que debe pasar antes de que los datos se consideren obsoletos. Es decir,
//* si se realiza una consulta y se obtienen los datos, estos datos se almacenarán en caché y no se volverán a solicitar hasta que
//* haya pasado el tiempo definido en 'staleTime'.

//* El argumento 'initialPageParam' se utiliza para definir el valor inicial de la página. En este caso, se establece en 0. Es decir,
//* la primera página que se solicitará será la página 0.

//* El método 'getNextPageParam()' se utiliza para definir cómo se obtendrá el siguiente valor de la página. En este caso, se obtiene
//* el número de páginas que se han solicitado hasta el momento. Recibe dos argumentos: 'lastPage' y 'allPages'. 'lastPage' es el último
//* conjunto de datos que se ha obtenido y 'allPages' es un array con todos los conjuntos de datos que se han obtenido hasta el momento.

//* 'queryProducts.fetchNextPage()' es un método que se utiliza para solicitar la siguiente página de datos. Se utiliza para cargar más
//* datos a medida que el usuario se desplaza por la lista de productos.

export const useProducts = () => { 
  const queryProducts = useInfiniteQuery({
    queryKey: ["products", "infinite"],
    queryFn: ({ pageParam }) => getProducts(20, pageParam * 20),
    staleTime: 1000 * 60 * 60, // 1 hour
    initialPageParam: 0,
    getNextPageParam: (lastPage,allPages) => {
      return allPages.length;
    }
  });

  return {
    queryProducts,

    // Methods
    loadNextPage: queryProducts.fetchNextPage,
  };
};
