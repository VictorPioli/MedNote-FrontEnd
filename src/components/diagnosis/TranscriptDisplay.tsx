import React from 'react';
import LanguageService from '../../services/languageService';
import './TranscriptDisplay.css';

interface TranscriptDisplayProps {
  transcript: string;
  isRecording: boolean;
  isTranscribing?: boolean;
  language?: 'pt' | 'en';
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  transcript,
  isRecording,
  isTranscribing = false,
  language = 'pt'
}) => {
  const t = (key: string) => LanguageService.translate(key, language);

  if (!transcript && !isRecording && !isTranscribing) {
    return (
      <div className="transcript-display">
        <div className="transcript-placeholder">
          <p>🎤 {t('startRecordingPrompt')}</p>
          <p>{t('audioWillBeTranscribed')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transcript-display">
      <h3 className="transcript-title">
        📝 {t('transcription')}
        {isRecording && <span className="live-indicator">{t('recordingStatus')}</span>}
        {isTranscribing && <span className="live-indicator transcribing">{t('transcribingStatus')}</span>}
      </h3>
      <div className="transcript-content">
        {isTranscribing ? (
          <p className="transcribing-text">
            🔄 {t('processingAudio')}
          </p>
        ) : (
          <p>{transcript || (isRecording ? t('recordingAudio') : '')}</p>
        )}
        {isRecording && <span className="cursor-blink">●</span>}
      </div>
      <div className="transcript-stats">
        {transcript && !isTranscribing && (
          <small>
            {transcript.split(' ').filter(word => word.length > 0).length} {t('words')}
            • {transcript.length} {t('characters')}
          </small>
        )}
      </div>
    </div>
  );
};