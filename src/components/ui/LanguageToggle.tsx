import React from 'react';
import LanguageService from '../../services/languageService';
import './LanguageToggle.css';

interface LanguageToggleProps {
  currentLanguage: 'pt' | 'en';
  onLanguageChange: (language: 'pt' | 'en') => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  currentLanguage,
  onLanguageChange
}) => {
  const handleToggle = () => {
    const newLanguage = currentLanguage === 'pt' ? 'en' : 'pt';
    LanguageService.setLanguage(newLanguage);
    onLanguageChange(newLanguage);
  };

  return (
    <button className="language-toggle" onClick={handleToggle} title="Alterar idioma / Switch language">
      <div className="language-toggle-content">
        <span className="language-icon">🌐</span>
        <span className="language-text">
          {currentLanguage === 'pt' ? 'EN' : 'PT'}
        </span>
      </div>
    </button>
  );
};

export default LanguageToggle;