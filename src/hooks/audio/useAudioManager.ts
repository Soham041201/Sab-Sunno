import { useEffect, useRef, useState, useCallback } from 'react';

// Types
interface AudioStream {
  id: string;
  stream: MediaStream;
  type: 'peer' | 'bot' | 'local';
  gain: number;
}

type AudioErrorType =
  | 'initialization_failed'
  | 'stream_failed'
  | 'connection_failed'
  | 'processing_failed'
  | 'cleanup_failed';

interface AudioError extends Error {
  type: AudioErrorType;
  streamId?: string;
  recoverable: boolean;
}

interface AudioManagerState {
  isMuted: boolean;
  isProcessing: boolean;
  streams: Map<string, AudioStream>;
  masterVolume: number;
  audioContext: AudioContext | null;
  error: AudioError | null;
  isRecovering: boolean;
}

type AudioContextStatus = 'initialized' | 'suspended' | 'running' | 'closed';

interface AudioNodes {
  sourceNode: MediaStreamAudioSourceNode;
  gainNode: GainNode;
}

// Add error handling utilities
const createAudioError = (
  type: AudioErrorType,
  message: string,
  streamId?: string,
  recoverable = true
): AudioError => ({
  name: 'AudioError',
  type,
  message,
  streamId,
  recoverable,
});

