import { useThemeColor } from "../hooks/useThemeColor";

import { PressableProps, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

interface Props extends PressableProps {
  children?: React.ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

export const ThemedButton = ({ children, icon,iconColor = "white", ...rest }: Props) => {
  const primaryColor = useThemeColor({}, "primary");
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: children
            ? pressed
              ? primaryColor + "90"
              : primaryColor
            : "transparent",
          color: !children
            ? pressed
              ? iconColor + "80"
              : primaryColor
            : "transparent",
        },
        children ? styles.button : "",
      ]}
      {...rest}
    >
      {children && <Text style={{ color: "white" }}>{children}</Text>}

      {icon && (
        <Ionicons
          name={icon}
          size={24}
          color={iconColor}
          style={{ marginHorizontal: 5 }}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
