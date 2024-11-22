import { KeyboardAvoidingView, useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import {
  ThemeButton,
  ThemedText,
  ThemedTextInput,
  ThemeLink,
} from "@/presentation/theme/components";

//* <KeyboardAvoidingView> es un componente que se utiliza para ajustar automáticamente la posición de los elementos cuando el
//* teclado aparece o desaparece.
//* behavior: 'padding' ajusta la posición de los elementos para que no se oculten por el teclado.

//* <ScrollView> de 'react-native-gesture-handler' es un componente que permite hacer scroll en la pantalla. Es necesario para que el
//* contenido de la pantalla sea desplazable.

//* El hook useWindowDimensions() permite obtener las dimensiones de la ventana del dispositivo. Se puede obtener la altura y ancho de la
//* ventana. Es necesario para ajustar el tamaño de los elementos de la pantalla.

const LoginScreen = () => {
  const { height } = useWindowDimensions();
  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView
        style={{
          paddingHorizontal: 40,
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
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />

          <ThemedTextInput
            placeholder="Contraseña"
            secureTextEntry
            autoCapitalize="none"
            icon="lock-closed-outline"
          />
        </View>

        <View style={{ marginTop: 10 }} />

        {/* Boton ingresar */}
        <ThemeButton icon="arrow-forward-outline">Ingresar</ThemeButton>

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
