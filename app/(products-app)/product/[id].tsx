import { useEffect } from "react";

import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  ActivityIndicator,
} from "react-native";
import { Redirect, useLocalSearchParams, useNavigation } from "expo-router";

import { useProduct } from "@/presentation/products/hooks";

import {
  ThemeButton,
  ThemedTextInput,
  ThemedView,
  ThemedButtonGroup,
} from "@/presentation/theme/components";
import { ProductImages } from "@/presentation/products/components";

import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import { Size } from "@/core/products/interfaces";
import { useThemeColor } from "@/presentation/theme/hooks";

//* En <ThemedTextInput /> se puede agregar el prop `multiline` para que sea un textarea y `numberOfLines` para definir el número de
//* líneas que se mostrarán por defecto.
const ProductScreen = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const textColor = useThemeColor({},"text");

  const { queryProduct,productMutation } = useProduct(id as string);

  useEffect(() => {
    //* Agregando un icono a la derecha del header
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="camera-outline"
          size={25}
          style={{ color: textColor }}
        />
      ),
    });
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
      onSubmit={(productLike) => productMutation.mutate(productLike)}
    >
      {({ values, handleSubmit, handleChange, setFieldValue }) => (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView>
            <ProductImages images={values.images} />

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
                  const newSizesValue = values.sizes.includes(selectedSize as Size)
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
              <ThemeButton
                icon="save-outline"
                onPress={() => handleSubmit()}
              >
                Guardar
              </ThemeButton>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};

export default ProductScreen;
