import { useEffect, useRef, useState, useCallback } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { getItem, removeItem, saveItem } from "@lib/storage";
import { BASE_URL } from "@lib/utils";
import axios from "axios";

export interface ChatMessageHistory {
  id: string;
  chatType: string;
  participants: ChatParticipant[];
  lastMessage: string;
}

export interface AgentMessageHistory {
  liveChatId: string;
  senderName: string;
  content: string;
}
export interface ChatItem {
  chatId: string;
  name?: string; // optional because only the last one had "name"
}
export type ChatPayload = ChatItem[];
export interface ChatParticipant {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ChatMessage {
  id: string;
  parentMessageId?: string;
  chatId?: string;
  senderId: string;
  content: string;
  type: string;
  fileUrl?: string;
  timestamp: Date;
  isRead: boolean;
  message?: string;
  delivered?: boolean;
  menu?: { action: string; id: string; label: string }[] | null;
}
export interface ChatUser {
  chatId?: string;
}
export interface ChatMessageRequest {
  parentMessageId?: string;
  senderId: string;
  content: string;
  type: string;
  fileUrl?: string;
}

export interface ChatHubState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  messages: (string | ChatMessage)[];
  typingUsers: string[];
  // allMessages: ChatMessageHistory[];
}

export interface UseSignalRHubChatOptions {
  url: string;
  chatId?: string;
  memberId?: string;
  onMessageReceived?: (
    message: ChatMessage | string,
    menu?: { action: string; id: string; label: string }[] | null
  ) => void;
  onMessageRead?: () => void;
  onSupportMessageReceived?: (message: string) => void;
  onReceiveNewAssignment?: (message: {
    id: string;
    firstName: string;
    lastName: string;
    function: string;
  }) => void;
  onAIMessageReceived?: (message: string) => void;
  onMessageHistory?: (message: ChatMessageHistory[]) => void;
  onSupportMessageHistory?: (message: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    data: AgentMessageHistory[];
  }) => void;
  onAgentMessageHistory?: (message: ChatMessageHistory[]) => void;
  onAgentChatMessages?: (message: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    data: AgentMessageHistory[];
  }) => void;
  onAgentAssigned?: (message: {
    liveChatId: string;
    participant: {
      id: string;
      firstName: string;
      lastName: string;
      function: string;
    };
  }) => void;
  onUserTyping?: (userId: string) => void;
  onUserStoppedTyping?: (userId: string) => void;
  onConnectionStateChange?: (isConnected: boolean) => void;
  onChatInitialized?: (chatId: string) => void;
  onReceiveAIChatList?: (message: ChatPayload) => void;
  onReceiveAIChatQuestionResponseList?: (message: any) => void;
  onError?: (error: string) => void;
  onGetChatMessages?: (
    messages: {
      dateTime: string;
      messages: ChatMessage[];
      displayDate: string;
    }[]
  ) => void;
  previousMessages?: ChatMessage[] | undefined;
}

export interface UseSignalRHubChatReturn extends ChatHubState {
  connect: () => Promise<void>;
  disconnect: () => void;
  sendMessage: (
    message: Omit<ChatMessage, "id" | "timestamp" | "isRead" | "senderId">
  ) => Promise<void>;
  joinChatRoom: (message: Omit<ChatUser, "chatId">) => Promise<void>;
  agentJoinChatRoom: (liveChatId: string) => Promise<void>;
  sendLiveChatMessage: (message: {
    liveChatId: string;
    participantId?: string;
    content: string;
  }) => Promise<void>;
  closeChatSession: (id: string) => Promise<void>;
  sendMessageToUser: (senderId: string, message: string) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  sendTypingIndicator: () => Promise<void>;
  joinChat: () => Promise<void>;
  leaveChat: () => Promise<void>;
  initializeChat: () => Promise<void>;
  getUserChatHistory: () => Promise<void>;
  getChatMessages: () => Promise<void>;
  onChatInitialized?: (chatId: string) => void;
  newAIChat: () => void;
  getAIQuestionResponses: (chatId: string) => void;
  previousAIChatHistory: () => void;
  promptAI: (message: string, chatId: string) => void;
  loadUserSupportMessages: (message: {
    searchTerm: string;
    pageNumber: string;
    pageSize: string;
  }) => Promise<void>;
  loadAgentSupportMessages: (message: {
    searchTerm: string;
    pageNumber: string;
    pageSize: string;
  }) => Promise<void>;
  loadAgentChatMessages: (message: {
    liveChatId: string;
    searchTerm: string;
    pageNumber: string;
    pageSize: string;
  }) => Promise<void>;
  joinAgent: (id: string) => void;
}

