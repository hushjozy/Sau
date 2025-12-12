import {
  BLACK,
  BORDER as BORDER_COLOR,
  DANGER,
  PLACEHOLDER_COLOR,
  WHITE,
} from "@constants/colors";
import { useTheme } from "@provider/ThemeProvider";
import * as React from "react";
import {
  Text,
  Dimensions,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
// import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import Typography from "./Typography";
import { useTypedTranslation } from "@locales/i18nHelper";
import { TranslationKeys } from "@locales/translationKeys.ts";

interface Props extends TextInputType {
  label?: TranslationKeys | string;
  assistiveText?: TranslationKeys;
  error?: boolean;
  errorMessage?: TranslationKeys;
  success?: boolean;
  successMessage?: TranslationKeys;
  icon?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  assistiveStyle?: TextStyle;
  bottomSheet?: boolean;
}

type TextInputType = React.ComponentProps<typeof TextInput>;
const { width } = Dimensions.get("screen");

function TextField(props: Props, ref: React.Ref<TextInput>) {
  const { theme } = useTheme();
  const { t } = useTypedTranslation();

  const {
    label,
    assistiveText,
    error,
    errorMessage,
    success,
    successMessage,
    icon,
    containerStyle,
    inputStyle,
    assistiveStyle,
    prefixIcon,
    bottomSheet,
  } = props;
  const BG_COLOR = theme === "dark" ? "#0A0A0A" : "#F2F2F2";
  const TEXT_COLOR = theme === "dark" ? WHITE : BLACK;
  const BORDER = theme === "dark" ? "#242424" : "#BBC8CA";
  const PLACEHOLDER = theme === "dark" ? "#7D7D7D" : PLACEHOLDER_COLOR;

  return (
    <View>
      {label && <Typography style={{ marginBottom: 10 }}>{label}</Typography>}

      <View
        style={[
          {
            width: width * 0.9,
            height: 50,
            borderWidth: error ? 1.5 : success ? 1.5 : 1,
            borderColor: error ? DANGER : success ? "#1f8722" : BORDER,
            borderRadius: 8,
            backgroundColor: BG_COLOR,
            justifyContent: "space-between",
            flexDirection: "row",
            gap: 20,
            padding: 12,
            marginBottom: 8,
            ...containerStyle,
          },
        ]}
        className="max-w-[100%]"
      >
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          {prefixIcon && prefixIcon}

          <TextInput
            ref={ref}
            {...props}
            allowFontScaling={false}
            placeholderTextColor={PLACEHOLDER}
            style={[
              {
                width: icon ? "80%" : "100%",
                color: TEXT_COLOR,
                fontFamily: "Regular",
                height: 50,
              },
              inputStyle,
            ]}
          />
        </View>
        {icon && icon}
      </View>

      {!!assistiveText && !error && (
        <Typography
          allowFontScaling={false}
          style={{
            fontSize: 12,
            color: PLACEHOLDER_COLOR,
            marginBottom: 5,
            fontFamily: "Regular",
            ...assistiveStyle,
          }}
        >
          {assistiveText}
        </Typography>
      )}

      {errorMessage && (
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 12,
            color: DANGER,
            marginBottom: 5,
            fontFamily: "Regular",
          }}
        >
          {t(errorMessage)}
        </Text>
      )}

      {successMessage && (
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 12,
            color: "#1f8722",
            marginBottom: 5,
            fontFamily: "Regular",
          }}
        >
          {t(successMessage)}
        </Text>
      )}
    </View>
  );
}

export default React.forwardRef(TextField);
