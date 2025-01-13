import React from "react";
import { MenuIconButton } from "@/presentation/theme/components";
import { router } from "expo-router";
import { View, Image, FlatList } from "react-native";

interface Props {
  images: string[];
}

export const ProductImages = ({ images }: Props) => {
  
  if (images?.length == 0) {
    return (
      <>
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../../assets/images/no-product-image.png")}
            style={{ width: 300, height: 300 }}
          />
        </View>
        <View style={{alignItems: "flex-end" }}>
          <MenuIconButton
            onPress={() => router.push("/camera")}
            icon="camera-outline"
            style={{ marginRight: 10}}
          />
        </View>
      </>
    );
  }

  return (
    <FlatList
      data={images!}
      keyExtractor={(item) => item}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <Image
          source={{ uri: item }}
          style={{
            width: 300,
            height: 300,
            marginHorizontal: 7,
            borderRadius: 5,
          }}
        />
      )}
      horizontal
    />
  );
};
