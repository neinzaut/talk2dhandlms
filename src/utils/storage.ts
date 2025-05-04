// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = {
  SELECTED_LANGUAGE: 'selectedLanguage',
};

export const Storage = {
  // Save data
  setItem: async (key: keyof typeof STORAGE_KEY, value: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY[key], value);
    } catch (error) {
      console.error(`Storage Error: Failed to save ${key}`, error);
      throw error;
    }
  },

  // Get data
  getItem: async (key: keyof typeof STORAGE_KEY) => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEY[key]);
    } catch (error) {
      console.error(`Storage Error: Failed to get ${key}`, error);
      throw error;
    }
  },

  // Remove data
  removeItem: async (key: keyof typeof STORAGE_KEY) => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY[key]);
    } catch (error) {
      console.error(`Storage Error: Failed to remove ${key}`, error);
      throw error;
    }
  },
};