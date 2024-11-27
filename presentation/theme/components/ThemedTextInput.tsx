import { useRef, useState } from 'react';
import { useThemeColor } from '../hooks/useThemeColor';

import { View, TextInputProps, StyleSheet, ViewStyle } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native-gesture-handler';

interface Props extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
}

//* El evento 'onTouchStart' se dispara cuando se toca el componente y se mantiene presionado. 
//*  'inputRef.current?.focus()' se utiliza para enfocar el input cuando se toca el componente.
export const ThemedTextInput = ({ icon,style, ...rest }: Props & { style?: ViewStyle }) => {
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');

  return (
    <View
      style={[
        {
          ...styles.border,
          borderColor: isActive ? primaryColor : "#ccc",
        },
        style,
      ]}
      onTouchStart={() => inputRef.current?.focus()}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={24}
          color={textColor}
          style={{ marginRight: 10 }}
        />
      )}

      <TextInput
        ref={inputRef}
        placeholderTextColor="#5c5c5c"
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        style={{
          color: textColor,
          marginRight: 10,
          flex: 1,
        }}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  }
});
