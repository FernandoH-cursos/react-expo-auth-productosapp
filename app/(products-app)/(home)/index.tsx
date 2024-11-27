import { ActivityIndicator, View } from "react-native";

import { useProducts } from "@/presentation/products/hooks";
import { ProductList } from "@/presentation/products/components";
import { FAB } from "@/presentation/theme/components/FAB";
import { router } from "expo-router";

const HomeScreen = () => {

  const { queryProducts, loadNextPage } = useProducts();

  if (queryProducts.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={30} />
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <ProductList
        products={queryProducts.data?.pages.flatMap((page) => page) ?? []}
        loadNextPage={loadNextPage}
      />

      <FAB
        iconName="add-outline"
        onPress={() =>router.push("/product/new")}
      />
    </View>
  );
};

export default HomeScreen;
