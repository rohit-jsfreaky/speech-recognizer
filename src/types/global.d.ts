interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
    SpeechRecognition: typeof SpeechRecognition;
  }
  
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
    interpretation: unknown;
  }
  
  interface SpeechRecognitionResult {
    readonly length: number;
    readonly isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
  }
  
  interface SpeechRecognitionResultList {
    readonly length: number;
    [index: number]: SpeechRecognitionResult;
  }
  
  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onaudioend: (event: Event) => void;
    onaudiostart: (event: Event) => void;
    onend: (event: Event) => void;
    onerror: (event: ErrorEvent) => void;
    onnomatch: (event: Event) => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onstart: (event: Event) => void;
    start: () => void;
    stop: () => void;
    abort: () => void;
  }