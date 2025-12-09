import { MMKV } from "react-native-mmkv";

export const DATA_PREFIX = "tikeeti::";
export const storage = new MMKV({
  id: `${DATA_PREFIX}-storage`,
  encryptionKey: `${DATA_PREFIX}-encryptionKey`,
});

export function saveItem<T>(key: string, value: string | T) {
  if (typeof value === "object") {
    storage.set(`${DATA_PREFIX}${key}`, JSON.stringify(value));
  }
  if (typeof value === "string") {
    storage.set(`${DATA_PREFIX}${key}`, value);
  }
  if (typeof value === "boolean") {
    storage.set(`${DATA_PREFIX}${key}`, value);
  }
}

export function getItem(
  key: string,
  type: "string" | "boolean" | "number" | "object"
) {
  if (type === "object") {
    const got = storage.getString(`${DATA_PREFIX}${key}`);
    return got ? JSON.parse(got) : null;
  }
  if (type === "string") {
    return storage.getString(`${DATA_PREFIX}${key}`);
  }
  if (type === "boolean") {
    return storage.getBoolean(`${DATA_PREFIX}${key}`);
  }
  if (type === "number") {
    return storage.getNumber(`${DATA_PREFIX}${key}`);
  }
}

export function removeItem(key: string): void {
  storage.delete(`${DATA_PREFIX}${key}`);
}