import { useRef, useCallback, useEffect } from 'react';
import socketInit from '../../socket';
import { SocketEvents, User } from '../../types/webrtc.types';

// Create a singleton socket instance
let socketInstance: ReturnType<typeof socketInit> | null = null;

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
  };
};

export const SOCKET_EVENT_NAMES = {
  JOIN: 'join',
  LEAVE: 'leave',
  MUTE: 'mute',
  UNMUTE: 'unmute',
} as const;
