import { Box } from '@mui/material';
import { FunctionComponent, useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  audioRef: HTMLAudioElement | null;
  size?: number;
  color?: string;
}

const AudioVisualizer: FunctionComponent<AudioVisualizerProps> = ({
  audioRef,
  size = 80,
  color = '#FF841F',
}) => {
  const rippleRefs = useRef<HTMLDivElement[]>([]);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!audioRef?.srcObject) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(audioRef.srcObject as MediaStream);

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.7;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const animate = () => {
        analyser.getByteFrequencyData(dataArray);
        
        // Get the average volume from the frequency data
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalizedVolume = average / 256;

        // Update each ripple
        rippleRefs.current.forEach((ref, index) => {
          if (ref) {
            const baseScale = 1 + (index * 0.1);
            const scale = baseScale + (normalizedVolume * 0.5);
            const baseOpacity = 0.4 - (index * 0.1);
            const opacity = Math.min(baseOpacity * normalizedVolume * 2, baseOpacity);

            ref.style.transform = `scale(${scale})`;
            ref.style.opacity = opacity.toString();
          }
        });

        animationRef.current = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        source.disconnect();
      };
    } catch (error) {
      console.error('Audio visualization error:', error);
    }
  }, [audioRef]);

  return (
    <Box
      sx={{
        position: 'absolute',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          ref={el => rippleRefs.current[i] = el as HTMLDivElement}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `1.5px solid ${color}`,
            opacity: 0,
            transform: 'scale(1)',
            transition: 'transform 100ms ease-out, opacity 100ms ease-out',
          }}
        />
      ))}
    </Box>
  );
};

export default AudioVisualizer; 