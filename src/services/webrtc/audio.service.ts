import { useRef, useCallback } from 'react';

export const useAudioService = () => {
  const audioElements = useRef<Map<string, HTMLAudioElement>>(new Map());

  const addAudioElement = useCallback((element: HTMLAudioElement | null, userId: string) => {
    if (element) {
      audioElements.current.set(userId, element);
    }
    return element;
  }, []);

  const setStream = useCallback((userId: string, stream: MediaStream) => {
    const element = audioElements.current.get(userId);
    if (element) {
      element.srcObject = stream;
      element.volume = userId === 'local' ? 0 : 1;
    }
  }, []);

  const removeAudioElement = useCallback((userId: string) => {
    audioElements.current.delete(userId);
  }, []);

  const cleanup = useCallback(() => {
    audioElements.current.clear();
  }, []);

  return {
    addAudioElement,
    setStream,
    removeAudioElement,
    cleanup,
  };
}; 