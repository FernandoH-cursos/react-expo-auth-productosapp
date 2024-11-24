import { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";

import { useThemeColor } from "@/presentation/theme/hooks";

import {
  ThemeButton,
  ThemedText,
  ThemedTextInput,
  ThemeLink,
} from "@/presentation/theme/components";
import { useAuthStore } from "@/presentation/auth/store";

//* <KeyboardAvoidingView> es un componente que se utiliza para ajustar automáticamente la posición de los elementos cuando el
//* teclado aparece o desaparece.
//* behavior: 'padding' ajusta la posición de los elementos para que no se oculten por el teclado.

//* <ScrollView> de 'react-native-gesture-handler' es un componente que permite hacer scroll en la pantalla. Es necesario para que el
//* contenido de la pantalla sea desplazable.

//* El hook useWindowDimensions() permite obtener las dimensiones de la ventana del dispositivo. Se puede obtener la altura y ancho de la
//* ventana. Es necesario para ajustar el tamaño de los elementos de la pantalla.

//* El evento 'onChangeText' se dispara cuando el texto de un input cambia. Se utiliza para actualizar el estado del formulario. Por otro
//* lado el evento 'onChange' se dispara cuando el valor de un input cambia. Se utiliza para actualizar el estado del formulario.

//* 'Alert' es un componente que se utiliza para mostrar mensajes emergentes en la aplicación. Se utiliza para mostrar mensajes de error o
//* confirmación. El método 'alert()' recibe dos parámetros, el primero es el título del mensaje y el segundo es el contenido del mensaje.

const LoginScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, "background");

  const { login } = useAuthStore();

  const [isPosting, setIsPosting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onLogin = async () => {
    const { email, password } = form;

    if (email.length === 0 || password.length === 0) {
      console.log("Email y contraseña son requeridos");
      return;
    }

    setIsPosting(true);
    const wasSuccessfull = await login(email, password);
    setIsPosting(false);

    if (wasSuccessfull) {
      router.replace("/");
      return;
    }

    Alert.alert("Error", "Usuario o contraseña no son correctos");
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        style={{
          paddingHorizontal: 40,
          backgroundColor: backgroundColor,
        }}
      >
        {/* Titulo y subtitulo login */}
        <View
          style={{
            paddingTop: height * 0.35,
          }}
        >
          <ThemedText type="title">Ingresar</ThemedText>
          <ThemedText style={{ color: "grey" }}>
            Por favor ingrese para continuar
          </ThemedText>
        </View>

        {/* Email y password */}
        <View style={{ marginTop: 20 }}>
          <ThemedTextInput
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />

          <ThemedTextInput
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
            placeholder="Contraseña"
            secureTextEntry
            autoCapitalize="none"
            icon="lock-closed-outline"
          />
        </View>

        <View style={{ marginTop: 10 }} />

        {/* Boton ingresar */}
        <ThemeButton
          onPress={onLogin}
          icon="arrow-forward-outline"
          disabled={isPosting}
        >
          Ingresar
        </ThemeButton>

        <View style={{ marginTop: 50 }} />

        {/* Enlace de registro de usuario */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThemedText>¿No tienes cuenta?</ThemedText>
          <ThemeLink href="/auth/register" style={{ marginHorizontal: 5 }}>
            Crear cuenta
          </ThemeLink>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
