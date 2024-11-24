import React, { useEffect } from "react";
import { View, ActivityIndicator, Text } from 'react-native';
import { Redirect, Stack } from "expo-router";

import {LogoutIconButton} from '../../presentation/auth/components';
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";


const CheckAuthenticationLayout = () => {
  const { status, checkStatus } = useAuthStore();
  //  console.log({status});

  const backgroundColor = useThemeColor({}, "background");

  //* Se ejecuta una sola vez cuando el componente se monta. Verifica si el usuario está autenticado. 
  useEffect(() => {
    checkStatus();
  }, []);

  //* Si el estado es 'checking' se muestra un indicador de carga. 
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

  //* Si el estado es 'unauthenticated' se redirige al usuario a la pantalla de login. 
  if (status === "unauthenticated") {
    //? Guardar la ruta del usuario 

    return <Redirect href="/auth/login" />;
  }

  //* 'headerShadowVisible' es una propiedad que se utiliza para mostrar u ocultar la sombra de la barra de navegación.
  //* Si el estado es 'authenticated' se muestra la pantalla de productos. 
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        contentStyle: {
          backgroundColor: backgroundColor,
        },
      }}
    >
      <Stack.Screen
        name="(home)/index"
        options={{
          title: "Productos",
          headerLeft: () => <LogoutIconButton />,
        }}
      />
    </Stack>
  );
};

export default CheckAuthenticationLayout;
