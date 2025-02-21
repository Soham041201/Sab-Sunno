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

      // Handle bot audio stream
      rtviClient.on(
        RTVIEvent.TrackStarted,
        (track: MediaStreamTrack, participant) => {
          if (participant && !participant.local && track.kind === 'audio') {
            try {
              console.log('Bot audio track received:', track);
              const stream = new MediaStream([track]);

              // Verify the stream has audio
              if (stream.getAudioTracks().length > 0) {
                console.log('Setting bot audio stream');
                setBotAudioStream(stream);

                // Create an immediate audio element to test the stream
                const testAudio = new Audio();
                testAudio.srcObject = stream;
                testAudio.autoplay = true;
                testAudio
                  .play()
                  .catch((err) =>
                    console.error('Error testing bot audio:', err)
                  );
              } else {
                console.error('No audio tracks in bot stream');
              }
            } catch (err) {
              console.error('Error creating bot audio stream:', err);
            }
          }
        }
      );

      // Handle connection states
      rtviClient.on(RTVIEvent.Connected, () => setIsConnected(true));
      rtviClient.on(RTVIEvent.Disconnected, () => setIsConnected(false));

      try {
        await rtviClient.initDevices();
        await rtviClient.connect();
        rtviClientRef.current = rtviClient;
      } catch (e) {
        console.error('Error connecting to RTVI:', e);
      }
    };

    initRTVI();

    return () => {
      rtviClientRef.current?.disconnect();
    };
  }, [roomId]);

  // Function to send audio to the bot
  const sendAudioToBot = (audioStream: MediaStream) => {
    if (!rtviClientRef.current) return;

    console.log(
      'Sending audio to bot, tracks:',
      audioStream.getAudioTracks().length
    );

    // Create an audio context to process the stream
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(audioStream);
    const destination = audioContext.createMediaStreamDestination();

    // Connect the audio nodes
    source.connect(destination);

    // Set this stream as the input for RTVI
    const processedStream = destination.stream;
    console.log(
      'Processed audio stream tracks:',
      processedStream.getAudioTracks().length
    );

    // Try to send the audio track to the transport
    try {
      //   const transport = rtviClientRef.current.transport as DailyTransport;
      //   transport.setAudioTrack(processedStream.getAudioTracks()[0]);
      console.log('Audio track sent to transport');
    } catch (err) {
      console.error('Error sending audio to transport:', err);
    }
  };

  return {
    rtviClient: rtviClientRef.current,
    isConnected,
    botAudioStream,
    sendAudioToBot,
  };
};
