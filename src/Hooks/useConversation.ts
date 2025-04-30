import { useState, useCallback, useRef } from 'react';
import { generateMockAIResponse } from '@/utils/mockAI';

interface UseConversationReturn {
  userTranscript: string | null;
  aiResponse: string | null;
  isProcessing: boolean;
  conversationRef: React.RefObject<HTMLDivElement | null>;
  handleTranscriptSubmit: (text: string) => Promise<void>;
}

export function useConversation(): UseConversationReturn {
  const [userTranscript, setUserTranscript] = useState<string | null>(null);
  const [aiResponse, setAIResponse] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const conversationRef = useRef<HTMLDivElement>(null);

  const handleTranscriptSubmit = useCallback(async (text: string) => {
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
  }, []);

  return {
    userTranscript,
    aiResponse,
    isProcessing,
    conversationRef,
    handleTranscriptSubmit
  };
}