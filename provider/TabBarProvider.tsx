import { WHITE } from "@constants/colors";
import { StatusBar } from "expo-status-bar";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
// import { StatusBar } from "react-native";

interface TabBarContextType {
  isTabBarVisible: boolean;
  isStatusBarVisible: boolean;
  hideTabBar: () => void;
  showTabBar: () => void;
  setTabBarVisibility: (visible: boolean) => void;
  showStatusBar: () => void;
  hideStatusBar: () => void;
}

const TabBarContext = createContext<TabBarContextType>({
  isTabBarVisible: true,
  isStatusBarVisible: true,
  hideTabBar: () => {},
  showTabBar: () => {},
  setTabBarVisibility: () => {},
  showStatusBar: () => {},
  hideStatusBar: () => {},
});

interface TabBarProviderProps {
  children: ReactNode;
}

export const useTabBar = () => useContext(TabBarContext);

export const TabBarProvider: React.FC<TabBarProviderProps> = ({ children }) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(true);

  const hideTabBar = () => setIsTabBarVisible(false);
  const showTabBar = () => setIsTabBarVisible(true);
  const hideStatusBar = () => setIsStatusBarVisible(false);
  const showStatusBar = () => setIsStatusBarVisible(true);
  const setTabBarVisibility = (visible: boolean) => setIsTabBarVisible(visible);

  const value = useMemo(
    () => ({
      isTabBarVisible,
      isStatusBarVisible,
      hideTabBar,
      showTabBar,
      setTabBarVisibility,
      showStatusBar,
      hideStatusBar,
    }),
    [
      isTabBarVisible,
      isStatusBarVisible,
      hideTabBar,
      showTabBar,
      setTabBarVisibility,
      showStatusBar,
      hideStatusBar,
    ]
  );

  const memoChildren = useMemo(() => children, [children]);

  return (
    <TabBarContext.Provider value={value}>
      {memoChildren}
    </TabBarContext.Provider>
  );
};
