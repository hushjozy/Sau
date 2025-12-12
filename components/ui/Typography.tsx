import { BLACK, WHITE } from "@constants/colors";
import { useTypedTranslation } from "@locales/i18nHelper";
import { TranslationKeys } from "@locales/translationKeys.ts";
import { useTheme } from "@provider/ThemeProvider";
import { ComponentPropsWithRef, ReactNode, Ref, forwardRef } from "react";
import { Text, TextStyle } from "react-native";

interface Props extends TextType {
  children: ReactNode;
  style: TextStyle;
  translatedText?: TranslationKeys;
  interpolation?: Record<string, any>;
}

type TextType = ComponentPropsWithRef<typeof Text>;

function Typography(
  { children, style, translatedText, interpolation, ...props }: Props,
  ref: Ref<Text>
) {
  const { theme } = useTheme();

  const { t } = useTypedTranslation();

  const content =
    translatedText && typeof children === "string"
      ? t(translatedText, interpolation)
      : children;

  return (
    <Text
      allowFontScaling={false}
      style={{ fontFamily: "Regular", ...style }}
      ref={ref}
      {...props}
    >
      {content}
    </Text>
  );
}

export default forwardRef(Typography);
