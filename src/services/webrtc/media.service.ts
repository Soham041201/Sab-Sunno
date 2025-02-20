import { useRef, useCallback } from 'react';

export const useMediaService = () => {
  const localStream = useRef<MediaStream | null>(null);

  // Add custom error types
  class MediaServiceError extends Error {
    constructor(message: string) {
      super(`MediaService Error: ${message}`);
    }
  }

  const startCapture = useCallback(async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      return localStream.current;
    } catch (error) {
      throw new MediaServiceError(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }, []);

  const addTracksToConnection = useCallback(
    async (connection: RTCPeerConnection) => {
      if (!localStream.current) throw new Error('No local stream available');

      localStream.current.getTracks().forEach((track) => {
        connection.addTrack(track, localStream.current!);
      });
    },
    []
  );

  const setMute = useCallback((muted: boolean) => {
    if (localStream.current) {
      localStream.current.getAudioTracks()[0].enabled = !muted;
    }
  }, []);

  const cleanup = useCallback(() => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }
  }, []);

  return {
    startCapture,
    addTracksToConnection,
    setMute,
    cleanup,
  };
};
