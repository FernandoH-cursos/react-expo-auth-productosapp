import { useEffect } from "react";

import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Redirect, useLocalSearchParams, useNavigation } from "expo-router";

import { useProduct } from "@/presentation/products/hooks";

import { useCameraStore } from "@/presentation/store";
import {
  ThemedButton,
  ThemedTextInput,
  ThemedView,
  ThemedButtonGroup,
} from "@/presentation/theme/components";
import { ProductImages } from "@/presentation/products/components";

import { Size } from "@/core/products/interfaces";
import { Formik } from "formik";

//* En <ThemedTextInput /> se puede agregar el prop `multiline` para que sea un textarea y `numberOfLines` para definir el número de
//* líneas que se mostrarán por defecto.
const ProductScreen = () => {
  const { selectedImages, clearImages } = useCameraStore();

  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const { queryProduct, productMutation } = useProduct(id as string);

  //* Limpiar las imágenes seleccionadas cuando se desmonte el componente.
  //* Es decir, cuando el usuario navegue a otra pantalla. 
  useEffect(() => {
    return () => {
      clearImages();
    };
  }, []);

  useEffect(() => {
    if (queryProduct.data) {
      //* Agregar el título del producto al header
      navigation.setOptions({
        title: queryProduct.data.title,
      });
    }
  }, [queryProduct.data]);

  if (queryProduct.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={30} />
      </View>
    );
  }

  if (!queryProduct.data) return <Redirect href="/" />;

  const product = queryProduct.data!;

  const sizesOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const gendersOptions = ["kid", "men", "women", "unisex"];

  return (
    <Formik
      initialValues={product}
      onSubmit={(productLike) => productMutation.mutate({
        ...productLike,
        images: [...product.images, ...selectedImages],
      })}
    >
      {({ values, handleSubmit, handleChange, setFieldValue }) => (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={queryProduct.isFetching}
                onRefresh={async() => await queryProduct.refetch()}
              />
            }
          >
            <ProductImages images={[...product.images, ...selectedImages]} />

            <ThemedView style={{ marginHorizontal: 10, marginTop: 20 }}>
              <ThemedTextInput
                value={values.title}
                onChangeText={handleChange("title")}
                placeholder="Título"
                style={{ marginVertical: 5 }}
              />

              <ThemedTextInput
                value={values.slug}
                onChangeText={handleChange("slug")}
                placeholder="Slug"
                style={{ marginVertical: 5 }}
              />

              <ThemedTextInput
                value={values.description}
                onChangeText={handleChange("description")}
                placeholder="Descripción"
                style={{ marginVertical: 5 }}
                numberOfLines={5}
                multiline
              />
            </ThemedView>

            <ThemedView
              style={{
                marginHorizontal: 10,
                marginVertical: 5,
                flexDirection: "row",
                gap: 10,
              }}
            >
              <ThemedTextInput
                value={values.price.toString()}
                onChangeText={handleChange("price")}
                placeholder="Precio"
                style={{ flex: 1 }}
              />
              <ThemedTextInput
                value={values.stock.toString()}
                onChangeText={handleChange("stock")}
                placeholder="Inventario"
                style={{ flex: 1 }}
              />
            </ThemedView>

            <ThemedView style={{ marginHorizontal: 10 }}>
              <ThemedButtonGroup
                options={sizesOptions}
                selectedOptions={values.sizes}
                onSelect={(selectedSize) => {
                  const newSizesValue = values.sizes.includes(
                    selectedSize as Size
                  )
                    ? values.sizes.filter((size) => size !== selectedSize)
                    : [...values.sizes, selectedSize];

                  setFieldValue("sizes", newSizesValue);
                }}
              />

              <ThemedButtonGroup
                options={gendersOptions}
                selectedOptions={[values.gender]}
                onSelect={(selectedOption) =>
                  setFieldValue("gender", selectedOption)
                }
              />
            </ThemedView>

            {/* Boton para guardar */}
            <View
              style={{
                marginHorizontal: 10,
                marginBottom: 50,
                marginTop: 20,
              }}
            >
              <ThemedButton icon="save-outline" onPress={() => handleSubmit()}>
                Guardar
              </ThemedButton>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};

export default ProductScreen;
