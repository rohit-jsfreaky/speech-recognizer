/**
 * Generates a mock AI response based on user input
 * @param userInput - The text input from the user
 * @returns A promise that resolves to the AI's response text
 */
export async function generateMockAIResponse(userInput: string): Promise<string> {
  // Make response generation take at least 2 seconds
  return new Promise((resolve) => {
    setTimeout(() => {
      // Basic response mapping based on keywords in the input
      const lowerInput = userInput.toLowerCase();
      
      if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
        resolve("Hello! How can I help you today?");
      } 
      else if (lowerInput.includes("weather")) {
        resolve("I don't have real-time weather data, but I'd be happy to chat about something else!");
      }
      else if (lowerInput.includes("name")) {
        resolve("I'm an AI assistant. You can call me Assistant!");
      }
      else if (lowerInput.includes("joke") || lowerInput.includes("funny")) {
        const jokes = [
          "Why don't scientists trust atoms? Because they make up everything!",
          "Why did the scarecrow win an award? Because he was outstanding in his field!",
          "Why couldn't the bicycle stand up by itself? It was two tired!"
        ];
        resolve(jokes[Math.floor(Math.random() * jokes.length)]);
      }
      else if (lowerInput.includes("thank")) {
        resolve("You're welcome! Is there anything else you'd like to know?");
      }
      else if (lowerInput.includes("bye")) {
        resolve("Goodbye! Have a great day!");
      }
      else {
        // General responses for when we don't have a specific match
        const responses = [
          "That's interesting! Tell me more about it.",
          "I understand. Is there anything specific you'd like to know?",
          "I'm processing what you said. Can you elaborate?",
          "Thanks for sharing. How can I assist you with that?",
          "I'm here to help. What would you like me to do next?"
        ];
        resolve(responses[Math.floor(Math.random() * responses.length)]);
      }
    }, 2000);
  });
}