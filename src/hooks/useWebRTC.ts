/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { User } from '../types/webrtc.types';
import { useWebRTCState } from './webrtc/useWebRTCState';
import { useWebRTCHandlers } from './webrtc/useWebRTCHandlers';
import { useWebRTCSetup } from './webrtc/useWebRTCSetup';

export const useWebRTC = (roomId: string | undefined, user: User) => {
  const { clients, addNewUser, updateUserMute } = useWebRTCState();

  const handlers = useWebRTCHandlers(addNewUser);
  const socket = useWebRTCSetup(
    roomId,
    user,
    handlers,
    (newClient, cb) => addNewUser(newClient, (state) => cb(state[state.length - 1])),
    updateUserMute
  );

  const handleMute = useCallback(
    (userId: string, isMuted: boolean) => {
      handlers.media.setMute(isMuted);
      socket.updateMuteStatus(userId, isMuted, roomId || '');
    },
    [handlers.media, socket, roomId]
  );

  return {
    clients,
    provideRef: handlers.audio.addAudioElement,
    handleMute,
  };
};
