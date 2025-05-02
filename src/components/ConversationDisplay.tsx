import React, { useEffect } from "react";
import { Download, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ConversationDisplayProps {
  conversationRef: React.RefObject<HTMLDivElement | null>;
  userTranscript: string | null;
  aiResponse: string | null;
  isProcessing: boolean;
  recordingUrl: string | null;
  downloadRecording: () => void;
  setRecordingUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export function ConversationDisplay({
  conversationRef,
  userTranscript,
  aiResponse,
  isProcessing,
  recordingUrl,
  downloadRecording,
  setRecordingUrl,
}: ConversationDisplayProps) {
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [userTranscript, aiResponse, isProcessing]);

  return (
    <div
      ref={conversationRef}
      className="min-h-[15vh] max-h-[15vh] overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-800 scroll-smooth"
    >
      <AnimatePresence>
        {recordingUrl ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center gap-2"
          >
            <Button
              variant="outline"
              className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
              onClick={downloadRecording}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Recording
            </Button>

            <Button
              variant="outline"
              className="bg-red-500 hover:bg-red-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => setRecordingUrl(null)}
            >
              <Download className="h-4 w-4 mr-2" />
              Reset Session
            </Button>
          </motion.div>
        ) : userTranscript ? (
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-end"
            >
              <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm py-2.5 px-4 max-w-[80%] shadow-md">
                <p className="text-sm">{userTranscript}</p>
              </div>
            </motion.div>

            {isProcessing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex"
              >
                <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl rounded-tl-sm py-2 px-3 max-w-[80%] shadow flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-8 h-8 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex items-center h-5 space-x-1">
                    <div
                      className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              aiResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex"
                >
                  <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl rounded-tl-sm py-2 px-3 max-w-[80%] shadow">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-6 h-6 rounded-full flex items-center justify-center">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        AI Assistant
                      </p>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {aiResponse}
                    </p>
                  </div>
                </motion.div>
              )
            )}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-sm text-slate-500 dark:text-slate-400 py-4"
          >
            Speak something and submit to start a conversation
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
