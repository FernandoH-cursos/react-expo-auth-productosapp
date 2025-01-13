import { useRef, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { router } from "expo-router";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";

import { useCameraStore } from "@/presentation/store";
import { useThemeColor } from "@/presentation/theme/hooks";
import { ThemedText } from "@/presentation/theme/components";

import { Ionicons } from "@expo/vector-icons";

export default function CameraScreen() {
  const {addSelectedImage} = useCameraStore();

  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  const [selectedImage, setSelectedImage] = useState<string>();

  const cameraRef = useRef<CameraView>(null);

  //* Permite solicitar los permisos de cámara y galería al usuario. 
  const onRequestPermissions = async() => {
    try {
      const { status: cameraPermissionStatus } = await requestCameraPermission();
      if (cameraPermissionStatus !== "granted") {
        Alert.alert("Lo siento", "Necesitamos permiso para acceder a la cámara para tomar fotos.");
        return;
      }

      const { status: mediaPermissionStatus } = await requestMediaPermission();
      if (mediaPermissionStatus !== "granted") {
        Alert.alert(
          "Lo siento",
          "Necesitamos permiso para acceder a la galería para guardar las fotos tomadas."
        );
         return;
      }


    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Algo salió mal al solicitar los permisos.");
    }
  }

  if (!cameraPermission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!cameraPermission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View
        style={{
          ...styles.container,
          marginHorizontal: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.message}>
          Necesitamos permisos para acceder a la cámara y la galería.
        </Text>

        <TouchableOpacity onPress={onRequestPermissions}>
          <ThemedText>Solicitar permiso</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  //* Función que se ejecuta cuando se presiona el botón de tomar una foto.
  const onShutterButtonPress = async () => {
    if (!cameraRef.current) return;

    //* Toma una foto con la cámara y la guarda en la variable picture. 'quality' es un valor entre 0 y 1 que indica
    //* la calidad de la imagen.
    const picture = await cameraRef.current.takePictureAsync({
      quality: 0.7,
    });
    console.log(JSON.stringify(picture, null, 2));

    if (!picture?.uri) return;

    setSelectedImage(picture.uri);

  };

  //* Permite regresar a la pagina anterior de la camara
  const onReturnCancel = () => {

    router.dismiss();
  };

  //* Permite aceptar la imagen tomada y guardarla en la galería.
  const onPictureAccepted = async () => {
    console.log("Imagen aceptada");
    if (!selectedImage) return;

    //* Crea un recurso de imagen en la galería a partir de la imagen seleccionada. 
    await MediaLibrary.createAssetAsync(selectedImage);

    //* Agrega la imagen seleccionada al store de imágenes. 
    addSelectedImage(selectedImage);

    router.dismiss();
  };

  //* Permite volver a tomar una foto
  const onRetakePhoto = () => {
    setSelectedImage(undefined);
  };

  //* Permite seleccionar una imagen de la galería.
  const onPickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // Permite seleccionar solo una imagen.
      quality: 0.5,
      // 4:3 aspect ratio. Permite seleccionar la relación de aspecto de la imagen.
      aspect: [4, 3],
      // Permite al usuario editar la imagen antes de seleccionarla.
      // allowsEditing: true,
      // Permite seleccionar múltiples imágenes. 
      allowsMultipleSelection: true,
      // Permite seleccionar un máximo de 5 imágenes.
      selectionLimit: 5,
    });

    if (result.canceled) return;
    
    // console.log(JSON.stringify(result.assets, null, 2));
    //* Agrega las imágenes seleccionadas al store de imágenes. 
    result.assets.forEach((asset) => {
      addSelectedImage(asset.uri);
    });

    router.dismiss();

  }

  //* Permite cambiar el tipo de cámara (frontal o trasera)
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  if (selectedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: selectedImage }} style={styles.camera} />

        <ConfirmImageButton onPress={onPictureAccepted} />

        <RetakeImageButton onPress={onRetakePhoto} />

        <ReturnCancelButton onPress={onReturnCancel} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <ShutterButton onPress={onShutterButtonPress} />

        <FlipCameraButton onPress={toggleCameraFacing} />

        <GalleryButton onPress={onPickImages} />

        <ReturnCancelButton onPress={onReturnCancel} />
      </CameraView>
    </View>
  );
}

//? Custom Components

//* Botón para tomar una foto.
const ShutterButton = ({ onPress = () => {} }) => {
  const dimensions = useWindowDimensions();
  const primaryColor = useThemeColor({}, "primary");
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.shutterButton,
        {
          position: "absolute",
          bottom: 30,
          left: dimensions.width / 2 - 32, // Se resta la mitad del ancho del botón para centrarlo.
          borderColor: primaryColor,
        },
      ]}
    ></TouchableOpacity>
  );
};

//* Botón para abrir la galería de imágenes.
const GalleryButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity style={styles.galleryButton} onPress={onPress}>
      <Ionicons name="images-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};

//* Botón para cambiar el tipo de cámara ya sea frontal o trasera.
const FlipCameraButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity style={styles.flipCameraButton} onPress={onPress}>
      <Ionicons name="camera-reverse-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};

//* Botón para regresar a la pantalla anterior.
const ReturnCancelButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity style={styles.returnCancelButton} onPress={onPress}>
      <Ionicons name="arrow-back-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};

//* Botón para confirmar la imagen tomada.
const ConfirmImageButton = ({ onPress = () => {} }) => {
  const dimensions = useWindowDimensions();
  const primaryColor = useThemeColor({}, "primary");
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.shutterButton,
        {
          position: "absolute",
          bottom: 30,
          left: dimensions.width / 2 - 32, // Se resta la mitad del ancho del botón para centrarlo.
          borderColor: primaryColor,
        },
      ]}
    >
      <Ionicons name="checkmark-outline" size={30} color={primaryColor} />
    </TouchableOpacity>
  );
};

//* Botón para volver a tomar una foto.
const RetakeImageButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity style={styles.flipCameraButton} onPress={onPress}>
      <Ionicons name="close-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },

  shutterButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "white",
    // borderColor: "red",
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  flipCameraButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: "#17202A",
    position: "absolute",
    bottom: 40,
    right: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: "#17202A",
    position: "absolute",
    bottom: 40,
    left: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  returnCancelButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: "#17202A",
    position: "absolute",
    top: 40,
    left: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});
