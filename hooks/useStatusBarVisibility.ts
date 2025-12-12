import { useTabBar } from "@provider/TabBarProvider";
import { useTheme } from "@provider/ThemeProvider";
import { useEffect } from "react";

export const useStatusBarVisibility = (isStatusBarVisible: boolean = true) => {
  const { showStatusBar, hideStatusBar, isStatusBarVisible: isStatusBarVisibleTabBar } = useTabBar();
  useEffect(() => {
      console.log("isStatusBarVisible", isStatusBarVisibleTabBar)
    if (isStatusBarVisible) {
      showStatusBar();
    } else {
      hideStatusBar();
    }
    // Cleanup: show status bar when component unmounts
    return () => {
      showStatusBar();
    };
  }, [isStatusBarVisible, hideStatusBar, showStatusBar]);
};

export const useStatusBarControl = () => {
  const { isStatusBarVisible, showStatusBar, hideStatusBar } = useTabBar();

  return {
    showStatusBar,
    hideStatusBar,
    isStatusBarVisible,
  };
};
