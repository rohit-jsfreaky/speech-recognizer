import { useCallback } from "react";
import { Mic, Square, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSpeechRecognition } from "@/Hooks/useSpeechRecognition";

interface RecorderProps {
  onTranscriptSubmit: (transcript: string) => void;
}

const Recorder = ({ onTranscriptSubmit }: RecorderProps) => {
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
          className="pr-4 py-6 text-base bg-white/5 backdrop-blur-sm border-white/20 text-yellow-400"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full flex items-center">
      <Input
        value={transcript}
        readOnly
        placeholder="Your speech will appear here..."
        className="pr-24 py-6 text-base bg-white/5 backdrop-blur-sm border-white/20"
      />
      <div className="absolute right-2 flex space-x-2">
        {!isRecording ? (
          <Button
            onClick={toggleRecording}
            size="icon"
            variant="ghost"
            className="h-8 w-8 bg-red-500/90 hover:bg-red-600 text-white rounded-full"
            title="Start recording"
          >
            <Mic size={18} />
          </Button>
        ) : (
          <Button
            onClick={toggleRecording}
            size="icon"
            variant="ghost"
            className="h-8 w-8 bg-red-500/90 hover:bg-red-600 text-white rounded-full"
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
            className="h-8 w-8 bg-green-500/90 hover:bg-green-600 text-white rounded-full"
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