export function useSignalRHubChat(
  options: UseSignalRHubChatOptions
): UseSignalRHubChatReturn {
  const {
    url,
    chatId,
    memberId,
    onMessageReceived,
    onMessageRead,
    onSupportMessageReceived,
    onReceiveNewAssignment,
    onAgentAssigned,
    onSupportMessageHistory,
    onAgentMessageHistory,
    onAgentChatMessages,
    onAIMessageReceived,
    onMessageHistory,
    onGetChatMessages,
    onUserTyping,
    onUserStoppedTyping,
    onConnectionStateChange,
    onChatInitialized,
    onReceiveAIChatList,
    onReceiveAIChatQuestionResponseList,
    onError,
    previousMessages,
  } = options;

  const [state, setState] = useState<ChatHubState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    messages: previousMessages ?? [],
    typingUsers: [],
    //allMessages: [],
  });

  const connectionRef = useRef<HubConnection | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);

  const handleMessageHistory = useCallback(
    (messages: ChatMessageHistory[]) => {
      // setState((prev) => ({
      //   ...prev,
      //   allMessages: messages,
      // }));
      onMessageHistory?.(messages);
    },
    [onMessageHistory]
  );

  const handleGetChatMessages = useCallback(
    (
      messages: {
        dateTime: string;
        messages: ChatMessage[];
        displayDate: string;
      }[]
    ) => {
      setState((prev) => ({
        ...prev,
        messages: messages
          ?.map(
            (m) =>
              m.messages?.map((msg) => ({
                ...msg,
                delivered: true,
                read: true,
              })) ?? []
          )
          .flat(),
      }));
      onGetChatMessages?.(messages);
    },
    [onGetChatMessages]
  );

  const handleMessageReceived = useCallback(
    (message: ChatMessage | string) => {
      if (url === "livechat") {
        console.log("live chat", message);

        setState((prev) => {
          const updatedMessages = prev.messages
            .map((msg) => {
              if (typeof msg === "string") return msg;
              if (!msg) return undefined;

              return { ...msg, delivered: true };
            })
            // ✅ Filter out undefined safely without using a type predicate mismatch
            .filter((msg) => msg !== undefined && msg !== null);
          const updatedMsg =
            typeof message !== "string" ? { ...message, delivered: true } : {};

          return {
            ...prev,
            messages: [updatedMsg, ...updatedMessages],
          };
        });
      }
      if (url === "chats") {
        setState((prev) => {
          const updatedMessages = prev.messages
            .map((msg) => {
              if (typeof msg === "string") return msg;
              if (!msg) return undefined;

              return { ...msg, delivered: true };
            })
            // ✅ Filter out undefined safely without using a type predicate mismatch
            .filter((msg) => msg !== undefined && msg !== null);
          const updatedMsg =
            typeof message !== "string" ? { ...message, delivered: true } : {};

          return {
            ...prev,
            messages: [updatedMsg, ...updatedMessages],
          };
        });
      }
      if (url === "chatbot") {
        setState((prev) => ({
          ...prev,
          messages: [message, ...prev.messages],
        }));
      }

      onMessageReceived?.(message);
    },
    [onMessageReceived]
  );
  const handleMessageRead = useCallback(() => {
    if (url === "chats") {
      setState((prev) => {
        const updatedMessages = prev.messages
          .map((msg) => {
            if (typeof msg === "string") return msg;
            if (!msg) return undefined;

            return { ...msg, delivered: true, read: true };
          })
          // ✅ Filter out undefined safely without using a type predicate mismatch
          .filter((msg) => msg !== undefined && msg !== null);

        return {
          ...prev,
          messages: [...updatedMessages],
        };
      });
    }

    onMessageRead?.();
  }, [onMessageRead]);

  const handleSupportMessageReceived = useCallback(
    (message: string) => {
      onSupportMessageReceived?.(message);
    },
    [onSupportMessageReceived]
  );

  const handleSupportMessageHistory = useCallback(
    (message: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
      data: AgentMessageHistory[];
    }) => {
      onSupportMessageHistory?.(message);
    },
    [onSupportMessageHistory]
  );

  const handleAgentMessageHistory = useCallback(
    (message: ChatMessageHistory[]) => {
      onAgentMessageHistory?.(message);
    },
    [onAgentMessageHistory]
  );

  const handleAgentChatMessages = useCallback(
    (message: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
      data: AgentMessageHistory[];
    }) => {
      onAgentChatMessages?.(message);
    },
    [onAgentMessageHistory]
  );

  const handleReceiveNewAssignment = useCallback(
    (message: {
      id: string;
      firstName: string;
      lastName: string;
      function: string;
    }) => {
      onReceiveNewAssignment?.(message);
    },
    [onReceiveNewAssignment]
  );

  const handleAgentAssigned = useCallback(
    (message: {
      liveChatId: string;
      participant: {
        id: string;
        firstName: string;
        lastName: string;
        function: string;
      };
    }) => {
      onAgentAssigned?.(message);
    },
    [onAgentAssigned]
  );

  const handleChatInitialized = useCallback(
    (message: { chatId: string }) => {
      onChatInitialized?.(message.chatId);
    },
    [onChatInitialized]
  );
  const handleReceiveAIChatList = useCallback(
    (message: ChatPayload) => {
      onReceiveAIChatList?.(message);
    },
    [onReceiveAIChatList]
  );
  const handleReceiveAIChatQuestionResponseList = useCallback(
    (message: any) => {
      onReceiveAIChatQuestionResponseList?.(message);
    },
    [onReceiveAIChatQuestionResponseList]
  );

  const handleUserTyping = useCallback(
    (userId: string) => {
      setState((prev) => ({
        ...prev,
        typingUsers: [
          ...prev.typingUsers.filter((id) => id !== userId),
          userId,
        ],
      }));
      onUserTyping?.(userId);
    },
    [onUserTyping]
  );

  const handleUserStoppedTyping = useCallback(
    (userId: string) => {
      setState((prev) => ({
        ...prev,
        typingUsers: prev.typingUsers.filter((id) => id !== userId),
      }));
      onUserStoppedTyping?.(userId);
    },
    [onUserStoppedTyping]
  );

  const handleConnectionStateChange = useCallback(
    (isConnected: boolean) => {
      setState((prev) => ({
        ...prev,
        isConnected,
        isConnecting: false,
        error: null,
      }));
      console.log(isConnected ? "now connected" : "disconnected");

      onConnectionStateChange?.(isConnected);
    },
    [onConnectionStateChange]
  );

  const handleRefreshToken = useCallback(async () => {
    try {
      const refreshToken = getItem("refreshToken", "string");
      const accessToken = getItem("accessToken", "string");

      if (!refreshToken || !accessToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(
        `${BASE_URL}Users/refresh-token`,
        { accessToken, refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const newToken = response.data.data.accessToken;
        saveItem("accessToken", newToken);
        saveItem("refreshToken", response.data.data.refreshToken);
        return newToken;
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      // If refresh token fails, clear all auth data
      removeItem("accessToken");
      removeItem("refreshToken");
      removeItem("user");
      throw error;
    }
  }, []);

  const handleError = useCallback(
    (error: string) => {
      setState((prev) => ({
        ...prev,
        error,
        isConnecting: false,
      }));
      onError?.(error);
    },
    [onError]
  );

  const connect = useCallback(async () => {
    if (connectionRef.current) {
      await connectionRef.current.stop();
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    // Reset retry count for new connection attempts
    retryCountRef.current = 0;

    try {
      const token = getItem("accessToken", "string");
      const hubUrl = `${BASE_URL.replace("/api/", `/${url}`)}`;
      console.log(token, "token");

      // Create SignalR connection
      const connection = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token || "",
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Exponential backoff: 1s, 2s, 4s, 8s, 16s, then 30s max
            const maxDelay = 30000;
            const delay = Math.min(
              1000 * Math.pow(2, retryContext.previousRetryCount),
              maxDelay
            );
            return delay;
          },
        })
        .configureLogging(LogLevel.Information)
        .build();

      // Set up event handlers
      connection.on(
        "receiverequestmessage",
        (message: {
          id: string;
          firstName: string;
          lastName: string;
          function: string;
        }) => {
          handleReceiveNewAssignment(message);
        }
      );

      connection.on("receivenewassignment", (message: string) => {
        handleSupportMessageReceived(message);
      });

      connection.on(
        "loadusermessages",
        (message: {
          totalItems: number;
          totalPages: number;
          currentPage: number;
          pageSize: number;
          data: AgentMessageHistory[];
        }) => {
          handleSupportMessageHistory(message);
        }
      );

      connection.on(
        "agentassigned",
        (message: {
          liveChatId: string;
          participant: {
            id: string;
            firstName: string;
            lastName: string;
            function: string;
          };
        }) => {
          handleAgentAssigned(message);
        }
      );

      connection.on("receivemessage", (message: ChatMessage) => {
        console.log("on recieve shout in", message);

        handleMessageReceived(message);
      });
      connection.on("MessageRead", (message: ChatMessage) => {
        handleMessageRead();
      });
      connection.on("usertyping", (userId: string) => {
        handleUserTyping(userId);
      });

      connection.on("userstoppedtyping", (userId: string) => {
        handleUserStoppedTyping(userId);
      });

      connection.on("receivechathistory", (messages: ChatMessageHistory[]) => {
        handleMessageHistory(messages);
      });
      connection.on("receivechathistory", (messages: ChatMessageHistory[]) => {
        handleMessageHistory(messages);
      });
      connection.on("ReceiveAIChatList", (message: ChatPayload) => {
        handleReceiveAIChatList(message);
      });
      connection.on("ChatInitialized", (message: { chatId: string }) => {
        console.log(message);

        handleChatInitialized(message);
      });
      connection.on("ReceiveAIChatQuestionResponseList", (message: any) => {
        handleReceiveAIChatQuestionResponseList(message);
      });

      connection.on(
        "loadmessages",
        (
          messages: {
            dateTime: string;
            messages: ChatMessage[];
            displayDate: string;
          }[]
        ) => {
          handleGetChatMessages(messages);
        }
      );

      connection.on("responsemessage", (message: string) => {
        console.log("responsemessage", message);
      });

      connection.on("loadagentchats", (message: ChatMessageHistory[]) => {
        handleAgentMessageHistory(message);
      });

      connection.on(
        "loadagentchatmessages",
        (message: {
          totalItems: number;
          totalPages: number;
          currentPage: number;
          pageSize: number;
          data: AgentMessageHistory[];
        }) => {
          handleAgentChatMessages(message);
        }
      );

      connection.on("messagedelivered", (message: { messageId: string }) => {
        console.log("messagedelivered", message);
      });

      connection.on("userconnected", (userId: string) => {
        console.log("userconnected", userId);
      });

      // Handle connection state changes
      connection.onclose(async (error) => {
        console.log("SignalR connection closed:", error);
        handleConnectionStateChange(false);

        // Check if the connection was closed due to 401 Unauthorized
        const is401Error =
          error &&
          typeof error === "object" &&
          "message" in error &&
          typeof (error as any).message === "string" &&
          (error as any).message.includes("Status code '401'");

        if (is401Error) {
          // Limit retry attempts to prevent infinite loops
          if (retryCountRef.current >= 2) {
            console.error(
              "Max retry attempts reached for 401 error in onclose"
            );
            const errorMessage =
              "Authentication failed after multiple attempts";
            handleError(errorMessage);
            return;
          }

          retryCountRef.current += 1;

          try {
            // Try to refresh the token
            const newToken = await handleRefreshToken();

            // If token refresh was successful, try to reconnect
            if (newToken) {
              console.log(
                `Token refreshed successfully, attempting to reconnect after connection close (attempt ${retryCountRef.current})...`
              );
              // Retry the connection with the new token
              setTimeout(() => {
                connect();
              }, 1000); // Small delay before reconnecting
              return;
            }
          } catch (refreshError) {
            console.error(
              "Failed to refresh token after connection close:",
              refreshError
            );
            // If refresh fails, handle as a regular error
            const errorMessage =
              refreshError instanceof Error
                ? refreshError.message
                : "Token refresh failed";
            handleError(errorMessage);
          }
        }

        if (error) {
          handleError(error.toString());
        }
      });

      connection.onreconnecting(async (error) => {
        console.log("SignalR reconnecting:", error);
        setState((prev) => ({
          ...prev,
          isConnected: false,
          isConnecting: true,
        }));

        // Check if the reconnection is due to 401 Unauthorized
        const is401Error =
          error &&
          typeof error === "object" &&
          "message" in error &&
          typeof (error as any).message === "string" &&
          (error as any).message.includes("Status code '401'");

        if (is401Error) {
          try {
            // Try to refresh the token during reconnection
            const newToken = await handleRefreshToken();

            if (newToken) {
              console.log(
                "Token refreshed during reconnection, connection should continue..."
              );
            }
          } catch (refreshError) {
            console.error(
              "Failed to refresh token during reconnection:",
              refreshError
            );
            // Don't throw here as the reconnection process should continue
          }
        }
      });

      connection.onreconnected((connectionId) => {
        console.log("SignalR reconnected:", connectionId);
        handleConnectionStateChange(true);
      });

      // Start the connection
      await connection.start();
      connectionRef.current = connection;
      handleConnectionStateChange(true);
    } catch (error: unknown) {
      // Check if the error is a 401 Unauthorized error
      // The error structure is: [Error: Failed to complete negotiation with the server: Error: : Status code '401']
      const is401Error =
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as any).message === "string" &&
        (error as any).message.includes("Status code '401'");

      if (is401Error) {
        // Limit retry attempts to prevent infinite loops
        if (retryCountRef.current >= 2) {
          console.error("Max retry attempts reached for 401 error");
          const errorMessage = "Authentication failed after multiple attempts";
          handleError(errorMessage);
          throw new Error(errorMessage);
        }

        retryCountRef.current += 1;

        try {
          // Try to refresh the token
          const newToken = await handleRefreshToken();

          // If token refresh was successful, try to reconnect with the new token
          if (newToken) {
            console.log(
              `Token refreshed successfully, attempting to reconnect (attempt ${retryCountRef.current})...`
            );
            // Stop the current connection
            if (connectionRef.current) {
              await connectionRef.current.stop();
            }

            // Retry the connection with the new token
            return connect();
          }
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          // If refresh fails, handle as a regular error
          const errorMessage =
            refreshError instanceof Error
              ? refreshError.message
              : "Token refresh failed";
          handleError(errorMessage);
          throw refreshError;
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : "Connection failed";
      handleError(errorMessage);
      throw error;
    }
  }, [
    handleMessageReceived,
    handleUserTyping,
    handleUserStoppedTyping,
    handleConnectionStateChange,
    handleError,
    handleRefreshToken,
  ]);

  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      await connectionRef.current.stop();
      connectionRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
    }));
  }, []);

  const initializeChat = useCallback(async () => {
    if (!connectionRef.current) {
      throw new Error("SignalR connection not established");
    }
    console.log("fire", memberId);

    await connectionRef.current.invoke("InitializeChat", {
      chatType: "Private",
      memberIds: [memberId],
    });
  }, [memberId]);

  const getUserChatHistory = useCallback(async () => {
    if (!connectionRef.current) {
      throw new Error("SignalR connection not established");
    }
    await connectionRef.current.invoke("GetUserChatHistory");
  }, []);

  const getChatMessages = useCallback(async () => {
    if (!connectionRef.current) {
      throw new Error("SignalR connection not established");
    }
    await connectionRef.current.invoke("GetChatMessages", {
      chatId,
    });
  }, [chatId]);

  const sendMessage = useCallback(
    async (
      message: Omit<ChatMessage, "id" | "timestamp" | "isRead" | "senderId">
    ) => {
      if (!connectionRef.current) {
        throw new Error("SignalR connection not established");
      }
      await connectionRef.current.invoke("SendMessage", {
        parentMessageId: message.parentMessageId,
        chatId: message.chatId,
        content: message.content,
        type: message.type,
        fileUrl: message.fileUrl,
      });
    },
    []
  );
  const joinChatRoom = useCallback(async (message: ChatUser) => {
    if (!connectionRef.current) {
      throw new Error("keep alive failed");
    }
    await connectionRef.current.invoke("ReceiveMessage", {
      chatId: message.chatId,
    });
  }, []);
  const agentJoinChatRoom = useCallback(async (liveChatId: string) => {
    if (!connectionRef.current) {
      throw new Error("keep alive failed");
    }
    await connectionRef.current.invoke("JoinChat", liveChatId);
  }, []);
  const sendLiveChatMessage = useCallback(
    async (message: {
      liveChatId: string;
      participantId?: string;
      content: string;
    }) => {
      if (!connectionRef.current) {
        throw new Error("SignalR connection not established");
      }
      // await connectionRef.current.invoke("ProcessUserInput", message);
      await connectionRef.current.invoke("SendMessage", message);
    },
    []
  );
  const joinAgent = useCallback(async (id: string) => {
    if (!connectionRef.current) {
      throw new Error("SignalR connection not established");
    }
    // await connectionRef.current.invoke("ProcessUserInput", message);
    await connectionRef.current.invoke("ProcessAgentSelection", id);
  }, []);

  const loadUserSupportMessages = useCallback(
    async (message: {
      searchTerm: string;
      pageNumber: string;
      pageSize: string;
    }) => {
      if (!connectionRef.current) {
        throw new Error("SignalR connection not established");
      }
      await connectionRef.current.invoke("LoadUserMessages", message);
    },
    []
  );

  const loadAgentSupportMessages = useCallback(
    async (message: {
      searchTerm: string;
      pageNumber: string;
      pageSize: string;
    }) => {
      if (!connectionRef.current) {
        throw new Error("SignalR connection not established");
      }
      await connectionRef.current.invoke("LoadAgentChats", message);
    },
    []
  );

  const loadAgentChatMessages = useCallback(
    async (message: {
      liveChatId: string;
      searchTerm: string;
      pageNumber: string;
      pageSize: string;
    }) => {
      if (!connectionRef.current) {
        throw new Error("SignalR connection not established");
      }
      await connectionRef.current.invoke("LoadAgentChatMessages", message);
    },
    []
  );

  const closeChatSession = useCallback(async (id: string) => {
    if (!connectionRef.current) {
      throw new Error("SignalR connection not established");
    }
    await connectionRef.current.invoke("CloseChatSession", id);
  }, []);

  const sendMessageToUser = useCallback(
    async (senderId: string, message: string) => {
      if (!connectionRef.current) {
        throw new Error("SignalR connection not established");
      }
      await connectionRef.current.invoke("SendMessageToUser", [
        senderId,
        message,
      ]);
    },
    []
  );
  const newAIChat = useCallback(async () => {
    if (!connectionRef.current) {
      throw new Error("SignalR connection not established");
    }
    await connectionRef.current.invoke("CreateNewChat");
  }, []);
  const getAIQuestionResponses = useCallback(async (chatId: string) => {
    if (!connectionRef.current) {
      throw new Error("SignalR connection not established");
    }
    await connectionRef.current.invoke("GetAIQuestionResponses", chatId);
  }, []);

  const previousAIChatHistory = useCallback(async () => {
    console.log("out emit");

    if (!connectionRef.current) {
      throw new Error("SignalR connection not established");
    }
    await connectionRef.current.invoke("GetChatList");
  }, []);

  const promptAI = useCallback(async (message: string, chatId: string) => {
    if (!connectionRef.current) {
      throw new Error("SignalR connection not established");
    }
    console.log("out prompt", message, chatId);

    await connectionRef.current.invoke("Prompt", message, chatId);
  }, []);

  const markMessageAsRead = useCallback(
    async (messageId: string) => {
      if (!connectionRef.current) {
        throw new Error("SignalR connection not established");
      }
      await connectionRef.current.invoke("MarkMessageAsRead", {
        chatId,
        messageId,
      });
    },
    [chatId]
  );

  const sendTypingIndicator = useCallback(async () => {
    if (!connectionRef.current) {
      throw new Error("SignalR connection not established");
    }
    await connectionRef.current.invoke("Typing", chatId);

    // Clear typing indicator after 3 seconds
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      // The server should handle stopping the typing indicator
    }, 3000);
  }, [chatId]);

  const joinChat = useCallback(async () => {
    if (!connectionRef.current) {
      throw new Error("SignalR connection not established");
    }
    await connectionRef.current.invoke("JoinChat", { chatId });
  }, [chatId]);

  const leaveChat = useCallback(async () => {
    if (!connectionRef.current) {
      throw new Error("SignalR connection not established");
    }
    await connectionRef.current.invoke("LeaveChat", { chatId });
  }, [chatId]);

  useEffect(() => {
    connect();

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
      // Reset retry counter on unmount
      retryCountRef.current = 0;
    };
  }, [disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
    joinChatRoom,
    agentJoinChatRoom,
    markMessageAsRead,
    sendTypingIndicator,
    joinChat,
    leaveChat,
    initializeChat,
    getUserChatHistory,
    onChatInitialized,
    getChatMessages,
    promptAI,
    newAIChat,
    getAIQuestionResponses,
    previousAIChatHistory,
    sendLiveChatMessage,
    joinAgent,
    sendMessageToUser,
    loadUserSupportMessages,
    loadAgentSupportMessages,
    loadAgentChatMessages,
    closeChatSession,
  };
}
