// services/asyncStorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Service for handling all AsyncStorage operations in the application
 */
class AsyncStorageService {
  /**
   * Get a value from storage by key
   * @param key - The storage key
   * @param defaultValue - Optional default value if key doesn't exist
   * @returns The stored value or default value
   */
  async get<T>(key: string, defaultValue?: T): Promise<T | undefined | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value) as T;
      }
      return defaultValue || null;
    } catch (error) {
      console.error(`Error getting item ${key} from AsyncStorage:`, error);
      return defaultValue || null;
    }
  }

  /**
   * Store a value with the given key
   * @param key - The storage key
   * @param value - The value to store
   * @returns Promise that resolves when storage is complete
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error setting item ${key} in AsyncStorage:`, error);
    }
  }

  /**
   * Remove a value from storage
   * @param key - The storage key to remove
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key} from AsyncStorage:`, error);
    }
  }

  /**
   * Clear all app storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  }

  /**
   * Get all keys stored in AsyncStorage
   * @returns Array of storage keys
   */
  async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys from AsyncStorage:', error);
      return [];
    }
  }

  /**
   * Multi-get for batch retrieval of storage items
   * @param keys - Array of keys to retrieve
   * @returns Array of key-value pairs
   */
  async multiGet(keys: readonly string[]): Promise<readonly [string, string | null][]> {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.error('Error with multiGet from AsyncStorage:', error);
      return [];
    }
  }
}

// Export as singleton
export const asyncStorageService = new AsyncStorageService();