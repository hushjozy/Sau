import { ChatMessage } from "@hooks/useHubChat";
import { ChatMessageHistory } from "@hooks/useSignalRHubChat";
import { getItem, saveItem } from "@lib/storage";
import { IUser } from "@services/models/users";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Audio } from "expo-av";
import { Pressable, Text } from "react-native";

type IContext = {
  isUnlocked: boolean;
  authenticate: () => void;
  unauthenticate: () => void;
  FCM_TOKEN: string | undefined;
  updateFCM_TOKEN: (token: string) => void;
  user: IUser | null;
  chatHistory: ChatMessageHistory[];
  chatHistoryCache: {
    existingChatId: string;
    messages: ChatMessage[];
  }[];
  updateUserDetails: (user: IUser | null) => void;
  updateChatHistory: (user: ChatMessageHistory[]) => void;
  updateChatHistoryCache: (
    messages: ChatMessage[],
    existingChatId: string
  ) => void;
};

const UserContext = createContext<IContext>({
  isUnlocked: false,
  authenticate: () => {},
  unauthenticate: () => {},
  FCM_TOKEN: undefined,
  updateFCM_TOKEN: () => {},
  user: null,
  chatHistory: [],
  chatHistoryCache: [],
  updateUserDetails: () => {},
  updateChatHistory: () => {},
  updateChatHistoryCache: () => {},
});

export async function playMessageSound(file: string) {
  try {
    // if (file === "send") {
    //   const { sound: send } = await Audio.Sound.createAsync(
    //     require("@assets/sounds/send.mp3"), // 👈 your local sound file
    //     { shouldPlay: true } // plays immediately
    //   );
    //   send.setOnPlaybackStatusUpdate((status) => {
    //     if (status.isLoaded && status.didJustFinish) {
    //       send.unloadAsync();
    //     }
    //   });
    // } else {
    //   const { sound: receive } = await Audio.Sound.createAsync(
    //     require("@assets/sounds/incoming.mp3"), // 👈 your local sound file
    //     { shouldPlay: true } // plays immediately
    //   );
    //   receive.setOnPlaybackStatusUpdate((status) => {
    //     if (status.isLoaded && status.didJustFinish) {
    //       receive.unloadAsync();
    //     }
    //   });
    // }
    // Optionally unload when done
  } catch (error) {
    console.warn("Failed to play sound", error);
  }
}
export function simulateFirebaseMessage(
  showToastModal,
  navigation,
  notificationAction
) {
  const fakeMessage = {
    messageId: "local-test-001",
    notification: {
      title: "Simulated Notification",
      body: "This mimics a Firebase push message",
    },
    data: {
      action: { path: "chat", id: "abc123" },
    },
  };

  console.log("🔔 Simulating Firebase message:", fakeMessage);

  showToastModal(
    {
      title: fakeMessage.notification.title,
      description: fakeMessage.notification.body,
      type: "success",
      duration: 130000,
      toastAction: (
        <Pressable
          className="bg-green-600 w-[60px] h-[30px] rounded-md mt-1 flex justify-center items-center"
          onPress={() =>
            notificationAction?.(
              fakeMessage.data.action.path,
              fakeMessage.data.action.id,
              navigation.navigate
            )
          }
        >
          <Text className="!text-white font-bold">Open</Text>
        </Pressable>
      ),
    },
    true
  );
}
export const useUser = () => useContext(UserContext);

export default function UserProvider({ children }: PropsWithChildren) {
  const [isUnlocked, setIsUnlocked] = useState(
    !!getItem("accessToken", "string")
  );
  const [user, setUser] = useState<IUser | null>(getItem("user", "object"));
  const [FCM_TOKEN, setFCM_TOKEN] = useState<string | undefined>();
  const [chatHistory, setChatHistory] = useState<ChatMessageHistory[]>([]);
  const [chatHistoryCache, setChatHistoryCache] = useState<
    { existingChatId: string; messages: ChatMessage[] }[]
  >([]);
  const authenticate = () => setIsUnlocked(true);
  const unauthenticate = () => setIsUnlocked(false);

  const updateFCM_TOKEN = useCallback((fcmToken: string) => {
    setFCM_TOKEN(fcmToken);
  }, []);

  const updateUserDetails = useCallback((user: IUser | null) => {
    setUser(user);
    saveItem("user", user);
  }, []);

  const updateChatHistory = useCallback((history: ChatMessageHistory[]) => {
    setChatHistory(history);
  }, []);

  const updateChatHistoryCache = useCallback(
    (messages: ChatMessage[], existingChatId: string) => {
      const newChat = chatHistoryCache?.filter(
        (c) => c.existingChatId !== existingChatId
      );

      setChatHistoryCache([
        ...newChat,
        {
          existingChatId,
          messages,
        },
      ]);
    },
    []
  );

  const values = useMemo(
    () => ({
      isUnlocked,
      authenticate,
      unauthenticate,
      user,
      FCM_TOKEN,
      updateFCM_TOKEN,
      chatHistory,
      updateUserDetails,
      updateChatHistory,
      updateChatHistoryCache,
      chatHistoryCache,
    }),
    [
      isUnlocked,
      authenticate,
      unauthenticate,
      user,
      FCM_TOKEN,
      updateFCM_TOKEN,
      chatHistory,
      updateUserDetails,
      updateChatHistory,
      updateChatHistoryCache,
      chatHistoryCache,
    ]
  );

  const memoChildren = useMemo(() => children, [children]);

  return (
    <UserContext.Provider value={values}>{memoChildren}</UserContext.Provider>
  );
}
