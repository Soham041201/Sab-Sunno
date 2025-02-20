import { useCallback, useRef } from 'react';
import { useStateWithCallback } from '../useStateWithCallback';
import { RoomUser } from '../../types/webrtc.types';

export const useWebRTCState = () => {
  const [clients, setClients] = useStateWithCallback<RoomUser[]>([]);
  const clientsRef = useRef<RoomUser[]>([]);

  const addNewUser = useCallback(
    (newClient: RoomUser, cb: (state: RoomUser[]) => void) => {
      const lookingFor = clients.find((client) => client._id === newClient._id);

      if (!lookingFor) {
        setClients(
          (existingClients) => [...existingClients, newClient],
          (newState) => {
            clientsRef.current = newState;
            cb(newState);
          }
        );
      } else {
        setClients(
          (existingClients) =>
            existingClients.map((client) =>
              client._id === newClient._id
                ? { ...client, ...newClient }
                : client
            ),
          (newState) => {
            clientsRef.current = newState;
            cb(newState);
          }
        );
      }
    },
    [clients, setClients]
  );

  const removeUser = useCallback(
    (userId: string) => {
      setClients(
        (list) => list.filter((client) => client._id !== userId),
        () => {} // Empty callback
      );
    },
    [setClients]
  );

  const updateUserMute = useCallback(
    (userId: string, isMuted: boolean) => {
      setClients(
        (list) =>
          list.map((client) =>
            client._id === userId ? { ...client, isMuted } : client
          ),
        () => {} // Empty callback
      );
    },
    [setClients]
  );

  return {
    clients,
    clientsRef,
    addNewUser,
    removeUser,
    updateUserMute,
  };
};
