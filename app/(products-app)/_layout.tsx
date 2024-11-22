import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect, Stack } from "expo-router";

import { useAuthStore } from "@/presentation/auth/store/useAuthStore";

const CheckAuthenticationLayout = () => {
  const { status, checkStatus } = useAuthStore();

  useEffect(() => {
    checkStatus();
  }, []);

  if (status === "checking") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (status === "unauthenticated") {
    //? Guardar la ruta del usuario 

    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(home)/index"
        options={{
          title: "Productos",
        }}
      />
    </Stack>
  );
};

export default CheckAuthenticationLayout;
