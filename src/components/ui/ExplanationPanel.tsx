import React from 'react';
import './ExplanationPanel.css';

interface DiagnosisExplanation {
  reasoning: string;
  confidence: number;
  keySymptoms: string[];
  differentialDiagnoses: string[];
  recommendationBasis: string;
}

interface ExplanationPanelProps {
  explanation: DiagnosisExplanation;
  language: 'pt' | 'en';
  isVisible: boolean;
}

interface Translation {
  pt: string;
  en: string;
}

const translations: Record<string, Translation> = {
  title: {
    pt: 'Explicação do Diagnóstico',
    en: 'Diagnosis Explanation'
  },
  reasoning: {
    pt: 'Raciocínio Clínico',
    en: 'Clinical Reasoning'
  },
  confidence: {
    pt: 'Nível de Confiança',
    en: 'Confidence Level'
  },
  keySymptoms: {
    pt: 'Sintomas Principais',
    en: 'Key Symptoms'
  },
  differentialDiagnoses: {
    pt: 'Diagnósticos Diferenciais',
    en: 'Differential Diagnoses'
  },
  recommendationBasis: {
    pt: 'Base das Recomendações',
    en: 'Recommendation Basis'
  },
  high: {
    pt: 'Alto',
    en: 'High'
  },
  medium: {
    pt: 'Médio',
    en: 'Medium'
  },
  low: {
    pt: 'Baixo',
    en: 'Low'
  }
};

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  explanation,
  language,
  isVisible
}) => {
  const t = (key: string) => translations[key]?.[language] || key;

  const getConfidenceLevel = (confidence: number): string => {
    if (confidence >= 0.8) return t('high');
    if (confidence >= 0.6) return t('medium');
    return t('low');
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return '#4CAF50'; // Verde
    if (confidence >= 0.6) return '#FF9800'; // Laranja
    return '#F44336'; // Vermelho
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="explanation-panel">
      <div className="explanation-header">
        <h3>{t('title')}</h3>
      </div>

      <div className="explanation-content">
        {/* Raciocínio Clínico */}
        <div className="explanation-section">
          <h4>{t('reasoning')}</h4>
          <div className="reasoning-text">
            {explanation.reasoning}
          </div>
        </div>

        {/* Nível de Confiança */}
        <div className="explanation-section">
          <h4>{t('confidence')}</h4>
          <div className="confidence-container">
            <div className="confidence-bar-container">
              <div 
                className="confidence-bar"
                style={{ 
                  width: `${explanation.confidence * 100}%`,
                  backgroundColor: getConfidenceColor(explanation.confidence)
                }}
              />
            </div>
            <span className="confidence-text" style={{ color: getConfidenceColor(explanation.confidence) }}>
              {Math.round(explanation.confidence * 100)}% - {getConfidenceLevel(explanation.confidence)}
            </span>
          </div>
        </div>

        {/* Sintomas Principais */}
        {explanation.keySymptoms && explanation.keySymptoms.length > 0 && (
          <div className="explanation-section">
            <h4>{t('keySymptoms')}</h4>
            <div className="symptoms-list">
              {explanation.keySymptoms.map((symptom, index) => (
                <span key={index} className="symptom-tag">
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Diagnósticos Diferenciais */}
        {explanation.differentialDiagnoses && explanation.differentialDiagnoses.length > 0 && (
          <div className="explanation-section">
            <h4>{t('differentialDiagnoses')}</h4>
            <ul className="differential-list">
              {explanation.differentialDiagnoses.map((diagnosis, index) => (
                <li key={index} className="differential-item">
                  {diagnosis}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Base das Recomendações */}
        <div className="explanation-section">
          <h4>{t('recommendationBasis')}</h4>
          <div className="recommendation-text">
            {explanation.recommendationBasis}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplanationPanel;