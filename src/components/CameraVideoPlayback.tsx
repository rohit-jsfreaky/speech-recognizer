import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Recorder from "./Recorder";
import { useVideoRecorder } from "@/Hooks/useVideoRecorder";
import { useConversation } from "@/Hooks/useConversation";
import { VideoDisplay } from "./VideoDisplay";
import { ConversationDisplay } from "./ConversationDisplay";
import ErrorBoundary from "./ErrorBoundary";
import { useError } from "@/context/ErrorContext";

const CameraVideoPlayback = ({ stream }: { stream: MediaStream }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { error } = useError();
  
  const {
    videoRef,
    isRecording,
    recordingTime,
    recordingUrl,
    startRecording,
    stopRecording,
    downloadRecording,
    videoEnabled,
    toggleVideo
  } = useVideoRecorder({ stream });

  const {
    userTranscript,
    aiResponse,
    isProcessing,
    conversationRef,
    handleTranscriptSubmit
  } = useConversation();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // If we have an error, show it
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[88%] p-5">
        <Card className="w-full max-w-3xl overflow-hidden border-red-300 dark:border-red-700 shadow-lg">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">Error</h2>
            <p>{error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 rounded-md transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[88%] p-5">
      <ErrorBoundary>
        <Card className="w-full max-w-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
          {/* Video Section */}
          <CardContent className="p-0">
            <VideoDisplay 
              videoRef={videoRef}
              isRecording={isRecording}
              recordingTime={recordingTime}
              videoEnabled={videoEnabled}
              toggleVideo={toggleVideo}
              startRecording={startRecording}
              stopRecording={stopRecording}
              toggleFullscreen={toggleFullscreen}
              isFullscreen={isFullscreen}
              recordingUrl={recordingUrl}
            />
          </CardContent>

          {/* Conversation Section */}
          <ConversationDisplay 
            conversationRef={conversationRef}
            userTranscript={userTranscript}
            aiResponse={aiResponse}
            isProcessing={isProcessing}
            recordingUrl={recordingUrl}
            downloadRecording={downloadRecording}
          />

          {/* Input Section */}
          <CardFooter className="p-3 bg-slate-900">
            <Recorder onTranscriptSubmit={handleTranscriptSubmit} />
          </CardFooter>
        </Card>
      </ErrorBoundary>
    </div>
  );
};

export default CameraVideoPlayback;