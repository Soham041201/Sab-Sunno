import { useCallback, useRef } from 'react';
import { User } from '../../types/webrtc.types';
import { useConnectionService } from '../../services/webrtc/connection.service';
import { useMediaService } from '../../services/webrtc/media.service';
import { useAudioService } from '../../services/webrtc/audio.service';

export interface WebRTCHandlers {
  connection: ReturnType<typeof useConnectionService>;
  media: ReturnType<typeof useMediaService>;
  audio: ReturnType<typeof useAudioService>;
  handleNewPeer: (data: {
    peerId: string;
    createOffer: boolean;
    user: User;
  }) => Promise<RTCSessionDescriptionInit | undefined>;
  handleRemovePeer: (data: { peerId: string }) => void;
}

export const useWebRTCHandlers = (addNewUser: Function): WebRTCHandlers => {
  const connection = useConnectionService();
  const media = useMediaService();
  const audio = useAudioService();

  // Stable references to services
  const services = useRef({ connection, media, audio });

  const handleNewPeer = useCallback(
    async ({
      peerId,
      createOffer,
      user: remoteUser,
    }: {
      peerId: string;
      createOffer: boolean;
      user: User;
    }) => {
      const peerConnection =
        await services.current.connection.createPeerConnection(peerId);

      peerConnection.ontrack = ({ streams: [remoteStream] }) => {
        services.current.audio.setStream(remoteUser._id, remoteStream);
      };

      await services.current.media.addTracksToConnection(peerConnection);

      if (createOffer) {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        return offer;
      }
    },
    [] // No dependencies needed with useRef
  );

  const handleRemovePeer = useCallback(
    ({ peerId }: { peerId: string }) => {
      services.current.connection.closeConnection(peerId);
    },
    [] // No dependencies needed with useRef
  );

  return {
    connection,
    media,
    audio,
    handleNewPeer,
    handleRemovePeer,
  };
};
