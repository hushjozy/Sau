import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

type KeyboardStatus = "Keyboard Shown" | "Keyboard Hidden" | undefined;

export default function useKeyboardStatus() {
  const [keyboardStatus, setKeyboardStatus] = useState<KeyboardStatus>();

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus("Keyboard Shown");
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus("Keyboard Hidden");
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return { keyboardStatus, setKeyboardStatus };
}
