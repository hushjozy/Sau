import { ChatMessage } from "@hooks/useHubChat";
import { ChatMessageHistory } from "@hooks/useSignalRHubChat";
import { getItem, removeItem, saveItem } from "@lib/storage";
import { IUser } from "@services/models/users";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Audio } from "expo-av";
import { Pressable, Text } from "react-native";

type IContext = {
  isUnlocked: boolean;
  authenticate: () => Promise<void>;
  unauthenticate: () => void;
  logout: () => Promise<void>;
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
  authenticate: async () => {},
  unauthenticate: () => {},
  logout: async () => {},
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
    //     require("@assets/sounds/send.mp3"),
    //     { shouldPlay: true }
    //   );
    //   send.setOnPlaybackStatusUpdate((status) => {
    //     if (status.isLoaded && status.didJustFinish) {
    //       send.unloadAsync();
    //     }
    //   });
    // } else {
    //   const { sound: receive } = await Audio.Sound.createAsync(
    //     require("@assets/sounds/incoming.mp3"),
    //     { shouldPlay: true }
    //   );
    //   receive.setOnPlaybackStatusUpdate((status) => {
    //     if (status.isLoaded && status.didJustFinish) {
    //       receive.unloadAsync();
    //     }
    //   });
    // }
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
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [FCM_TOKEN, setFCM_TOKEN] = useState<string | undefined>();
  const [chatHistory, setChatHistory] = useState<ChatMessageHistory[]>([]);
  const [chatHistoryCache, setChatHistoryCache] = useState<
    { existingChatId: string; messages: ChatMessage[] }[]
  >([]);

  // 🔥 CRITICAL: Rehydrate user data on mount
  useEffect(() => {
    const rehydrateUser = async () => {
      try {
        console.log("🔄 Rehydrating user data from storage...");
        
        const storedUser = await getItem("user", "object");
        const storedToken = await getItem("accessToken", "string");

        console.log("📦 Storage contents:", {
          hasUser: !!storedUser,
          hasToken: !!storedToken,
          user: storedUser,
        });

        if (storedUser && storedToken) {
          console.log("✅ User data found in storage, restoring session");
          setUser(storedUser as IUser);
          setIsUnlocked(true);
        } else {
          console.log("❌ No user data found in storage");
          setIsUnlocked(false);
        }
      } catch (error) {
        console.error("❌ Error rehydrating user:", error);
        setIsUnlocked(false);
      } finally {
        setIsHydrating(false);
      }
    };

    rehydrateUser();
  }, []);

  // Persist user data whenever it changes (after hydration)
  useEffect(() => {
    if (!isHydrating && user) {
      console.log("💾 Persisting user data to storage");
      saveItem("user", user);
    }
  }, [user, isHydrating]);

  const authenticate = useCallback(async () => {
    try {
      console.log("🔐 Authenticating user...");
      
      const storedUser = await getItem("user", "object");
      const storedToken = await getItem("accessToken", "string");

      console.log("🔍 Auth check:", {
        hasUser: !!storedUser,
        hasToken: !!storedToken,
      });

      if (storedUser && storedToken) {
        console.log("✅ Authentication successful");
        setUser(storedUser as IUser);
        setIsUnlocked(true);
      } else {
        console.log("❌ Authentication failed: Missing credentials");
        setIsUnlocked(false);
      }
    } catch (error) {
      console.error("❌ Authentication error:", error);
      setIsUnlocked(false);
    }
  }, []);

  const unauthenticate = useCallback(() => {
    console.log("🔒 Unauthenticating user...");
    setIsUnlocked(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log("🚪 Logging out user...");
      await removeItem("accessToken");
      await removeItem("refreshToken");
      await removeItem("user");
      setUser(null);
      setIsUnlocked(false);
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  }, []);

  const updateFCM_TOKEN = useCallback((fcmToken: string) => {
    console.log("📲 Updating FCM token");
    setFCM_TOKEN(fcmToken);
  }, []);

  const updateUserDetails = useCallback((newUser: IUser | null) => {
    console.log("👤 Updating user details");
    setUser(newUser);
    if (newUser) {
      saveItem("user", newUser);
    }
  }, []);

  const updateChatHistory = useCallback((history: ChatMessageHistory[]) => {
    setChatHistory(history);
  }, []);

  const updateChatHistoryCache = useCallback(
    (messages: ChatMessage[], existingChatId: string) => {
      setChatHistoryCache((prevCache) => {
        const newCache = prevCache?.filter(
          (c) => c.existingChatId !== existingChatId
        );

        return [
          ...newCache,
          {
            existingChatId,
            messages,
          },
        ];
      });
    },
    []
  );

  const values = useMemo(
    () => ({
      isUnlocked,
      authenticate,
      unauthenticate,
      logout,
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
      logout,
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

  // Don't render children until hydration is complete
  if (isHydrating) {
    return null;
  }

  return (
    <UserContext.Provider value={values}>{children}</UserContext.Provider>
  );
}