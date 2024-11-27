import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { useThemeColor } from "../hooks";

import { FormatterAdapter } from "@/helpers/adapters";

interface Props {
  options: string[];
  selectedOptions: string[];
  onSelect: (option: string) => void;
}

export const ThemedButtonGroup = ({
  options,
  selectedOptions,
  onSelect,
}: Props) => {
  const theme = useColorScheme();

  const primaryColor = useThemeColor({}, "primary");


  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => onSelect(option)}
          style={[
            styles.button,
            selectedOptions.includes(option) && {
              backgroundColor: primaryColor,
            },
          ]}
        >
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.buttonText,
              selectedOptions.includes(option) && styles.selectedButtonText,
              theme === "dark" && { color: "#fff" },
            ]}
          >
            {FormatterAdapter.capitalize(option)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
  },
  selectedButtonText: {
    color: "#fff",
  },
});
