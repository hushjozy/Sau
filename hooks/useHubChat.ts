import { useEffect, useRef, useState, useCallback } from "react";
import { getItem } from "@/lib/storage";
import { BASE_URL } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  parentMessageId?: string;
  senderId: string;
  content: string;
  type: string;
  fileUrl?: string;
  timestamp: Date;
  isRead: boolean;
  delivered?: boolean;
  read?: boolean;
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
  messages: ChatMessage[];
  typingUsers: string[];
  allMessages: ChatMessage[];
}

export interface UseHubChatOptions {
  chatId?: string;
  onMessageReceived?: (message: ChatMessage) => void;
  onUserTyping?: (userId: string) => void;
  onUserStoppedTyping?: (userId: string) => void;
  onConnectionStateChange?: (isConnected: boolean) => void;
  onError?: (error: string) => void;
}

export interface UseHubChatReturn extends ChatHubState {
  connect: () => Promise<void>;
  disconnect: () => void;
  sendMessage: (
    message: Omit<ChatMessage, "id" | "timestamp" | "isRead">
  ) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  sendTypingIndicator: () => Promise<void>;
  joinChat: () => Promise<void>;
  leaveChat: () => Promise<void>;
  initializeChat: () => Promise<void>;
}

class SignalRWebSocket {
  private ws: WebSocket | null = null;
  private messageId = 0;
  private callbacks: Map<string, (data: any) => void> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(
    private baseUrl: string,
    private onMessage: (data: any) => void,
    private onStateChange: (state: string) => void,
    private onError: (error: string) => void
  ) {}

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const token = getItem("accessToken", "string");

        const wsUrl = this.baseUrl
          .replace("http", "ws")
          .replace("/api/", "/chats");

        // For WebSocket, we need to pass the token in the URL or handle it differently
        // since WebSocket constructor doesn't accept headers
        const urlWithToken = token ? `${wsUrl}?access_token=${token}` : wsUrl;
        this.ws = new WebSocket(urlWithToken);
        console.log(urlWithToken, "url with token :");

        this.ws.onopen = () => {
          this.onStateChange("connected");
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          console.log("event", event);
          try {
            const data = JSON.parse(event.data);
            this.onMessage(data);
          } catch (error) {
            //console.error("Failed to parse WebSocket message:", error);
          }
        };

        this.ws.onclose = (event) => {
          this.onStateChange("disconnected");
          if (
            !event.wasClean &&
            this.reconnectAttempts < this.maxReconnectAttempts
          ) {
            setTimeout(() => {
              this.reconnectAttempts++;
              this.connect();
            }, this.reconnectDelay * this.reconnectAttempts);
          }
        };

        this.ws.onerror = (error) => {
          this.onError("WebSocket connection error");
          reject(new Error("WebSocket connection failed"));
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private sendMessage(method: string, args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket is not connected"));
        return;
      }

      const id = ++this.messageId;
      const message = {
        jsonrpc: "2.0",
        id,
        method,
        params: args,
      };

      const callback = (data: any) => {
        if (data.id === id) {
          this.callbacks.delete(id.toString());
          if (data.error) {
            reject(new Error(data.error.message || "Request failed"));
          } else {
            resolve(data.result);
          }
        }
      };

      this.callbacks.set(id.toString(), callback);

      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        this.callbacks.delete(id.toString());
        reject(error);
      }
    });
  }

  async invoke(method: string, ...args: any[]): Promise<any> {
    return this.sendMessage(method, args);
  }

  on(method: string, callback: (data: any) => void): void {
    this.callbacks.set(method, callback);
  }

  off(method: string): void {
    this.callbacks.delete(method);
  }
}

