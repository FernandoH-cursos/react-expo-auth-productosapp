import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'

import { useThemeColor } from '../hooks';

import { Ionicons } from '@expo/vector-icons';

interface Props {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

export const MenuIconButton = ({ onPress, icon,style }: Props) => {
  const primaryColor = useThemeColor({}, "primary");

  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Ionicons name={icon} size={25} color={primaryColor} />
    </TouchableOpacity>
  );
}
