// Tipos para as respostas da API
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// Tipos para transcrição
export interface TranscribeResponse {
  transcript: string;
  success: boolean;
  message?: string;
}

// Tipos para diagnóstico
export interface DiagnosisExplanation {
  reasoning: string;
  confidence: number;
  keySymptoms: string[];
  differentialDiagnoses: string[];
  recommendationBasis: string;
}

export interface DiagnosisResult {
  diagnosis: string;
  diseases: string[];
  exams: string[];
  medications: string[];
  explanation?: DiagnosisExplanation;
  language?: 'pt' | 'en';
}

export interface DiagnoseResponse extends DiagnosisResult {
  success: boolean;
  message?: string;
}

// Tipos para histórico de consultas
export interface ConsultationRecord {
  id: string;
  timestamp: Date;
  transcript: string;
  result: DiagnosisResult;
  patientId?: string; // Para futuro sistema de usuários
  audioFileName?: string;
}

export interface HistoryState {
  records: ConsultationRecord[];
  isLoading: boolean;
  error: string | null;
}

// Tipos para chat contextual
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Estados da aplicação
export interface AppState {
  isRecording: boolean;
  transcript: string;
  isTranscribing: boolean;
  isAnalyzing: boolean;
  result: DiagnosisResult | null;
  error: string | null;
  showChat: boolean;
  showHistory: boolean;
  chatState: ChatState;
  historyState: HistoryState;
}

// Propriedades do Speech Recognition
export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: (event: Event) => void;
  onstart: (event: Event) => void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}