import axios from 'axios';
import { DiagnoseResponse, TranscribeResponse, ChatResponse, DiagnosisResult } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 segundos para upload de áudio
});

export class ApiService {
  /**
   * Transcreve áudio usando Whisper no backend
   */
  static async transcribeAudio(audioFile: File): Promise<TranscribeResponse> {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);

      const response = await api.post<TranscribeResponse>('/api/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutos para transcrição
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Erro ao transcrever áudio';
        throw new Error(message);
      }
      throw new Error('Erro de conexão ao transcrever áudio');
    }
  }

  /**
   * Gera diagnóstico baseado no transcript
   */
  static async getDiagnosis(transcript: string): Promise<DiagnoseResponse> {
    try {
      const response = await api.post<DiagnoseResponse>('/api/diagnose', {
        transcript,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Erro ao gerar diagnóstico';
        throw new Error(message);
      }
      throw new Error('Erro de conexão ao gerar diagnóstico');
    }
  }

  /**
   * Envia mensagem para o chat contextual
   */
  static async sendChatMessage(
    message: string,
    context: {
      transcript: string;
      diagnosis: string;
      diseases: string[];
      exams: string[];
      medications: string[];
    },
    chatHistory: { role: 'user' | 'assistant'; content: string }[] = []
  ): Promise<ChatResponse> {
    try {
      const response = await api.post<ChatResponse>('/api/chat', {
        message,
        context,
        chatHistory,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Erro ao enviar mensagem';
        throw new Error(message);
      }
      throw new Error('Erro de conexão no chat');
    }
  }
}