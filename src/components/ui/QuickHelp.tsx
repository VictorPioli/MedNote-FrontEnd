import React, { useState } from 'react';
import './QuickHelp.css';

export const QuickHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="quick-help">
      <button 
        className="help-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ajuda rápida"
      >
        ❓ Ajuda
      </button>

      {isOpen && (
        <div className="help-content">
          <div className="help-header">
            <h3>🎤 Guia Rápido - Captura de Áudio</h3>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="help-sections">
            <div className="help-section">
              <h4>🎤 Microfone</h4>
              <ul>
                <li>Para gravações diretas</li>
                <li>Consultas presenciais</li>
                <li>Notas pessoais</li>
              </ul>
            </div>

            <div className="help-section">
              <h4>🖥️ Sistema/Reunião</h4>
              <ul>
                <li>Para gravar Meet, Zoom, Teams</li>
                <li><strong>IMPORTANTE:</strong> Marque "Compartilhar áudio"</li>
                <li>Ideal para reuniões médicas</li>
              </ul>
            </div>

            <div className="help-section">
              <h4>🎤+🖥️ Ambos</h4>
              <ul>
                <li>Microfone + sistema juntos</li>
                <li>Para participar da reunião</li>
                <li>Melhor qualidade de captura</li>
              </ul>
            </div>

            <div className="help-section browsers">
              <h4>🌐 Navegadores Suportados</h4>
              <div className="browser-list">
                <span className="browser supported">✅ Chrome 72+</span>
                <span className="browser supported">✅ Edge 79+</span>
                <span className="browser limited">⚠️ Firefox (limitado)</span>
                <span className="browser partial">🎤 Safari (só microfone)</span>
              </div>
            </div>

            <div className="help-section troubleshoot">
              <h4>🔧 Problemas Comuns</h4>
              <div className="problem">
                <strong>Áudio mudo na reunião:</strong>
                <br />Certifique-se de marcar "Compartilhar áudio"
              </div>
              <div className="problem">
                <strong>Permissão negada:</strong>
                <br />Vá em Configurações → Privacidade
              </div>
            </div>
          </div>

          <div className="help-footer">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                // Aqui você pode abrir a documentação completa
                alert('Documentação completa disponível em AUDIO_CAPTURE_GUIDE.md');
              }}
            >
              📖 Ver documentação completa
            </a>
          </div>
        </div>
      )}
    </div>
  );
};