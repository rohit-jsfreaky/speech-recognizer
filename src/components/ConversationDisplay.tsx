import React, { useEffect } from 'react';
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "./Loader";

interface ConversationDisplayProps {
  conversationRef: React.RefObject<HTMLDivElement | null>;
  userTranscript: string | null;
  aiResponse: string | null;
  isProcessing: boolean;
  recordingUrl: string | null;
  downloadRecording: () => void;
}

export function ConversationDisplay({
  conversationRef,
  userTranscript,
  aiResponse,
  isProcessing,
  recordingUrl,
  downloadRecording
}: ConversationDisplayProps) {
  // Scroll conversation to bottom when new messages appear
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [userTranscript, aiResponse, isProcessing]);

  return (
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
  );
}