export function useHubChat(options: UseHubChatOptions): UseHubChatReturn {
  const {
    chatId,
    onMessageReceived,
    onUserTyping,
    onUserStoppedTyping,
    onConnectionStateChange,
    onError,
  } = options;

  const [state, setState] = useState<ChatHubState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    messages: [],
    typingUsers: [],
    allMessages: [],
  });

  const wsRef = useRef<SignalRWebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMessage = useCallback((data: any) => {
    if (data.method === "ReceiveMessage") {
      console.log("data", data);

      // const message: ChatMessage = {
      //   id: data.params[0].id,
      //   parentMessageId: data.params[0].parentMessageId,
      //   senderId: data.params[0].senderId,
      //   content: data.params[0].content,
      //   type: data.params[0].type,
      //   fileUrl: data.params[0].fileUrl,
      //   timestamp: new Date(data.params[0].timestamp),
      //   isRead: data.params[0].isRead,
      // };

      // setState((prev) => ({
      //   ...prev,
      //   messages: [...prev.messages, message],
      // }));

      // onMessageReceived?.(message);
    } else if (data.method === "UserTyping") {
      const userId = data.params[0];
      setState((prev) => ({
        ...prev,
        typingUsers: [
          ...prev.typingUsers.filter((id) => id !== userId),
          userId,
        ],
      }));
      onUserTyping?.(userId);
    } else if (data.method === "UserStoppedTyping") {
      const userId = data.params[0];
      setState((prev) => ({
        ...prev,
        typingUsers: prev.typingUsers.filter((id) => id !== userId),
      }));
      onUserStoppedTyping?.(userId);
    } else if (data.method === "GetUserChatHistory") {
      // const messages = data.params[0].map((message: any) => ({
      //   id: message.id,
      //   parentMessageId: message.parentMessageId,
      //   senderId: message.senderId,
      //   content: message.content,
      //   type: message.type,
      //   fileUrl: message.fileUrl,
      //   timestamp: new Date(message.timestamp),
      //   isRead: message.isRead,
      // }));
      // setState((prev) => ({
      //   ...prev,
      //   allMessages: messages,
      // }));
    }
  }, []);

  const handleStateChange = useCallback((connectionState: string) => {
    const isConnected = connectionState === "connected";
    setState((prev) => ({
      ...prev,
      isConnected,
      isConnecting: false,
      error: null,
    }));
    onConnectionStateChange?.(isConnected);
  }, []);

  const handleError = useCallback((error: string) => {
    setState((prev) => ({
      ...prev,
      error,
      isConnecting: false,
    }));
    onError?.(error);
  }, []);

  const connect = useCallback(async () => {
    if (wsRef.current) {
      wsRef.current.disconnect();
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      wsRef.current = new SignalRWebSocket(
        BASE_URL,
        handleMessage,
        handleStateChange,
        handleError
      );

      await wsRef.current.connect();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : "Connection failed",
      }));
      throw error;
    }
  }, [handleMessage, handleStateChange, handleError]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
    }));
  }, []);

  const initializeChat = useCallback(async () => {
    if (!wsRef.current) {
      throw new Error("WebSocket not connected");
    }
    await wsRef.current.invoke("InitializeChat", {
      chatType: "Private",
      memberIds: [chatId],
    });
  }, [chatId]);

  const joinChat = useCallback(async () => {
    if (!wsRef.current) {
      throw new Error("WebSocket not connected");
    }
    await wsRef.current.invoke("JoinChat", { chatId });
  }, [chatId]);

  const leaveChat = useCallback(async () => {
    if (!wsRef.current) {
      throw new Error("WebSocket not connected");
    }
    await wsRef.current.invoke("LeaveChat", { chatId });
  }, [chatId]);

  const sendMessage = useCallback(
    async (message: Omit<ChatMessage, "id" | "timestamp" | "isRead">) => {
      if (!wsRef.current) {
        throw new Error("WebSocket not connected");
      }
      await wsRef.current.invoke("SendMessage", {
        parentMessageId: message.parentMessageId,
        senderId: message.senderId,
        content: message.content,
        type: message.type,
        fileUrl: message.fileUrl,
      });
    },
    []
  );

  const markMessageAsRead = useCallback(
    async (messageId: string) => {
      if (!wsRef.current) {
        throw new Error("WebSocket not connected");
      }
      await wsRef.current.invoke("MarkMessageAsRead", { chatId, messageId });
    },
    [chatId]
  );

  const sendTypingIndicator = useCallback(async () => {
    if (!wsRef.current) {
      throw new Error("WebSocket not connected");
    }
    await wsRef.current.invoke("Typing", { chatId });

    // Clear typing indicator after 3 seconds
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      // The server should handle stopping the typing indicator
    }, 3000);
  }, [chatId]);

  // Auto-connect when chatId changes
  useEffect(() => {
    if (chatId) {
      connect()
        .then(() => {
          initializeChat();
        })
        .catch(console.error);
    }

    return () => {
      // if (chatId) {
      //   leaveChat().catch(console.error);
      // }
      // disconnect();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
    markMessageAsRead,
    sendTypingIndicator,
    joinChat,
    leaveChat,
    initializeChat,
  };
}
