import { useEffect } from 'react';
import { useTabBar } from '@provider/TabBarProvider';

// Define screens where tab bar should be hidden by default
const HIDDEN_TAB_SCREENS = [
  'NewChat',
  'ChatWithSupport',
  'PolicyUpdates',
  'Notification',
  'OrgChart',
  'ChatWithEmployeesDetails',
  'NewChatWithEmployees',
  'NewAIChat',
  'AgentResponse',
];

export const useTabBarVisibility = (screenName?: string) => {
  const { hideTabBar, showTabBar } = useTabBar();

  useEffect(() => {
    if (screenName && HIDDEN_TAB_SCREENS.includes(screenName)) {
      hideTabBar();
    } else {
      showTabBar();
    }

    // Cleanup: show tab bar when component unmounts
    return () => {
      showTabBar();
    };
  }, [screenName, hideTabBar, showTabBar]);

  return { hideTabBar, showTabBar };
};

// Hook for manual control
export const useTabBarControl = () => {
  const { hideTabBar, showTabBar, isTabBarVisible } = useTabBar();
  
  return {
    hideTabBar,
    showTabBar,
    isTabBarVisible,
  };
}; 