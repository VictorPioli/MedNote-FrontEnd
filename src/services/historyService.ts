import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  deleteDoc, 
  doc, 
  getDoc,
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { ConsultationRecord, DiagnosisResult } from '../types';

export class FirebaseHistoryService {
  private readonly COLLECTION_NAME = 'MedNote'; // Usar mesma coleção do backend
  private readonly MAX_RECORDS = 50; // Limite de consultas por usuário

  /**
   * Salva uma consulta no histórico
   */
  async saveConsultation(
    transcript: string, 
    result: DiagnosisResult, 
    patientId?: string
  ): Promise<string> {
    try {
      const consultationData = {
        timestamp: Timestamp.now(),
        transcript: transcript.trim(),
        result: {
          diagnosis: result.diagnosis,
          diseases: result.diseases,
          exams: result.exams,
          medications: result.medications
        },
        patientId: patientId || 'anonymous',
        createdAt: new Date().toISOString(),
        version: '1.0'
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), consultationData);
      
      console.log('Consulta salva no histórico:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao salvar consulta:', error);
      throw new Error('Falha ao salvar consulta no histórico');
    }
  }

  /**
   * Recupera o histórico de consultas (adaptado para formato do backend)
   */
  async getConsultationHistory(): Promise<ConsultationRecord[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        orderBy('timestamp', 'desc'),
        limit(this.MAX_RECORDS)
      );

      const querySnapshot = await getDocs(q);
      const records: ConsultationRecord[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Adaptar dados do formato backend para frontend
        const record: ConsultationRecord = {
          id: doc.id,
          timestamp: data.timestamp?.toDate() || data.createdAt?.toDate() || new Date(),
          transcript: data.transcription || data.transcript, // Backend usa 'transcription'
          result: {
            diagnosis: data.diagnosis,
            diseases: data.diseases || [],
            exams: data.exams || [],
            medications: data.medications || []
          }
        };
        
        records.push(record);
      });

      console.log(`✅ Recuperadas ${records.length} consultas do Firebase`);
      return records;
    } catch (error) {
      console.error('❌ Erro ao carregar histórico do Firebase:', error);
      
      // Se der erro, retorna histórico vazio mas não quebra a app
      return [];
    }
  }

  /**
   * Recupera uma consulta específica
   */
  async getConsultation(consultationId: string): Promise<ConsultationRecord | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, consultationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Adaptar dados do formato backend para frontend
        return {
          id: docSnap.id,
          timestamp: data.timestamp?.toDate() || data.createdAt?.toDate() || new Date(),
          transcript: data.transcription || data.transcript, // Backend usa 'transcription'
          result: {
            diagnosis: data.diagnosis,
            diseases: data.diseases || [],
            exams: data.exams || [],
            medications: data.medications || []
          },
          patientId: data.patientId,
          audioFileName: data.audioFileName
        };
      }

      return null;
    } catch (error) {
      console.error('Erro ao carregar consulta:', error);
      return null;
    }
  }

  /**
   * Deleta uma consulta do histórico
   */
  async deleteConsultation(consultationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION_NAME, consultationId));
      console.log('Consulta deletada:', consultationId);
    } catch (error) {
      console.error('Erro ao deletar consulta:', error);
      throw new Error('Falha ao deletar consulta');
    }
  }

  /**
   * Limpa todo o histórico do usuário
   */
  async clearHistory(patientId: string = 'anonymous'): Promise<void> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('patientId', '==', patientId)
      );

      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      
      await Promise.all(deletePromises);
      console.log(`Histórico limpo para usuário: ${patientId}`);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
      throw new Error('Falha ao limpar histórico');
    }
  }

  /**
   * Gera estatísticas do histórico
   */
  async getHistoryStats(patientId: string = 'anonymous'): Promise<{
    totalConsultations: number;
    mostCommonDiseases: string[];
    lastConsultation?: Date;
  }> {
    try {
      const records = await this.getConsultationHistory();
      
      const diseaseCount: { [key: string]: number } = {};
      records.forEach(record => {
        record.result.diseases.forEach(disease => {
          diseaseCount[disease] = (diseaseCount[disease] || 0) + 1;
        });
      });

      const mostCommonDiseases = Object.entries(diseaseCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([disease]) => disease);

      return {
        totalConsultations: records.length,
        mostCommonDiseases,
        lastConsultation: records.length > 0 ? records[0].timestamp : undefined
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      return {
        totalConsultations: 0,
        mostCommonDiseases: [],
        lastConsultation: undefined
      };
    }
  }

  /**
   * Verifica se o Firebase está configurado corretamente
   */
  async testConnection(): Promise<boolean> {
    try {
      // Tenta fazer uma query simples para testar a conexão
      const q = query(
        collection(db, this.COLLECTION_NAME),
        limit(1)
      );
      await getDocs(q);
      return true;
    } catch (error) {
      console.warn('Firebase não configurado ou inacessível:', error);
      return false;
    }
  }
}

// Instância singleton
export const historyService = new FirebaseHistoryService();