import React from 'react';
import { Camera, VideoOff, StopCircle, Video, Maximize, Minimize } from "lucide-react";
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
    <div className="p-0 relative overflow-hidden group rounded-t-lg">
      <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-2 z-10 shadow-md">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-white text-xs font-medium">LIVE</span>
      </div>
      
      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-2 z-10 shadow-md animate-pulse-slow">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="text-white text-xs font-medium">REC {formatRecordingTime(recordingTime)}</span>
        </div>
      )}
      
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline
        muted={true}
        className={cn(
          "w-full h-[40vh] object-cover bg-black transition-opacity duration-300",
          !videoEnabled && "opacity-0"
        )}
      />
      
      {!videoEnabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 w-full h-[40vh]">
          <div className="flex flex-col items-center space-y-2">
            <VideoOff className="h-16 w-16 text-slate-400" />
            <span className="text-slate-400 text-sm">Camera disabled</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-80 group-hover:opacity-100 transition-opacity">
        <div className="flex justify-center space-x-4 pt-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/20 hover:bg-white/30 border-white/40 transition-transform hover:scale-110"
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
              className="rounded-full bg-red-500/80 hover:bg-red-600/80 border-white/40 shadow-lg animate-pulse-slow transition-transform hover:scale-110"
              onClick={stopRecording}
              title="Stop recording"
            >
              <StopCircle className="h-5 w-5 text-white" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/20 hover:bg-white/30 border-white/40 transition-transform hover:scale-110"
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
            className="rounded-full bg-white/20 hover:bg-white/30 border-white/40 transition-transform hover:scale-110"
            onClick={toggleFullscreen}
            title="Toggle fullscreen"
          >
            {isFullscreen ? (
              <Minimize className="h-5 w-5 text-white" />
            ) : (
              <Maximize className="h-5 w-5 text-white" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}