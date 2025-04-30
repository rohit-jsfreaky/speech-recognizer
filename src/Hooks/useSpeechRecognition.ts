import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionReturn {
  transcript: string;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
}

/**
 * Custom hook for speech recognition functionality
 */
export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const interimTranscriptRef = useRef<string>('');
  const finalTranscriptRef = useRef<string>('');

  // Initialize speech recognition
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
          // Reset the interim transcript for this result batch
          interimTranscriptRef.current = '';
          
          // Process all results
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcriptPiece = result[0].transcript;
            
            if (result.isFinal) {
              // Append to final transcript
              finalTranscriptRef.current += ' ' + transcriptPiece;
              finalTranscriptRef.current = finalTranscriptRef.current.trim();
            } else {
              // Add to interim transcript
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
          // Move any remaining interim transcript to final when recording ends
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
  
  // Start recording function
  const startRecording = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return;
    
    // Reset transcripts when starting a new recording
    finalTranscriptRef.current = '';
    interimTranscriptRef.current = '';
    setTranscript('');
    
    recognitionRef.current.start();
    setIsRecording(true);
  }, [isSupported]);
  
  // Stop recording function
  const stopRecording = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return;
    
    recognitionRef.current.stop();
  }, [isSupported]);
  
  // Reset transcript function
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