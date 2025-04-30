import { useEffect, useRef, useState } from "react";
import { Camera, VideoOff, Download, StopCircle, Video } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Recorder from "./Recorder";
import { generateMockAIResponse } from "@/utils/mockAI";
import Loader from "./Loader";

const CameraVideoPlayback = ({ stream }: { stream: MediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userTranscript, setUserTranscript] = useState<string | null>(null);
  const [aiResponse, setAIResponse] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const conversationRef = useRef<HTMLDivElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      // Initially disable audio tracks for the video display
      // but we'll use them for recording
      stream.getAudioTracks().forEach(track => {
        track.enabled = true; // Enable for recording purposes
      });
      
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(error => {
        console.error("Error playing video:", error);
      });
      
      // Setup media recorder
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
          // Create a blob from the recorded chunks
          const blob = new Blob(recordedChunksRef.current, {
            type: mediaRecorderRef.current?.mimeType || 'video/webm'
          });
          
          // Create a URL for the blob
          const url = URL.createObjectURL(blob);
          setRecordingUrl(url);
          
          // Reset recording state
          recordedChunksRef.current = [];
        };
        
        // Start recording automatically
        startRecording();
      } catch (err) {
        console.error('Error setting up media recorder:', err);
      }
    }
    
    return () => {
      // Clean up
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
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

  // Scroll conversation to bottom when new messages appear
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [userTranscript, aiResponse, isProcessing]);

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      // Reset recording data
      recordedChunksRef.current = [];
      setRecordingUrl(null);
      setRecordingTime(0);
      
      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);
      
      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleTranscriptSubmit = async (text: string) => {
    // Set the user's transcript
    setUserTranscript(text);
    
    // Clear any previous AI response
    setAIResponse(null);
    
    // Show loader
    setIsProcessing(true);
    
    try {
      // Wait at least 2 seconds before showing response
      const response = await generateMockAIResponse(text);
      setAIResponse(response);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setAIResponse("Sorry, I couldn't process your request.");
    } finally {
      // Ensure loader is shown for at least 2 seconds
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    }
  };

  const downloadRecording = () => {
    if (recordingUrl) {
      const a = document.createElement('a');
      a.href = recordingUrl;
      a.download = `session-recording-${new Date().toISOString().slice(0, 10)}.webm`;
      a.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[88%] p-5">
      <Card className="w-full max-w-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
        {/* Video Section */}
        <CardContent className="p-0 relative">
          <div className="absolute top-4 left-4 bg-black/30 px-3 py-1 rounded-full flex items-center space-x-2 z-10">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-medium">LIVE</span>
          </div>
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 right-4 bg-black/30 px-3 py-1 rounded-full flex items-center space-x-2 z-10">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-medium">REC {formatRecordingTime(recordingTime)}</span>
            </div>
          )}
          
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            muted={true} // Mute for display but not for recording
            className={cn(
              "w-full h-[35vh] object-cover bg-black",
              !videoEnabled && "hidden"
            )}
          />
          
          {!videoEnabled && (
            <div className="flex items-center justify-center bg-slate-900 w-full h-[35vh]">
              <VideoOff className="h-16 w-16 text-slate-400" />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex justify-center space-x-4 pt-6">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-white/20 hover:bg-white/30 border-white/40"
                onClick={toggleVideo}
                title={videoEnabled ? "Disable camera" : "Enable camera"}
              >
                {videoEnabled ? (
                  <Camera className="h-5 w-5 text-white" />
                ) : (
                  <VideoOff className="h-5 w-5 text-white" />
                )}
              </Button>

              {isRecording ? (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-red-500/80 hover:bg-red-600/80 border-white/40"
                  onClick={stopRecording}
                  title="Stop recording"
                >
                  <StopCircle className="h-5 w-5 text-white" />
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-white/20 hover:bg-white/30 border-white/40"
                  onClick={startRecording}
                  title="Start recording"
                  disabled={!!recordingUrl}
                >
                  <Video className="h-5 w-5 text-white" />
                </Button>
              )}

              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-white/20 hover:bg-white/30 border-white/40"
                onClick={toggleFullscreen}
                title="Toggle fullscreen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  {isFullscreen ? (
                    <>
                      <path d="M8 3v4a1 1 0 0 1-1 1H3" />
                      <path d="M21 8h-4a1 1 0 0 1-1-1V3" />
                      <path d="M3 16h4a1 1 0 0 1 1 1v4" />
                      <path d="M16 21v-4a1 1 0 0 1 1-1h4" />
                    </>
                  ) : (
                    <>
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </>
                  )}
                </svg>
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Conversation Section */}
        <div 
          ref={conversationRef}
          className="max-h-[15vh] overflow-y-auto bg-slate-100 dark:bg-slate-800 p-3 border-t border-slate-200 dark:border-slate-700"
        >
          {recordingUrl ? (
            <div className="flex justify-center">
              <Button 
                variant="outline"
                className="bg-green-500/20 hover:bg-green-500/30 text-green-500 dark:text-green-400 border-green-500/50"
                onClick={downloadRecording}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Recording
              </Button>
            </div>
          ) : userTranscript ? (
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg py-2 px-3 max-w-[80%]">
                  <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">You</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{userTranscript}</p>
                </div>
              </div>
              
              {isProcessing ? (
                <div className="flex">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-lg py-2 px-3 max-w-[80%]">
                    <p className="text-sm text-green-800 dark:text-green-300 font-medium">AI</p>
                    <div className="flex items-center h-5">
                      <Loader size="sm" color="green" thickness="thin" />
                    </div>
                  </div>
                </div>
              ) : aiResponse && (
                <div className="flex">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-lg py-2 px-3 max-w-[80%]">
                    <p className="text-sm text-green-800 dark:text-green-300 font-medium">AI</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{aiResponse}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-2">
              Speak something and submit to start a conversation
            </p>
          )}
        </div>

        {/* Input Section */}
        <CardFooter className="p-3 bg-slate-900">
          <Recorder onTranscriptSubmit={handleTranscriptSubmit} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default CameraVideoPlayback;