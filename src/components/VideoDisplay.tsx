import React from 'react';
import { Camera, VideoOff, StopCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoDisplayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isRecording: boolean;
  recordingTime: number;
  videoEnabled: boolean;
  toggleVideo: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
  recordingUrl: string | null;
}

const formatRecordingTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function VideoDisplay({
  videoRef,
  isRecording,
  recordingTime,
  videoEnabled,
  toggleVideo,
  startRecording,
  stopRecording,
  toggleFullscreen,
  isFullscreen,
  recordingUrl
}: VideoDisplayProps) {
  return (
    <div className="p-0 relative">
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
        muted={true}
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
    </div>
  );
}