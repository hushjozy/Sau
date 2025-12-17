import React, { ComponentPropsWithRef, Ref, forwardRef } from "react";
import {
  ActivityIndicator,
  ColorValue,
  DimensionValue,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { GRAY, PRIMARY, WHITE } from "@constants/colors";
import { useTheme } from "@provider/ThemeProvider";
import * as Haptics from "expo-haptics";
import { useTypedTranslation } from "@locales/i18nHelper";
import { TranslationKeys } from "@/locales/translationKeys.ts";

const screen = Dimensions.get("screen");

type ButtonType = ComponentPropsWithRef<typeof Pressable>;

interface Props extends ButtonType {
  onPress: () => void;
  label: TranslationKeys;
  loading?: boolean;
  loadingIcon?: React.ReactNode;
  backgroundColor?: ColorValue;
  width?: DimensionValue;
  height?: DimensionValue;
  color?: ColorValue;
  size?: number;
  prefixIcon?: React.ReactNode;
  buttonContainerStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
}

function Button(props: Props, ref: Ref<View>) {
  const { theme } = useTheme();
  const { t } = useTypedTranslation();

  const BG_COLOR = theme === "dark" ? PRIMARY : PRIMARY;

  const {
    onPress,
    label,
    loading = false,
    loadingIcon,
    backgroundColor = BG_COLOR,
    width = screen.width * 0.9,
    height = 60,
    color = WHITE,
    prefixIcon,
    disabled,
    buttonContainerStyle,
    buttonTextStyle,
    ...rest
  } = props;

  return (
    <Pressable
      ref={ref}
      onPress={() => {
        if (loading || disabled) return;
        Haptics.selectionAsync();
        onPress();
      }}
      disabled={loading || disabled}
      style={[
        styles.container,
        {
          width,
          height,
          backgroundColor: disabled || loading ? GRAY : backgroundColor,
        },
        buttonContainerStyle,
      ]}
      {...rest}
    >
      {loading ? (
        loadingIcon ?? <ActivityIndicator color={color} />
      ) : (
        <View style={styles.child}>
          {prefixIcon}
          <Text
            style={[
              styles.label,
              { color },
              buttonTextStyle,
            ]}
          >
            {t(label)}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export default forwardRef(Button);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    flexDirection: "row",
  },
  child: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontFamily: "SemiBold",
    fontSize: 16,
  },
});
