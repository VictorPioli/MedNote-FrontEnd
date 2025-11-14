import React from 'react';
import { DiagnosisResult } from '../../types';
import LanguageService from '../../services/languageService';
import './DiagnosisResult.css';

interface DiagnosisResultProps {
  result: DiagnosisResult;
  onNewSession: () => void;
  onStartChat: () => void;
  language?: 'pt' | 'en';
}

export const DiagnosisResultComponent: React.FC<DiagnosisResultProps> = ({
  result,
  onNewSession,
  onStartChat,
  language = 'pt'
}) => {
  const t = (key: string) => LanguageService.translate(key, language);

  return (
    <div className="diagnosis-result">
      <div className="result-header">
        <h2>🎯 {t('consultationAnalysis')}</h2>
        <p className="disclaimer">
          ⚠️ {t('disclaimer')}
        </p>
      </div>

      <div className="result-grid">
        {/* Diagnóstico Principal */}
        <div className="result-card diagnosis-card">
          <h3>🩺 {t('diagnosis')}</h3>
          <div className="content">
            <p>{result.diagnosis}</p>
          </div>
        </div>

        {/* Doenças Prováveis */}
        <div className="result-card diseases-card">
          <h3>🦠 {t('diseases')}</h3>
          <div className="content">
            {result.diseases && result.diseases.length > 0 ? (
              <ul>
                {result.diseases.map((disease, index) => (
                  <li key={index}>{disease}</li>
                ))}
              </ul>
            ) : (
              <p><em>{t('noDataAvailable')}</em></p>
            )}
          </div>
        </div>

        {/* Exames Sugeridos */}
        <div className="result-card exams-card">
          <h3>🔬 {t('exams')}</h3>
          <div className="content">
            {result.exams && result.exams.length > 0 ? (
              <ul>
                {result.exams.map((exam, index) => (
                  <li key={index}>{exam}</li>
                ))}
              </ul>
            ) : (
              <p><em>{t('noDataAvailable')}</em></p>
            )}
          </div>
        </div>

        {/* Medicamentos */}
        <div className="result-card medications-card">
          <h3>💊 {t('medications')}</h3>
          <div className="content">
            {result.medications && result.medications.length > 0 ? (
              <ul>
                {result.medications.map((medication, index) => (
                  <li key={index}>{medication}</li>
                ))}
              </ul>
            ) : (
              <p><em>{t('noDataAvailable')}</em></p>
            )}
          </div>
        </div>
      </div>

      <div className="result-actions">
        <button 
          className="btn btn-secondary btn-chat"
          onClick={onStartChat}
        >
          💬 {t('chat')}
        </button>
        <button 
          className="btn btn-primary btn-new-session"
          onClick={onNewSession}
        >
          🆕 {t('newConsultation')}
        </button>
      </div>

      <div className="medical-disclaimer">
        <p>
          <strong>{t('important')}</strong> {t('medicalDisclaimer')}
        </p>
      </div>
    </div>
  );
};