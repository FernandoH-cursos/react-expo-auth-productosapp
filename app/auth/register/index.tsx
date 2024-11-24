import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";

import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import {
  ThemeButton,
  ThemedText,
  ThemedTextInput,
  ThemeLink,
} from "@/presentation/theme/components";
import { useAuthStore } from "@/presentation/auth/store";

const RegisterScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, "background");

  const { register } = useAuthStore();

  const [isPosting, setIsPosting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const onRegister = async () => {
    const { fullName, email, password } = form;


    if (fullName.length === 0 || email.length === 0 || password.length === 0) {
      console.log("Nombre, email y contraseña son requeridos");
      return;
    }

    setIsPosting(true);
    const wasSuccessfull = await register(fullName, email, password);
    setIsPosting(false);

    if (wasSuccessfull) {
      router.replace("/auth/login");
      return;
    }

    Alert.alert("Error", "No se pudo crear la cuenta");
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        style={{
          paddingHorizontal: 40,
          backgroundColor: backgroundColor,
        }}
      >
        {/* Titulo y subtitulo registro usuario */}
        <View
          style={{
            paddingTop: height * 0.35,
          }}
        >
          <ThemedText type="title">Crear cuenta</ThemedText>
          <ThemedText style={{ color: "grey" }}>
            Por favor crea una cuenta para continuar
          </ThemedText>
        </View>

        {/* Email y password */}
        <View style={{ marginTop: 20 }}>
          <ThemedTextInput
            value={form.fullName}
            onChangeText={(value) => setForm({ ...form, fullName: value })}
            placeholder="Nombre completo"
            autoCapitalize="words"
            icon="person-outline"
          />

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
        <ThemeButton onPress={onRegister} icon="arrow-forward-outline">
          Crear cuenta
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
          <ThemedText>¿Ya tienes una cuenta?</ThemedText>
          <ThemeLink href="/auth/login" style={{ marginHorizontal: 5 }}>
            Ingresar
          </ThemeLink>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
