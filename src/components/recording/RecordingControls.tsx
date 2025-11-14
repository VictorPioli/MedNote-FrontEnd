import React from 'react';
import { audioRecorderService } from '../../services/audioRecorder';
import LanguageService from '../../services/languageService';
import './RecordingControls.css';

interface RecordingControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onFinishSession: () => void;
  transcript: string;
  isAnalyzing: boolean;
  isTranscribing?: boolean;
  disabled?: boolean;
  language?: 'pt' | 'en';
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onFinishSession,
  transcript,
  isAnalyzing,
  isTranscribing = false,
  disabled = false,
  language = 'pt'
}) => {
  const t = (key: string) => LanguageService.translate(key, language);
  const canFinish = transcript.trim().length > 0 && !isRecording && !isAnalyzing && !isTranscribing;
  const recordingSupported = audioRecorderService.isRecordingSupported();

  if (!recordingSupported) {
    return (
      <div className="recording-controls">
        <div className="speech-not-supported">
          <p>⚠️ {t('audioNotSupported')}</p>
          <p>{t('browserRecommendation')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recording-controls">
      <div className="control-buttons">
        {!isRecording ? (
          <button
            className="btn btn-primary btn-start"
            onClick={onStartRecording}
            disabled={disabled || isAnalyzing || isTranscribing}
          >
            🎤 {t('startRecording')}
          </button>
        ) : (
          <button
            className="btn btn-danger btn-stop"
            onClick={onStopRecording}
            disabled={disabled}
          >
            🛑 {t('stopRecording')}
          </button>
        )}

        {canFinish && (
          <button
            className="btn btn-success btn-finish"
            onClick={onFinishSession}
            disabled={disabled}
          >
            ✅ {t('finishConsultation')}
          </button>
        )}
      </div>

      {isRecording && (
        <div className="recording-indicator">
          <div className="pulse"></div>
          <span>{t('recording')}</span>
        </div>
      )}

      {isTranscribing && (
        <div className="analyzing-indicator">
          <div className="spinner"></div>
          <span>{t('transcribing')}</span>
        </div>
      )}

      {isAnalyzing && (
        <div className="analyzing-indicator">
          <div className="spinner"></div>
          <span>{t('analyzing')}</span>
        </div>
      )}
    </div>
  );
};