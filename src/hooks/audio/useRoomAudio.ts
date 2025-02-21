import { useEffect, useCallback, useRef } from 'react';
import { useAudioManager } from './useAudioManager';
import { RoomUser } from '../../types.defined';
import { User } from '../../types/webrtc.types';

interface UseRoomAudioProps {
  roomId: string | undefined;
  user: User;
  clients: RoomUser[];
  botAudioStream: MediaStream | null;
  provideRef: (instance: HTMLAudioElement | null, userId: string) => void;
  onError?: (error: Error) => void;
}

interface RoomAudioControls {
  setMuted: (muted: boolean) => void;
  handleUserStream: (userId: string, stream: MediaStream) => void;
  cleanup: () => Promise<void>;
}

export const useRoomAudio = ({
  roomId,
  user,
  clients,
  botAudioStream,
  provideRef,
  onError,
}: UseRoomAudioProps) => {
  const { state: audioState, controls: audioControls } = useAudioManager();
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const streamNodesRef = useRef<
    Map<string, { sourceNode: MediaStreamAudioSourceNode; gainNode: GainNode }>
  >(new Map());
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio when room is joined
  useEffect(() => {
    if (!roomId) return;

    const init = async () => {
      try {
        await audioControls.initializeAudioContext();
      } catch (error) {
        onError?.(error as Error);
      }
    };

    init();

    return () => {
      audioControls.cleanup().catch(console.error);
    };
  }, [roomId, audioControls, onError]);

  // Handle bot audio stream
  useEffect(() => {
    if (!botAudioStream) return;

    const addBotStream = async () => {
      try {
        // Create audio context if not exists
        if (!audioContextRef.current) {
          await audioControls.initializeAudioContext();
        }

        // Create audio element for bot stream
        const botAudioElement = new Audio();
        botAudioElement.autoplay = true;
        botAudioElement.srcObject = botAudioStream;

        // Create audio source from bot stream
        const audioContext = audioContextRef.current!;
        const botSource = audioContext.createMediaStreamSource(botAudioStream);
        const botGain = audioContext.createGain();
        botGain.gain.value = 1.0; // Full gain for bot

        // Connect bot audio nodes
        botSource.connect(botGain);
        botGain.connect(audioContext.destination);

        // Store references
        audioElementsRef.current.set('bot', botAudioElement);
        streamNodesRef.current.set('bot', {
          sourceNode: botSource,
          gainNode: botGain,
        });

        // Provide ref for WebRTC
        provideRef(botAudioElement, 'bot');
      } catch (error) {
        onError?.(error as Error);
      }
    };

    addBotStream();

    return () => {
      const nodes = streamNodesRef.current.get('bot');
      if (nodes) {
        nodes.sourceNode.disconnect();
        nodes.gainNode.disconnect();
      }
      const botAudioElement = audioElementsRef.current.get('bot');
      if (botAudioElement) {
        botAudioElement.srcObject = null;
        provideRef(null, 'bot');
      }
      streamNodesRef.current.delete('bot');
      audioElementsRef.current.delete('bot');
    };
  }, [botAudioStream, audioControls, provideRef, onError]);

  // Handle WebRTC peer streams
  useEffect(() => {
    const cleanupFunctions: (() => void)[] = [];

    clients.forEach((client) => {
      if (client._id === user._id) return; // Skip local user

      const audioElement = document.createElement('audio');
      audioElement.autoplay = true;
      audioElementsRef.current.set(client._id, audioElement);

      const handleStream = async () => {
        if (audioElement.srcObject instanceof MediaStream) {
          try {
            await audioControls.addStream({
              id: client._id,
              stream: audioElement.srcObject,
              type: 'peer',
              gain: 0.8,
            });
          } catch (error) {
            onError?.(error as Error);
          }
        }
      };

      // Set up stream monitoring
      const streamObserver = new MutationObserver(() => {
        handleStream();
      });

      streamObserver.observe(audioElement, {
        attributes: true,
        attributeFilter: ['srcObject'],
      });

      // Provide the audio element to WebRTC
      provideRef(audioElement, client._id);

      // Add cleanup function
      cleanupFunctions.push(() => {
        streamObserver.disconnect();
        provideRef(null, client._id);
        audioControls.removeStream(client._id);
        audioElementsRef.current.delete(client._id);
      });
    });

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [clients, user._id, provideRef, audioControls, onError]);

  // Handle local microphone
  const handleLocalMicrophone = useCallback(
    async (enabled: boolean) => {
      try {
        if (enabled) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });

          await audioControls.addStream({
            id: user._id,
            stream,
            type: 'local',
            gain: 0.5,
          });
        } else {
          audioControls.removeStream(user._id);
        }
      } catch (error) {
        onError?.(error as Error);
      }
    },
    [user._id, audioControls, onError]
  );

  const controls: RoomAudioControls = {
    setMuted: useCallback(
      (muted: boolean) => {
        audioControls.setMuted(muted);
        handleLocalMicrophone(!muted).catch(console.error);
      },
      [audioControls, handleLocalMicrophone]
    ),

    handleUserStream: useCallback(
      async (userId: string, stream: MediaStream) => {
        await audioControls.addStream({
          id: userId,
          stream,
          type: 'peer',
          gain: 0.8,
        });
      },
      [audioControls]
    ),

    cleanup: audioControls.cleanup,
  };

  return {
    state: audioState,
    controls,
  };
};
