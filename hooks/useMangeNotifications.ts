// import notifee, { EventType } from "@notifee/react-native";
import { useEffect } from "react";

export default function useMangeNotifications() {
  useEffect(() => {
    // const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
    //   if (type === EventType.PRESS) {
    //     notifee.cancelNotification(detail?.notification?.id as string);
    //     //handleNotificationPress(detail.notification?.data);
    //   }
    // });

    // notifee.onBackgroundEvent(async ({ type, detail }) => {
    //   if (type === EventType.PRESS) {
    //     notifee.cancelNotification(detail?.notification?.id as string);
    //     // handleNotificationPress(detail.notification?.data);
    //   }
    // });
    const unsubscribe = {};
  }, []);

  useEffect(() => {
    getInitialNotification();
  }, []);

  // For handling initial notification on app launch (from killed state)
  const getInitialNotification = async () => {
    //   const initialNotification = await notifee.getInitialNotification();
    //   if (initialNotification) {
    //     if (__DEV__) {
    //       console.log(
    //         "Notification caused app to open from quit state:",
    //         initialNotification
    //       );
    //     }
    //     await notifee.cancelNotification(
    //       initialNotification?.notification?.id as string
    //     );
    //     // handleNotificationPress(initialNotification.data);
    //   }
    // };

    return {};
  };
}
