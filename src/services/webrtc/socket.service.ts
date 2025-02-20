import { useRef, useCallback, useEffect } from 'react';
import socketInit from '../../socket';
import { SocketEvents, User } from '../../types/webrtc.types';

// Create a singleton socket instance
let socketInstance: ReturnType<typeof socketInit> | null = null;

interface GeminiMessage {
  message: string;
  chatId: string;
}

interface GeminiResponse {
  message: string;
  timestamp: string;
  isBot: boolean;
}

interface GeminiTyping {
  isTyping: boolean;
  chatId: string;
}

interface GeminiError {
  error: string;
  chatId: string;
}

export const useSocketService = () => {
  const socket = useRef(socketInstance || (socketInstance = socketInit()));
  const eventsRef = useRef<SocketEvents | null>(null);

  const setupEventListeners = useCallback((events: SocketEvents) => {
    // Remove previous listeners if they exist
    if (eventsRef.current) {
      Object.keys(eventsRef.current).forEach((event) => {
        socket.current.off(event);
      });
    }

    // Set up new listeners
    Object.entries(events).forEach(([event, handler]) => {
      socket.current.on(event, handler);
    });
    eventsRef.current = events;
  }, []);

  const emit = useCallback((event: string, data: any) => {
    socket.current.emit(event, data);
  }, []);

  const onGeminiResponse = useCallback(
    (callback: (response: GeminiResponse) => void) => {
      socket.current.on(SOCKET_EVENT_NAMES.GOOEY_TEXT_RESPONSE, callback);
      return () => {
        socket.current.off(SOCKET_EVENT_NAMES.GOOEY_TEXT_RESPONSE);
      };
    },
    []
  );

  const onGeminiTyping = useCallback(
    (callback: (data: GeminiTyping) => void) => {
      socket.current.on(SOCKET_EVENT_NAMES.GOOEY_TEXT_TYPING, callback);
      return () => {
        socket.current.off(SOCKET_EVENT_NAMES.GOOEY_TEXT_TYPING);
      };
    },
    []
  );

  const onGeminiError = useCallback((callback: (data: GeminiError) => void) => {
    socket.current.on(SOCKET_EVENT_NAMES.GOOEY_TEXT_ERROR, callback);
    return () => {
      socket.current.off(SOCKET_EVENT_NAMES.GOOEY_TEXT_ERROR);
    };
  }, []);

  const joinRoom = useCallback(
    (roomId: string, user: User) => {
      emit('join', { roomId, user });
    },
    [emit]
  );

  const leaveRoom = useCallback(
    (roomId: string, user: User) => {
      emit('leave', { roomId, user });
    },
    [emit]
  );

  const updateMuteStatus = useCallback(
    (userId: string, isMuted: boolean, roomId: string) => {
      emit(isMuted ? 'mute' : 'un-mute', { userId, isMuted, roomId });
    },
    [emit]
  );

  const sendGeminiMessage = useCallback(
    (data: GeminiMessage) => {
      emit(SOCKET_EVENT_NAMES.GOOEY_TEXT, data);
    },
    [emit]
  );

  useEffect(() => {
    return () => {
      // Only remove event listeners, don't close the socket
      if (eventsRef.current) {
        Object.keys(eventsRef.current).forEach((event) => {
          socket.current.off(event);
        });
        eventsRef.current = null;
      }
    };
  }, []);

  return {
    setupEventListeners,
    emit,
    joinRoom,
    leaveRoom,
    updateMuteStatus,
    sendGeminiMessage,
    onGeminiResponse,
    onGeminiTyping,
    onGeminiError,
  };
};

export const SOCKET_EVENT_NAMES = {
  JOIN: 'join',
  LEAVE: 'leave',
  MUTE: 'mute',
  UNMUTE: 'unmute',
  GOOEY_TEXT: 'gooey-text',
  GOOEY_TEXT_TYPING: 'gooey-text-typing',
  GOOEY_TEXT_RESPONSE: 'gooey-text-response',
  GOOEY_TEXT_ERROR: 'gooey-text-error',
} as const;
