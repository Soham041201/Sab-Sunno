import { useEffect, useCallback, useRef } from 'react';
import { User } from '../../types/webrtc.types';
import { useSocketService } from '../../services/webrtc/socket.service';
import { WebRTCHandlers } from './useWebRTCHandlers';
import { RoomUser } from '../../types/webrtc.types';

export const useWebRTCSetup = (
  roomId: string | undefined,
  user: User,
  handlers: WebRTCHandlers,
  addNewUser: (newClient: RoomUser, cb: (client?: RoomUser) => void) => void,
  updateUserMute: (userId: string, isMuted: boolean) => void
) => {
  const socket = useSocketService();
  const setupRef = useRef({ handlers, addNewUser, updateUserMute });

  // Update ref when dependencies change
  useEffect(() => {
    setupRef.current = { handlers, addNewUser, updateUserMute };
  }, [addNewUser]);

  useEffect(() => {
    if (!roomId || !user) return;

    let localStream: MediaStream;

    const initializeRoom = async () => {
      localStream = await setupRef.current.handlers.media.startCapture();

      setupRef.current.addNewUser({ ...user, isMuted: true }, () => {
        setupRef.current.handlers.audio.setStream(user._id, localStream);
      });

      socket.setupEventListeners({
        'add-peer': async (data) => {
          if (data.user._id === user._id) return;

          const offer = await setupRef.current.handlers.handleNewPeer(data);
          if (offer) {
            socket.emit('relay-sdp', {
              peerId: data.peerId,
              sessionDescription: offer,
            });
          }
          setupRef.current.addNewUser(
            { ...data.user, isMuted: true },
            () => {}
          );
        },
        'remove-peer': setupRef.current.handlers.handleRemovePeer,
        'ice-candidate': (data) =>
          setupRef.current.handlers.connection.addIceCandidate(
            data.peerId,
            data.candidate
          ),
        'session-description': (data) =>
          setupRef.current.handlers.connection.handleRemoteOffer(
            data.peerId,
            data.sessionDescription
          ),
        mute: ({ userId }) => setupRef.current.updateUserMute(userId, true),
        'un-mute': ({ userId }) =>
          setupRef.current.updateUserMute(userId, false),
      });

      socket.joinRoom(roomId, user);
    };

    initializeRoom().catch(console.error);

    return () => {
      setupRef.current.handlers.connection.cleanup();
      setupRef.current.handlers.media.cleanup();
      setupRef.current.handlers.audio.cleanup();
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      socket.leaveRoom(roomId, user);
    };
  }, [roomId, user]); // Minimal dependencies

  return socket;
};
