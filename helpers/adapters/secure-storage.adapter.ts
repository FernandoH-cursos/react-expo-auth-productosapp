import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";

export class SecureStorageAdapter {
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      Alert.alert("Error", "Failed to save data");
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      const result = await SecureStore.getItemAsync(key);

      return result;
    }catch (error) {
      Alert.alert("Error", "Failed to get data");
      return null;
    }
  }

  static async deleteItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      Alert.alert("Error", "Failed to delete data");
    }
  }
}
