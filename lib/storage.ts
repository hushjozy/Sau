import AsyncStorage from "@react-native-async-storage/async-storage";

export const DATA_PREFIX = "tikeeti::";

export async function saveItem<T>(key: string, value: string | T) {
  let storedValue = value;
  if (typeof value === "object") {
    storedValue = JSON.stringify(value);
  } else if (typeof value === "boolean") {
    storedValue = value ? "true" : "false";
  }
  await AsyncStorage.setItem(`${DATA_PREFIX}${key}`, storedValue as string);
}

export async function getItem<T>(
  key: string,
  type: "string" | "boolean" | "number" | "object"
): Promise<T | null> {
  const value = await AsyncStorage.getItem(`${DATA_PREFIX}${key}`);
  if (!value) return null;

  switch (type) {
    case "object":
      return JSON.parse(value) as T;
    case "boolean":
      return (value === "true") as unknown as T;
    case "number":
      return Number(value) as unknown as T;
    case "string":
      return value as unknown as T;
  }
}

export async function removeItem(key: string) {
  await AsyncStorage.removeItem(`${DATA_PREFIX}${key}`);
}
