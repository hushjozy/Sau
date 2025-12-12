import {
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
import React, { ComponentPropsWithRef, Ref, forwardRef } from "react";
import { GRAY, PRIMARY, WHITE } from "@constants/colors";
import { useTheme } from "@provider/ThemeProvider";
import * as Haptics from "expo-haptics";
import { useTypedTranslation } from "@locales/i18nHelper";
import { TranslationKeys } from "@locales/translationKeys.ts";

const screen = Dimensions.get("screen");

interface Props extends ButtonType {
  onPress: () => void;
  label: TranslationKeys;
  loading?: React.ReactNode;
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

type ButtonType = ComponentPropsWithRef<typeof Pressable>;

function Button(props: Props, ref: Ref<View>) {
  const { theme } = useTheme();

  const { t } = useTypedTranslation();

  const BG_COLOR = theme === "dark" ? PRIMARY : PRIMARY;

  const {
    onPress,
    label,
    loading,
    loadingIcon = <>/</>,
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
    <>
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          onPress();
        }}
        style={[
          styles.container,

          {
            width: width,
            height: height,
            backgroundColor: disabled ? GRAY : backgroundColor,
            borderRadius: 8,
          },
        ]}
        ref={ref}
        {...rest}
      >
        {loading ? (
          loadingIcon
        ) : (
          <View style={styles.child}>
            {prefixIcon && prefixIcon}
            <Text style={{ fontFamily: "SemiBold", color }}>{t(label)}</Text>
          </View>
        )}
      </Pressable>
    </>
  );
}

export default forwardRef(Button);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  child: {
    gap: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});
