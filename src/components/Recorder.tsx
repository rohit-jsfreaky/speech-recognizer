import { useCallback } from "react";
import { Mic, Square, Send, MessageCircle, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSpeechRecognition } from "@/Hooks/useSpeechRecognition";

interface RecorderProps {
  onTranscriptSubmit: (transcript: string) => void;
  setRecordingUrl: React.Dispatch<React.SetStateAction<string | null>>;
  recordingUrl: string | null;
}

const Recorder = ({
  onTranscriptSubmit,
  setRecordingUrl,
  recordingUrl,
}: RecorderProps) => {
  const {
    transcript,
    isRecording,
    startRecording,
    stopRecording,
    resetTranscript,
    isSupported,
  } = useSpeechRecognition();

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      if (recordingUrl) {
        setRecordingUrl(null);
      }

      startRecording();
    }
  };

  const handleSubmit = useCallback(() => {
    if (transcript.trim()) {
      onTranscriptSubmit(transcript.trim());
      resetTranscript();
    }
  }, [transcript, onTranscriptSubmit, resetTranscript]);

  if (!isSupported) {
    return (
      <div className="relative w-full flex items-center">
        <Input
          value="Speech recognition is not supported in this browser"
          readOnly
          className="pr-4 py-6 text-base bg-red-500/10 backdrop-blur-sm border-red-500/30 text-red-500 rounded-xl"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full flex items-center">
      <div className="absolute left-3 text-slate-400 dark:text-slate-500">
        <MessageCircle size={20} />
      </div>
      <Input
        value={transcript}
        readOnly
        placeholder="Your speech will appear here..."
        className={`pl-10 pr-24 py-6 text-white text-base bg-white/10 backdrop-blur-sm border-white/20 rounded-xl transition-all duration-300 ${
          isRecording
            ? "border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]"
            : ""
        }`}
      />
      <div className="absolute right-2 flex items-center space-x-2">
        {isRecording && (
          <div className="flex items-center mr-2">
            <Waves className="h-5 w-5 text-red-500 animate-pulse" />
          </div>
        )}

        {!isRecording ? (
          <Button
            onClick={toggleRecording}
            size="icon"
            variant="ghost"
            className="h-10 w-10 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 active:scale-95"
            title="Start recording"
          >
            <Mic size={18} />
          </Button>
        ) : (
          <Button
            onClick={toggleRecording}
            size="icon"
            variant="ghost"
            className="h-10 w-10 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 active:scale-95"
            title="Stop recording"
          >
            <Square size={14} />
          </Button>
        )}

        {!isRecording && transcript && (
          <Button
            onClick={handleSubmit}
            size="icon"
            variant="ghost"
            className="h-10 w-10 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 active:scale-95"
            title="Submit"
          >
            <Send size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Recorder;
