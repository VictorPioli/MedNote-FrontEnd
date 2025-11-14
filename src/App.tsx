import React, { useState, useCallback, useEffect } from 'react';
import { 
  Header,
  RecordingControls, 
  TranscriptDisplay, 
  DiagnosisResultComponent, 
  ChatInterface, 
  HistoryView,
  LanguageToggle,
  ExplanationPanel 
} from './components';
import { audioRecorderService } from './services/audioRecorder';
import { ApiService } from './services/api';
import { historyService } from './services/historyService';
import LanguageService from './services/languageService';
import { AppState, DiagnosisResult, ConsultationRecord } from './types';
import './App.css';

const initialState: AppState = {
  isRecording: false,
  transcript: '',
  isTranscribing: false,
  isAnalyzing: false,
  result: null,
  error: null,
  showChat: false,
  showHistory: false,
  chatState: {
    messages: [],
    isLoading: false,
    error: null
  },
  historyState: {
    records: [],
    isLoading: false,
    error: null
  }
};

function App() {
  const [state, setState] = useState<AppState>(initialState);
  const [currentLanguage, setCurrentLanguage] = useState<'pt' | 'en'>('pt');
  const [showExplanation, setShowExplanation] = useState(false);

  const t = (key: string) => LanguageService.translate(key, currentLanguage);
  useEffect(() => {
    const savedLanguage = LanguageService.initializeLanguage();
    setCurrentLanguage(savedLanguage);
  }, []);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleStartRecording = useCallback(async () => {
    if (!audioRecorderService.isRecordingSupported()) {
      updateState({ error: 'Gravação de áudio não suportada neste navegador' });
      return;
    }

    try {
      updateState({ 
        isRecording: true, 
        error: null,
        result: null,
        transcript: '' 
      });

      await audioRecorderService.startRecording();
    } catch (error) {
      updateState({ 
        error: error instanceof Error ? error.message : 'Erro ao iniciar gravação',
        isRecording: false 
      });
    }
  }, [updateState]);

  const handleStopRecording = useCallback(async () => {
    try {
      updateState({ isRecording: false, isTranscribing: true });
      
      const audioFile = await audioRecorderService.stopRecording();
      const transcribeResponse = await ApiService.transcribeAudio(audioFile);
      
      if (transcribeResponse.success) {
        updateState({ 
          transcript: transcribeResponse.transcript,
          isTranscribing: false 
        });
      } else {
        updateState({ 
          error: transcribeResponse.message || 'Erro ao transcrever áudio',
          isTranscribing: false 
        });
      }
    } catch (error) {
      updateState({ 
        error: error instanceof Error ? error.message : 'Erro ao processar áudio',
        isRecording: false,
        isTranscribing: false 
      });
    }
  }, [updateState]);

  const handleFinishSession = useCallback(async () => {
    if (!state.transcript.trim()) {
      updateState({ error: 'Nenhuma transcrição disponível' });
      return;
    }

    // ✅ Proteção contra cliques duplos
    if (state.isAnalyzing) {
      console.log('Diagnóstico já está sendo processado...');
      return;
    }

    updateState({ 
      isAnalyzing: true, 
      error: null 
    });

    try {
      const response = await ApiService.getDiagnosis(state.transcript);
      
      if (response.success) {
        const result: DiagnosisResult = {
          diagnosis: response.diagnosis,
          diseases: response.diseases,
          exams: response.exams,
          medications: response.medications
        };
        updateState({ 
          result,
          isAnalyzing: false 
        });
        
        // ✅ Consulta já foi salva automaticamente pelo backend
        console.log('Diagnóstico recebido - consulta já salva pelo backend');
      } else {
        updateState({ 
          error: response.message || 'Erro ao gerar diagnóstico',
          isAnalyzing: false 
        });
      }
    } catch (error) {
      updateState({ 
        error: error instanceof Error ? error.message : 'Erro ao gerar diagnóstico',
        isAnalyzing: false 
      });
    }
  }, [state.transcript, updateState]);

  const handleNewSession = useCallback(() => {
    setState(initialState);
  }, []);

  const handleStartChat = useCallback(() => {
    updateState({ showChat: true });
  }, [updateState]);

  const handleCloseChat = useCallback(() => {
    updateState({ showChat: false });
  }, [updateState]);

  const handleShowHistory = useCallback(() => {
    updateState({ showHistory: true, showChat: false });
  }, [updateState]);

  const handleCloseHistory = useCallback(() => {
    updateState({ showHistory: false });
  }, [updateState]);

  const handleSelectConsultation = useCallback((record: ConsultationRecord) => {
    updateState({
      transcript: record.transcript,
      result: record.result,
      showHistory: false,
      showChat: false
    });
  }, [updateState]);

  return (
    <div className="app">
      {/* Botão de alternar idioma */}
      <LanguageToggle 
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      <Header 
        onShowHistory={handleShowHistory}
        showHistoryButton={!state.showHistory && !state.showChat}
        language={currentLanguage}
      />
      
      <main className="app-main">
        <div className="container">
          {state.error && (
            <div className="error-message">
              <p>❌ {state.error}</p>
              <button 
                onClick={() => updateState({ error: null })}
                className="btn-close-error"
              >
                ✕
              </button>
            </div>
          )}

          {state.showHistory ? (
            <HistoryView
              onClose={handleCloseHistory}
              onSelectConsultation={handleSelectConsultation}
              language={currentLanguage}
            />
          ) : !state.result ? (
            <>
              <RecordingControls
                isRecording={state.isRecording}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                onFinishSession={handleFinishSession}
                transcript={state.transcript}
                isAnalyzing={state.isAnalyzing}
                isTranscribing={state.isTranscribing}
                disabled={!!state.error}
                language={currentLanguage}
              />

              <TranscriptDisplay
                transcript={state.transcript}
                isRecording={state.isRecording}
                isTranscribing={state.isTranscribing}
                language={currentLanguage}
              />
            </>
          ) : !state.showChat ? (
            <>
              <DiagnosisResultComponent
                result={state.result}
                onNewSession={handleNewSession}
                onStartChat={handleStartChat}
                language={currentLanguage}
              />
              
              {/* Botão para mostrar/ocultar explicação */}
              {state.result?.explanation && (
                <div className="explanation-controls" style={{ textAlign: 'center', margin: '20px 0' }}>
                  <button 
                    className="btn-secondary"
                    onClick={() => setShowExplanation(!showExplanation)}
                    style={{
                      background: showExplanation ? '#f44336' : '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    {showExplanation ? 
                      `🔍 ${t('hideExplanation')}` : 
                      `📁 ${t('showExplanation')}`
                    }
                  </button>
                </div>
              )}
              
              {/* Painel de explicação */}
              {state.result?.explanation && (
                <ExplanationPanel 
                  explanation={state.result.explanation}
                  language={currentLanguage}
                  isVisible={showExplanation}
                />
              )}
            </>
          ) : (
            <ChatInterface
              context={{
                transcript: state.transcript,
                result: state.result
              }}
              onClose={handleCloseChat}
              language={currentLanguage}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>
            🩺 Médico Copilot © 2024 | 
            Ferramenta de apoio médico com IA | 
            Não substitui consulta médica
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;