import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

export type ColorType = "system" | "light" | "dark";
export type Color = "light" | "dark";
type ThemeContext = {
  theme: Color | null | undefined;
  themeSwitch: ColorType;
  setTheme: Dispatch<SetStateAction<Color | null | undefined>>;
  setThemeSwitch: Dispatch<SetStateAction<ColorType>>;
};

const ThemeContext = createContext<ThemeContext>({
  theme: "light",
} as ThemeContext);
export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  // const [theme, setTheme] = useState<Color | null | undefined>(colorScheme);
  const [theme, setTheme] = useState<Color | null | undefined>("light");
  const [themeSwitch, setThemeSwitch] = useState<ColorType>("system");

  // useEffect(() => {
  //   if (themeSwitch === "system") {
  //     setTheme(colorScheme);
  //   }
  // }, [colorScheme, themeSwitch]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      themeSwitch,
      setThemeSwitch,
    }),
    [theme, setTheme, themeSwitch, setThemeSwitch]
  );

  const memoChildren = useMemo(() => children, [children]);

  return (
    <ThemeContext.Provider value={value}>{memoChildren}</ThemeContext.Provider>
  );
}
