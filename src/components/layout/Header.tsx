import React from 'react';
import LanguageService from '../../services/languageService';
import './Header.css';

interface HeaderProps {
  className?: string;
  onShowHistory?: () => void;
  showHistoryButton?: boolean;
  language?: 'pt' | 'en';
}

export const Header: React.FC<HeaderProps> = ({ 
  className, 
  onShowHistory, 
  showHistoryButton = true,
  language = 'pt'
}) => {
  const t = (key: string) => LanguageService.translate(key, language);

  return (
    <header className={`header ${className || ''}`}>
      <div className="header-content">
        <div className="header-main">
          <h1 className="header-title">
            🩺 {t('appTitle')}
          </h1>
          <p className="header-subtitle">
            {t('appSubtitle')}
          </p>
        </div>
        
        {showHistoryButton && onShowHistory && (
          <div className="header-actions">
            <button 
              onClick={onShowHistory}
              className="btn-history"
              title={t('history')}
            >
               {t('history')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};