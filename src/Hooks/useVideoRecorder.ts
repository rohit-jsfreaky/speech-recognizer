import { useState, useRef, useEffect, useCallback } from 'react';

interface UseVideoRecorderProps {
  stream: MediaStream | null;
}

interface UseVideoRecorderReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  isRecording: boolean;
  recordingTime: number;
  recordingUrl: string | null;
  startRecording: () => void;
  stopRecording: () => void;
  downloadRecording: () => void;
  videoEnabled: boolean;
  toggleVideo: () => void;
  setRecordingUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useVideoRecorder({ stream }: UseVideoRecorderProps): UseVideoRecorderReturn {
  const videoRef = useRef<HTMLVideoElement>(null) as React.RefObject<HTMLVideoElement>;
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!stream || !videoRef.current) return;
    
    videoRef.current.srcObject = stream;
    videoRef.current.play().catch(error => {
      console.error("Error playing video:", error);
    });
    
    try {
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      } else {
        mediaRecorderRef.current = new MediaRecorder(stream);
      }
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: mediaRecorderRef.current?.mimeType || 'video/webm'
        });
        
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        
        recordedChunksRef.current = [];
      };
    } catch (err) {
      console.error('Error setting up media recorder:', err);
    }
    
    return () => {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      
      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
      }
    };
  }, [stream]);

  const startRecording = useCallback(() => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'inactive') return;
  
    recordedChunksRef.current = [];
    setRecordingUrl(null);
    setRecordingTime(0);
    
    mediaRecorderRef.current.start(1000);
    setIsRecording(true);
    
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') return;
    
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  }, []);

  const downloadRecording = useCallback(() => {
    if (!recordingUrl) return;
    
    const a = document.createElement('a');
    a.href = recordingUrl;
    a.download = `ai-conversation-${new Date().toISOString().slice(0, 10)}.webm`;
    a.click();
  }, [recordingUrl]);

  const toggleVideo = useCallback(() => {
    if (!stream) return;
    
    const videoTracks = stream.getVideoTracks();
    videoTracks.forEach(track => {
      track.enabled = !videoEnabled;
    });
    setVideoEnabled(prev => !prev);
  }, [stream, videoEnabled]);

  return {
    videoRef,
    isRecording,
    recordingTime,
    recordingUrl,
    startRecording,
    stopRecording,
    downloadRecording,
    videoEnabled,
    toggleVideo,
    setRecordingUrl
  };
}