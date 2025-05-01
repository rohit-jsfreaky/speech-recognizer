# Mock AI Voice Recognition App

A React and TypeScript application that simulates an AI voice assistant with video recording capabilities. This app uses browser APIs for speech recognition and camera access to create an interactive experience.

![AI Voice Recognition](https://www.datasciencecentral.com/wp-content/uploads/2022/08/AdobeStock_355358427.jpg)

## Features

- 🎤 **Speech Recognition**: Convert your speech to text in real-time
- 🤖 **AI Responses**: Get simulated AI responses to your queries
- 📹 **Video Recording**: Record your conversation sessions with the AI
- 🎥 **Camera Controls**: Toggle camera, enter fullscreen mode
- 🌓 **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for fast development and building
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons

## Project Structure

The application is organized into several key components:

- **App**: Main entry point that handles permissions and renders appropriate components
- **CameraVideoPlayback**: Central component that combines video display, conversation, and recording
- **VideoDisplay**: Handles camera feed and recording controls
- **Recorder**: Manages speech recognition input
- **ConversationDisplay**: Shows the conversation history between user and AI

## Key Custom Hooks

- [`useSpeechRecognition`](src/Hooks/useSpeechRecognition.ts): Provides speech recognition capabilities
- [`useVideoRecorder`](src/Hooks/useVideoRecorder.ts): Manages video recording and playback
- [`useConversation`](src/Hooks/useConversation.ts): Handles conversation state and AI responses

## App Flow

1. **Permission Request**: The app requests camera and microphone permissions
2. **Video Interface**: Once permissions are granted, the camera interface is displayed
3. **Speech Recognition**: Users can speak and see their speech transcribed in real-time
4. **AI Response**: After submitting speech, the app generates a mock AI response
5. **Video Recording**: Users can record their entire session and download it

## Running the Project

### Prerequisites

- Node.js (v18+)
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mock-ai-voice-recognizer.git

# Navigate to the project directory
cd mock-ai-voice-recognizer

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## Browser Compatibility

This application uses modern web APIs including:
- Web Speech API for speech recognition
- MediaRecorder API for video recording
- getUserMedia API for camera access

For best results, use a modern browser like Chrome, Edge, or Firefox.


This project was bootstrapped with Vite and uses UI components from the shadcn/ui library.
