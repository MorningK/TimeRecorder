import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStorageItem = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
  return value;
};

export const getStorageItem = async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const removeStorageItem = async (key: string) => {
  const value = await getStorageItem(key);
  await AsyncStorage.removeItem(key);
  return value;
};
