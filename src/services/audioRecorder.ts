export type RecordingMode = 'microphone' | 'upload' | 'system' | 'both';

export class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  /**
   * Verifica se o navegador suporta gravação de áudio
   */
  isRecordingSupported(): boolean {
    return !!(
      navigator.mediaDevices && 
      typeof navigator.mediaDevices.getUserMedia === 'function' && 
      typeof MediaRecorder !== 'undefined'
    );
  }

  /**
   * Inicia a gravação de áudio
   */
  async startRecording(): Promise<void> {
    try {
      if (!this.isRecordingSupported()) {
        throw new Error('Gravação de áudio não é suportada neste navegador');
      }

      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000 // Otimizado para Whisper
        } 
      });

      this.audioChunks = [];
      
      // Usar WebM se disponível, senão WAV
      const options = this.getSupportedMimeType();
      this.mediaRecorder = new MediaRecorder(this.stream, options);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(1000); // Coleta dados a cada 1s
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      throw new Error('Erro ao acessar microfone. Verifique as permissões.');
    }
  }

  /**
   * Para a gravação e retorna o arquivo de áudio
   */
  async stopRecording(): Promise<File> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('Gravação não foi iniciada'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        try {
          const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });
          
          // Log para debug
          console.log('Áudio gravado:', {
            mimeType: mimeType,
            size: audioBlob.size,
            chunks: this.audioChunks.length
          });
          
          // Determinar extensão baseada no tipo MIME
          let extension = 'webm';
          if (mimeType.includes('wav')) extension = 'wav';
          else if (mimeType.includes('mp3')) extension = 'mp3';
          else if (mimeType.includes('mp4')) extension = 'm4a';
          
          const audioFile = new File([audioBlob], `recording.${extension}`, { 
            type: mimeType 
          });

          console.log('Arquivo criado:', {
            name: audioFile.name,
            type: audioFile.type,
            size: audioFile.size
          });

          this.cleanup();
          resolve(audioFile);
        } catch (error) {
          console.error('Erro ao criar arquivo de áudio:', error);
          reject(error);
        }
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Cancela a gravação
   */
  cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.cleanup();
  }

  /**
   * Limpa recursos
   */
  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  /**
   * Determina o melhor tipo MIME suportado
   */
  private getSupportedMimeType(): MediaRecorderOptions {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/wav'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return { mimeType: type };
      }
    }

    return {}; // Deixa o navegador escolher
  }

  /**
   * Verifica se está gravando
   */
  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }
}

// Instância singleton
export const audioRecorderService = new AudioRecorderService();