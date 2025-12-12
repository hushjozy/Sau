import React, { useState, useRef, useEffect } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputSelectionChangeEventData,
  Dimensions,
  Keyboard,
  Platform,
} from "react-native";
// import * as Clipboard from "expo-clipboard";
import { BLACK, BORDER, DANGER, PRIMARY, WHITE } from "@constants/colors";
import { useTheme } from "@provider/ThemeProvider";

const { width } = Dimensions.get("screen");

interface OtpInputProps {
  length: number;
  onOtpChange: (otp: string) => void;
  error?: boolean;
}

function OtpInput({ length, onOtpChange, error }: OtpInputProps) {
  const { theme } = useTheme();
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<TextInput[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    // When component mounts, ensure keyboard opens with the first input
    // First dismiss any existing keyboard to reset state
    Keyboard.dismiss();

    // Platform-specific handling for keyboard focus issues
    const timer = setTimeout(() => {
      // Focus on the first input which should trigger the keyboard
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
        // On Android, sometimes we need to blur and focus again to show keyboard

        if (Platform.OS === "android") {
          setTimeout(() => {
            inputRefs.current[0]?.blur();
            setTimeout(() => inputRefs.current[0]?.focus(), 50);
          }, 50);
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  // Handle input change
  const handleChange = async (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input
    if (value !== "" && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (value !== "" && index === length - 1) {
      inputRefs.current[index].blur();
    }
    // Notify parent component about the OTP change
    onOtpChange(newOtp.join(""));
  };

  const handleKeyDown = (
    index: number,
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (
      event.nativeEvent.key === "Backspace" &&
      otp[index] === "" &&
      index > 0
    ) {
      // Move focus to the previous input on Backspace press
      inputRefs.current[index - 1].focus();

      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);

      // Notify parent component about the OTP change
      onOtpChange(newOtp.join(""));
    }
  };

  const handlePaste = async (index: number, content: string) => {
    const newOtp = [...otp];

    // Update each input value with the pasted data
    const pasteData = content.slice(0, length - index);
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[index + i] = pasteData[i];
    }

    setOtp(newOtp);

    if (content !== "" && content.length < length) {
      inputRefs.current[content.length].focus();
    } else {
      inputRefs.current[content.length - 1].focus();
    }

    // // Notify parent component about the OTP change
    onOtpChange(newOtp.join(""));
  };

  const handleSelectionChange = async (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
    index: number
  ) => {
    const { end, start } = e.nativeEvent.selection;

    // Detect if a paste action occurred (selection start and end are different)
    if (start > 1 && end > 1) {
      try {
        // const copiedContent = await Clipboard.getStringAsync();
        // if (copiedContent === "") return;
        // handlePaste(index, copiedContent);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFocus = (index: number) => {
    // Select the input value on focus
    setActiveIndex(index);
    inputRefs.current[index]?.setNativeProps({
      selection: { start: 0, end: 1 },
    });
  };

  const BG_COLOR = theme === "dark" ? "#0a0a0a80" : BORDER;
  const TEXT_COLOR = theme === "dark" ? WHITE : BLACK;
  const BORDER_ACTIVE = theme === "dark" ? "#E2E2E2" : "#191717";
  const BORDER_COLOR = theme === "dark" ? "#242424" : "#E2E2E2";

  return (
    <View style={styles.container}>
      {otp.map((value, index) => (
        <TextInput
          key={index}
          style={[
            styles.input,
            {
              backgroundColor: BG_COLOR,
              color: TEXT_COLOR,
              borderColor: error
                ? DANGER
                : value.length > 0 ||
                  // (inputRefs.current[index] && inputRefs.current[index].isFocused())
                  activeIndex === index
                ? PRIMARY
                : BORDER_COLOR,
              borderWidth: value.length > 0 || activeIndex === index ? 1.2 : 1,
            },
          ]}
          maxLength={length}
          keyboardType="numeric"
          value={value}
          onChangeText={(text) => handleChange(index, text)}
          onKeyPress={(e) => handleKeyDown(index, e)}
          onSelectionChange={(e) => handleSelectionChange(e, index)}
          onFocus={() => handleFocus(index)}
          //   onBlur={() => (activeIndex.current = -1)}
          // ref={inputRefs.current[index]}
          ref={(ref) => {
            if (ref) inputRefs.current[index] = ref;
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  input: {
    marginHorizontal: 10,
    padding: 10,
    fontSize: 22,
    width: width * 0.18,
    borderRadius: 8,
    height: 70,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default OtpInput;
