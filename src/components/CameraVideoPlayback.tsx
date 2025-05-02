import { useState } from "react";
import { Card } from "@/components/ui/card";
import Recorder from "./Recorder";
import { useVideoRecorder } from "@/Hooks/useVideoRecorder";
import { useConversation } from "@/Hooks/useConversation";
import { VideoDisplay } from "./VideoDisplay";
import { ConversationDisplay } from "./ConversationDisplay";
import ErrorBoundary from "./ErrorBoundary";
import { useError } from "@/context/ErrorContext";
import { AlertCircle } from "lucide-react";

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
    toggleVideo,
    setRecordingUrl
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[88%] p-5">
        <Card className="w-full max-w-3xl overflow-hidden border-red-300 dark:border-red-700 shadow-xl bg-red-50 dark:bg-red-950/30 rounded-2xl">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-3 text-red-600 dark:text-red-400">Error Encountered</h2>
            <p className="mb-6 text-red-700 dark:text-red-300">{error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[88%] p-5">
      <ErrorBoundary>
        <Card className="w-full max-w-3xl overflow-hidden border-0 dark:border-slate-800/50 shadow-2xl rounded-2xl bg-white dark:bg-slate-950 transition-all duration-300">
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

          <ConversationDisplay 
            conversationRef={conversationRef}
            userTranscript={userTranscript}
            aiResponse={aiResponse}
            isProcessing={isProcessing}
            recordingUrl={recordingUrl}
            downloadRecording={downloadRecording}
            setRecordingUrl={setRecordingUrl} 
          />
          <div className="p-4 bg-slate-900">
            <Recorder onTranscriptSubmit={handleTranscriptSubmit} setRecordingUrl={setRecordingUrl} recordingUrl={recordingUrl}/>
          </div>
        </Card>
      </ErrorBoundary>
    </div>
  );
};

export default CameraVideoPlayback;