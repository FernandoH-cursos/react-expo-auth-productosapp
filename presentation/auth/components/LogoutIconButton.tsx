
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useThemeColor } from '@/presentation/theme/hooks';
import { useAuthStore } from '../store';

import { Ionicons } from '@expo/vector-icons';

export const LogoutIconButton = () => {
  const primaryColor = useThemeColor({}, 'primary');

  const { logout } = useAuthStore();

  return (
    <TouchableOpacity style={{ marginRight: 8 }} onPress={logout}>
      <Ionicons name="log-out-outline" size={24} color={primaryColor} />
    </TouchableOpacity>
  );
}
