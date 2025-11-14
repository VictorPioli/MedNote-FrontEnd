import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, DiagnosisResult } from '../../types';
import { ApiService } from '../../services/api';
import LanguageService from '../../services/languageService';
import './ChatInterface.css';

interface ChatInterfaceProps {
  context: {
    transcript: string;
    result: DiagnosisResult;
  };
  onClose: () => void;
  language?: 'pt' | 'en';
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  context, 
  onClose, 
  language = 'pt' 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const t = (key: string) => LanguageService.translate(key, language);

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mensagem inicial do assistente
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: `${t('chatWelcomeIntro')}

${t('chatWelcomeDiagnosis')}: ${context.result.diagnosis}
${t('chatWelcomeExams')}: ${context.result.exams.join(', ') || t('noExamsRecommended')}
${t('chatWelcomeMedications')}: ${context.result.medications.join(', ') || t('noMedicationsRecommended')}

${t('chatWelcomeEnd')}`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [context.result, language]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await ApiService.sendChatMessage(
        userMessage.content,
        {
          transcript: context.transcript,
          diagnosis: context.result.diagnosis,
          diseases: context.result.diseases,
          exams: context.result.exams,
          medications: context.result.medications
        },
        messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      );

      if (!response.success) {
        throw new Error(response.error || t('chatError'));
      }

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro no chat:', error);
      setError(error instanceof Error ? error.message : t('chatError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>{t('chatTitle')}</h3>
        <button onClick={onClose} className="btn-close">✕</button>
      </div>

      <div className="chat-messages">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <div className="message-avatar">
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <div className="message-text">
                {message.content}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message assistant-message">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>{t('typing')}</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="chat-error">
            <p>❌ {error}</p>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chatPlaceholder')}
            disabled={isLoading}
            rows={2}
          />
          <button 
            onClick={sendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            className="btn-send"
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
        <div className="input-hint">
          <small>{t('chatInputHint')}</small>
        </div>
      </div>
    </div>
  );
};