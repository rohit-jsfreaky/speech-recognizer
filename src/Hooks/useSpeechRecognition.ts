import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionReturn {
  transcript: string;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const interimTranscriptRef = useRef<string>('');
  const finalTranscriptRef = useRef<string>('');

  useEffect(() => {
    const isBrowserSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setIsSupported(isBrowserSupported);
    
    if (isBrowserSupported) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          interimTranscriptRef.current = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcriptPiece = result[0].transcript;
            
            if (result.isFinal) {
              finalTranscriptRef.current += ' ' + transcriptPiece;
              finalTranscriptRef.current = finalTranscriptRef.current.trim();
            } else {
              interimTranscriptRef.current += transcriptPiece;
            }
          }
          
          setTranscript(
            (finalTranscriptRef.current + ' ' + interimTranscriptRef.current).trim()
          );
        };
        
        recognitionRef.current.onerror = (event: ErrorEvent) => {
          console.error('Speech recognition error', event);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          if (interimTranscriptRef.current) {
            finalTranscriptRef.current += ' ' + interimTranscriptRef.current;
            finalTranscriptRef.current = finalTranscriptRef.current.trim();
            interimTranscriptRef.current = '';
            setTranscript(finalTranscriptRef.current);
          }
          setIsRecording(false);
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);
  
  const startRecording = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return;
    
    finalTranscriptRef.current = '';
    interimTranscriptRef.current = '';
    setTranscript('');
    
    recognitionRef.current.start();
    setIsRecording(true);
  }, [isSupported]);
  
  const stopRecording = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return;
    
    recognitionRef.current.stop();
  }, [isSupported]);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = '';
    interimTranscriptRef.current = '';
    setTranscript('');
  }, []);
  
  return {
    transcript,
    isRecording,
    startRecording,
    stopRecording,
    resetTranscript,
    isSupported
  };
}