export const useAudioManager = () => {
  // Core state and refs
  const [state, setState] = useState<AudioManagerState>({
    isMuted: true,
    isProcessing: false,
    streams: new Map(),
    masterVolume: 1,
    audioContext: null,
    error: null,
    isRecovering: false,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const streamNodesRef = useRef<Map<string, AudioNodes>>(new Map());

  // Initialize audio context
  const initializeAudioContext = useCallback(async () => {
    try {
      if (
        !audioContextRef.current ||
        audioContextRef.current.state === 'closed'
      ) {
        const AudioContextConstructor =
          window.AudioContext || (window as any).webkitAudioContext;

        // Create context with optimal settings
        const context = new AudioContextConstructor({
          latencyHint: 'interactive',
          sampleRate: 48000,
        });

        audioContextRef.current = context;

        setState((prev) => ({
          ...prev,
          audioContext: context,
          isProcessing: true,
        }));

        if (context.state === 'suspended') {
          await context.resume();
        }
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: createAudioError(
          'initialization_failed',
          'Failed to initialize audio context'
        ),
        isProcessing: false,
      }));
      throw error;
    }
  }, []);

  // Error handling with recovery strategies
  const handleError = useCallback(
    (error: AudioError) => {
      console.error(`Audio Error (${error.type}):`, error.message);

      setState((prev) => ({
        ...prev,
        error,
        isProcessing:
          error.type === 'initialization_failed' ? false : prev.isProcessing,
        isRecovering: error.recoverable,
      }));

      // Handle recoverable errors
      if (error.recoverable) {
        switch (error.type) {
          case 'initialization_failed':
            initializeAudioContext().catch(() => {
              setState((prev) => ({ ...prev, isRecovering: false }));
            });
            break;
          case 'stream_failed':
            if (error.streamId && streamNodesRef.current.has(error.streamId)) {
              const nodes = streamNodesRef.current.get(error.streamId);
              if (nodes) {
                nodes.sourceNode.disconnect();
                nodes.gainNode.disconnect();
                streamNodesRef.current.delete(error.streamId);
                setState((prev) => {
                  const newStreams = new Map(prev.streams);
                  error?.streamId && newStreams.delete(error.streamId);
                  return {
                    ...prev,
                    streams: newStreams,
                    isRecovering: false,
                  };
                });
              }
            }
            break;
          default:
            setState((prev) => ({ ...prev, isRecovering: false }));
        }
      }
    },
    [initializeAudioContext]
  );

  // Stream removal
  const removeStream = useCallback(
    (streamId: string) => {
      try {
        const nodes = streamNodesRef.current.get(streamId);
        if (nodes) {
          nodes.sourceNode.disconnect();
          nodes.gainNode.disconnect();
          streamNodesRef.current.delete(streamId);
          setState((prev) => {
            const newStreams = new Map(prev.streams);
            newStreams.delete(streamId);
            return { ...prev, streams: newStreams };
          });
        }
      } catch (error) {
        handleError(
          createAudioError(
            'stream_failed',
            'Failed to remove audio stream',
            streamId,
            true
          )
        );
      }
    },
    [handleError]
  );

  // Add stream (now has access to both functions)
  const addStream = useCallback(
    async (audioStream: AudioStream) => {
      try {
        if (!audioContextRef.current) {
          throw new Error('Audio context not initialized');
        }

        // Remove existing stream if it exists
        if (streamNodesRef.current.has(audioStream.id)) {
          removeStream(audioStream.id);
        }

        const sourceNode = audioContextRef.current.createMediaStreamSource(
          audioStream.stream
        );
        const gainNode = audioContextRef.current.createGain();

        // Set initial gain (boost bot audio slightly)
        const initialGain =
          audioStream.type === 'bot'
            ? audioStream.gain * 1.2
            : audioStream.gain;
        gainNode.gain.value = initialGain;

        // Connect nodes
        sourceNode.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        // Store nodes
        streamNodesRef.current.set(audioStream.id, { sourceNode, gainNode });

        // Update state
        setState((prev) => ({
          ...prev,
          streams: new Map(prev.streams).set(audioStream.id, audioStream),
        }));
      } catch (error) {
        handleError(
          createAudioError(
            'stream_failed',
            `Failed to add stream ${audioStream.id}`,
            audioStream.id,
            true
          )
        );
      }
    },
    [removeStream, handleError]
  );

  // Monitor audio context state
  const getContextStatus = useCallback((): AudioContextStatus => {
    if (!audioContextRef.current) return 'initialized';
    return audioContextRef.current.state as AudioContextStatus;
  }, []);

  // Suspend audio processing
  const suspendProcessing = useCallback(async () => {
    try {
      if (
        audioContextRef.current &&
        audioContextRef.current.state === 'running'
      ) {
        await audioContextRef.current.suspend();
        setState((prev) => ({ ...prev, isProcessing: false }));
      }
    } catch (error) {
      console.error('Failed to suspend audio processing:', error);
      setState((prev) => ({
        ...prev,
        error: createAudioError(
          'processing_failed',
          'Failed to suspend audio processing'
        ),
      }));
    }
  }, []);

  // Resume audio processing
  const resumeProcessing = useCallback(async () => {
    try {
      if (
        audioContextRef.current &&
        audioContextRef.current.state === 'suspended'
      ) {
        await audioContextRef.current.resume();
        setState((prev) => ({ ...prev, isProcessing: true }));
      }
    } catch (error) {
      console.error('Failed to resume audio processing:', error);
      setState((prev) => ({
        ...prev,
        error: createAudioError(
          'processing_failed',
          'Failed to resume audio processing'
        ),
      }));
    }
  }, []);

  // Set stream gain
  const setStreamGain = useCallback((streamId: string, gain: number) => {
    try {
      const nodes = streamNodesRef.current.get(streamId);
      if (nodes) {
        nodes.gainNode.gain.value = gain;
        setState((prev) => {
          const stream = prev.streams.get(streamId);
          if (stream) {
            const newStreams = new Map(prev.streams);
            newStreams.set(streamId, { ...stream, gain });
            return { ...prev, streams: newStreams };
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Failed to set stream gain:', error);
      setState((prev) => ({
        ...prev,
        error: createAudioError(
          'stream_failed',
          'Failed to set stream gain',
          streamId
        ),
      }));
    }
  }, []);

  // Set master volume
  const setMasterVolume = useCallback((volume: number) => {
    try {
      if (masterGainRef.current) {
        // Clamp volume between 0 and 1
        const normalizedVolume = Math.max(0, Math.min(1, volume));

        // Smooth transition to new volume
        const gainNode = masterGainRef.current;
        const currentTime = audioContextRef.current?.currentTime || 0;
        gainNode.gain.linearRampToValueAtTime(
          normalizedVolume,
          currentTime + 0.1
        );

        setState((prev) => ({
          ...prev,
          masterVolume: normalizedVolume,
        }));
      }
    } catch (error) {
      console.error('Failed to set master volume:', error);
      setState((prev) => ({
        ...prev,
        error: createAudioError('stream_failed', 'Failed to set master volume'),
      }));
    }
  }, []);

  // Set muted state
  const setMuted = useCallback(
    (muted: boolean) => {
      try {
        if (masterGainRef.current) {
          const gainNode = masterGainRef.current;
          const currentTime = audioContextRef.current?.currentTime || 0;

          // Smooth transition to muted/unmuted
          gainNode.gain.linearRampToValueAtTime(
            muted ? 0 : state.masterVolume,
            currentTime + 0.1
          );

          setState((prev) => ({
            ...prev,
            isMuted: muted,
          }));
        }
      } catch (error) {
        console.error('Failed to set mute state:', error);
        setState((prev) => ({
          ...prev,
          error: createAudioError('stream_failed', 'Failed to set mute state'),
        }));
      }
    },
    [state.masterVolume]
  );

  // Enhance cleanup
  const cleanup = useCallback(async () => {
    try {
      // Stop all active streams
      streamNodesRef.current.forEach((nodes, streamId) => {
        try {
          nodes.sourceNode.disconnect();
          nodes.gainNode.disconnect();
          streamNodesRef.current.delete(streamId);
        } catch (error) {
          console.warn(`Failed to cleanup stream ${streamId}:`, error);
        }
      });

      // Close audio context
      if (audioContextRef.current?.state !== 'closed') {
        await audioContextRef.current?.close();
      }

      // Reset state
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        streams: new Map(),
        error: null,
      }));
    } catch (error) {
      handleError(
        createAudioError(
          'cleanup_failed',
          'Failed to cleanup audio resources',
          undefined,
          false
        )
      );
    }
  }, [handleError]);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup().catch(console.error);
    };
  }, [cleanup]);

  return {
    state,
    controls: {
      initializeAudioContext,
      suspendProcessing,
      resumeProcessing,
      getContextStatus,
      addStream,
      removeStream,
      setStreamGain,
      setMasterVolume,
      setMuted,
      handleError,
      cleanup,
    },
  };
};
