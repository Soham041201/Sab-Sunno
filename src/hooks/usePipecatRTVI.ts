import { RTVIClient, RTVIEvent } from '@pipecat-ai/client-js';
import { DailyTransport } from '@pipecat-ai/daily-transport';
import { useEffect, useRef, useState } from 'react';

export const usePipecatRTVI = (roomId: string) => {
  const rtviClientRef = useRef<RTVIClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [botAudioStream, setBotAudioStream] = useState<MediaStream | null>(
    null
  );

  useEffect(() => {
    const initRTVI = async () => {
      const transport = new DailyTransport();
      const rtviClient = new RTVIClient({
        transport,
        params: {
          baseUrl:
            process.env.REACT_APP_PIPECAT_SERVER_URL ||
            'http://localhost:7860/',
        },
        enableMic: true,
        enableCam: false,
        timeout: 30 * 1000,
      });

      rtviClient.on(
        RTVIEvent.TrackStarted,
        (track: MediaStreamTrack, participant) => {
          if (participant && !participant.local && track.kind === 'audio') {
            const stream = new MediaStream([track]);
            if (stream.getAudioTracks().length > 0) {
              setBotAudioStream(stream);
            }
          }
        }
      );

      rtviClient.on(RTVIEvent.Connected, () => setIsConnected(true));
      rtviClient.on(RTVIEvent.Disconnected, () => setIsConnected(false));

      try {
        await rtviClient.initDevices();
        await rtviClient.connect();
        rtviClientRef.current = rtviClient;
      } catch (error) {
        console.error('Failed to initialize RTVI:', error);
      }
    };

    initRTVI();

    return () => {
      if (rtviClientRef.current) {
        rtviClientRef.current.disconnect();
        rtviClientRef.current = null;
      }
    };
  }, [roomId]);

  return {
    rtviClient: rtviClientRef.current,
    isConnected,
    botAudioStream,
  };
};
