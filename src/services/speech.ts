import { SpeechRecognition, SpeechRecognitionEvent } from '../types';

export class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.initializeSpeechRecognition();
  }

  /**
   * Inicializa o reconhecimento de voz
   */
  private initializeSpeechRecognition(): void {
    // Verifica se o navegador suporta Speech Recognition
    const SpeechRecognitionApi = 
      window.SpeechRecognition || 
      window.webkitSpeechRecognition;

    if (SpeechRecognitionApi) {
      this.recognition = new SpeechRecognitionApi();
      this.isSupported = true;
      
      // Configurações do reconhecimento
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'pt-BR';
    } else {
      console.warn('Speech Recognition não é suportado neste navegador');
      this.isSupported = false;
    }
  }

  /**
   * Verifica se o Speech Recognition é suportado
   */
  isSpeechRecognitionSupported(): boolean {
    return this.isSupported && this.recognition !== null;
  }

  /**
   * Inicia o reconhecimento de voz
   */
  startRecognition(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): void {
    if (!this.recognition) {
      onError('Reconhecimento de voz não está disponível');
      return;
    }

    try {
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        let isFinal = false;

        // Processa todos os resultados
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          transcript += result[0].transcript;
          
          if (result.isFinal) {
            isFinal = true;
          }
        }

        onResult(transcript, isFinal);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        onError(`Erro no reconhecimento: ${event.error}`);
      };

      this.recognition.onend = () => {
        onEnd();
      };

      this.recognition.start();
    } catch (error) {
      onError('Erro ao iniciar reconhecimento de voz');
    }
  }

  /**
   * Para o reconhecimento de voz
   */
  stopRecognition(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  /**
   * Cancela o reconhecimento de voz
   */
  abortRecognition(): void {
    if (this.recognition) {
      this.recognition.abort();
    }
  }
}

// Instância singleton
export const speechService = new SpeechService();