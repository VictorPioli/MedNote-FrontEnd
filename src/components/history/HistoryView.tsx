import React, { useState, useEffect } from 'react';
import { ConsultationRecord } from '../../types';
import { historyService } from '../../services/historyService';
import LanguageService from '../../services/languageService';
import './HistoryView.css';

interface HistoryViewProps {
  onClose: () => void;
  onSelectConsultation: (record: ConsultationRecord) => void;
  language: 'pt' | 'en';
}

export const HistoryView: React.FC<HistoryViewProps> = ({ 
  onClose, 
  onSelectConsultation, 
  language = 'pt' 
}) => {
  const [records, setRecords] = useState<ConsultationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalConsultations: number;
    mostCommonDiseases: string[];
    lastConsultation?: Date;
  } | null>(null);

  const t = (key: string) => LanguageService.translate(key, language);

  useEffect(() => {
    loadHistory();
    loadStats();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const history = await historyService.getConsultationHistory();
      setRecords(history);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setError(t('historyError'));
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statistics = await historyService.getHistoryStats();
      setStats(statistics);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!window.confirm(t('confirmDelete'))) {
      return;
    }

    try {
      await historyService.deleteConsultation(recordId);
      await loadHistory();
      await loadStats();
    } catch (error) {
      setError(t('deleteError'));
    }
  };

  const formatDate = (date: Date) => {
    const locale = language === 'pt' ? 'pt-BR' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const truncateText = (text: string | undefined | null, maxLength: number = 100) => {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="history-view">
      <div className="history-header">
        <h2>{t('historyTitle')}</h2>
        <button onClick={onClose} className="btn-close">✕</button>
      </div>

      {stats && (
        <div className="history-stats">
          <div className="stat-card">
            <h3>{t('historyStats')}</h3>
            <div className="stat-grid">
              <div className="stat-item">
                <span className="stat-number">{stats.totalConsultations}</span>
                <span className="stat-label">{t('consultationsCount')}</span>
              </div>
              {stats.lastConsultation && (
                <div className="stat-item">
                  <span className="stat-date">{formatDate(stats.lastConsultation)}</span>
                  <span className="stat-label">{t('lastConsultation')}</span>
                </div>
              )}
            </div>
            {stats.mostCommonDiseases.length > 0 && (
              <div className="common-diseases">
                <h4>{t('mostCommonDiagnoses')}</h4>
                <div className="disease-tags">
                  {stats.mostCommonDiseases.slice(0, 3).map((disease, index) => (
                    <span key={index} className="disease-tag">{disease}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="history-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>{t('loadingHistory')}</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>❌ {error}</p>
            <button onClick={loadHistory} className="btn btn-secondary">{t('tryAgain')}</button>
          </div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>{t('noConsultationsFound')}</h3>
            <p>{t('consultationsWillAppear')}</p>
          </div>
        ) : (
          <>
            <div className="records-list">
              {records.map((record) => (
                <div key={record.id} className="record-card">
                  <div className="record-header">
                    <span className="record-date">{formatDate(record.timestamp)}</span>
                    <div className="record-actions">
                      <button 
                        onClick={() => onSelectConsultation(record)}
                        className="btn btn-sm btn-primary"
                      >
                        {t('viewRecord')}
                      </button>
                      <button 
                        onClick={() => handleDeleteRecord(record.id)}
                        className="btn btn-sm btn-danger"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="record-content">
                    <div className="transcript-preview">
                      <h4>{t('transcriptionLabel')}</h4>
                      <p>{truncateText(record.transcript)}</p>
                    </div>
                    
                    <div className="diagnosis-preview">
                      <h4>{t('diagnosisLabel')}</h4>
                      <p>{truncateText(record.result.diagnosis)}</p>
                    </div>
                    
                    {record.result.diseases.length > 0 && (
                      <div className="diseases-preview">
                        <h4>{t('diseasesLabel')}</h4>
                        <div className="disease-chips">
                          {record.result.diseases.slice(0, 3).map((disease, index) => (
                            <span key={index} className="disease-chip">{disease}</span>
                          ))}
                          {record.result.diseases.length > 3 && (
                            <span className="more-indicator">+{record.result.diseases.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};