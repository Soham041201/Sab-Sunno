import { useRef, useCallback } from 'react';
import { ICE_SERVERS, PEER_CONFIG } from '../../constants/webrtc.constants';  

export interface ConnectionService {
  createPeerConnection: (peerId: string) => Promise<RTCPeerConnection>;
  handleRemoteOffer: (
    peerId: string,
    sessionDescription: RTCSessionDescription
  ) => Promise<RTCSessionDescriptionInit>;
  addIceCandidate: (
    peerId: string,
    candidate: RTCIceCandidate
  ) => Promise<void>;
  closeConnection: (peerId: string) => void;
  cleanup: () => void;
}

export const useConnectionService = () => {
  const connections = useRef<Map<string, RTCPeerConnection>>(new Map());

  const createPeerConnection = useCallback(async (peerId: string) => {
    const connection = new RTCPeerConnection({
      ...PEER_CONFIG,
      iceServers: ICE_SERVERS,
    });

    connections.current.set(peerId, connection);
    return connection;
  }, []);

  const handleRemoteOffer = useCallback(
    async (peerId: string, sessionDescription: RTCSessionDescription) => {
      const connection = connections.current.get(peerId);
      if (!connection) throw new Error('No connection found');

      await connection.setRemoteDescription(
        new RTCSessionDescription(sessionDescription)
      );
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);

      return answer;
    },
    []
  );

  const addIceCandidate = useCallback(
    async (peerId: string, candidate: RTCIceCandidate) => {
      const connection = connections.current.get(peerId);
      if (connection) {
        await connection.addIceCandidate(candidate);
      }
    },
    []
  );

  const closeConnection = useCallback((peerId: string) => {
    const connection = connections.current.get(peerId);
    if (connection) {
      connection.close();
      connections.current.delete(peerId);
    }
  }, []);

  const cleanup = useCallback(() => {
    connections.current.forEach((connection) => connection.close());
    connections.current.clear();
  }, []);

  return {
    createPeerConnection,
    handleRemoteOffer,
    addIceCandidate,
    closeConnection,
    cleanup,
  };
};
