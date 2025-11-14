import axios from 'axios';
import { ConsultationRecord, DiagnosisResult } from '../types';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

export class BackendHistoryService {
  /**
   * Recupera o histórico de consultas via backend
   */
  async getConsultationHistory(): Promise<ConsultationRecord[]> {
    try {
      console.log('🔄 Carregando histórico via backend...');
      
      const response = await api.get(API_CONFIG.ENDPOINTS.CONSULTATIONS);
      
      if (response.data.success) {
        const consultations = response.data.consultations;
        console.log(`📊 Histórico carregado: ${consultations.length} registros`);
        
        // Mapear dados do backend para o formato esperado pelo frontend
        return consultations.map((consultation: any): ConsultationRecord => ({
          id: consultation.id,
          timestamp: new Date(consultation.timestamp),
          transcript: consultation.transcription || consultation.transcript || '',
          result: {
            diagnosis: consultation.diagnosis || '',
            diseases: Array.isArray(consultation.diseases) ? consultation.diseases : [],
            exams: Array.isArray(consultation.exams) ? consultation.exams : [],
            medications: Array.isArray(consultation.medications) ? consultation.medications : []
          }
        }));
      } else {
        console.error('❌ Backend retornou erro:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('❌ Erro ao carregar histórico via backend:', error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Erro ao carregar histórico';
        throw new Error(message);
      }
      throw new Error('Erro de conexão ao carregar histórico');
    }
  }

  /**
   * Recupera uma consulta específica via backend
   */
  async getConsultation(consultationId: string): Promise<ConsultationRecord | null> {
    try {
      const response = await api.get(`/api/consultations/${consultationId}`);
      
      if (response.data.success) {
        const consultation = response.data.consultation;
        return {
          id: consultation.id,
          timestamp: new Date(consultation.timestamp),
          transcript: consultation.transcription || consultation.transcript || '',
          result: {
            diagnosis: consultation.diagnosis || '',
            diseases: Array.isArray(consultation.diseases) ? consultation.diseases : [],
            exams: Array.isArray(consultation.exams) ? consultation.exams : [],
            medications: Array.isArray(consultation.medications) ? consultation.medications : []
          }
        };
      }
      return null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error('❌ Erro ao carregar consulta:', error);
      throw new Error('Erro ao carregar consulta');
    }
  }

  /**
   * Deleta uma consulta via backend
   */
  async deleteConsultation(consultationId: string): Promise<void> {
    try {
      await api.delete(`/api/consultations/${consultationId}`);
      console.log('✅ Consulta deletada via backend');
    } catch (error) {
      console.error('❌ Erro ao deletar consulta:', error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Erro ao deletar consulta';
        throw new Error(message);
      }
      throw new Error('Erro de conexão ao deletar consulta');
    }
  }

  /**
   * Obtém estatísticas do histórico
   */
  async getHistoryStats(): Promise<{
    totalConsultations: number;
    lastConsultation?: Date;
    mostCommonDiseases: string[];
  }> {
    try {
      // Usar a mesma rota de consultas para calcular estatísticas
      const history = await this.getConsultationHistory();
      
      const totalConsultations = history.length;
      const lastConsultation = history.length > 0 ? history[0].timestamp : undefined;
      
      // Calcular doenças mais comuns
      const diseaseCount: { [key: string]: number } = {};
      history.forEach(record => {
        record.result.diseases.forEach(disease => {
          diseaseCount[disease] = (diseaseCount[disease] || 0) + 1;
        });
      });
      
      const mostCommonDiseases = Object.entries(diseaseCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([disease]) => disease);
      
      return {
        totalConsultations,
        lastConsultation,
        mostCommonDiseases
      };
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
      return {
        totalConsultations: 0,
        mostCommonDiseases: []
      };
    }
  }

  /**
   * Testa conectividade com o backend
   */
  async testBackendConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testando conexão com backend...');
      await api.get('/api/health');
      console.log('✅ Conexão com backend OK');
      return true;
    } catch (error) {
      console.error('❌ Erro na conexão com backend:', error);
      return false;
    }
  }
}

// Instância singleton
export const historyService = new BackendHistoryService();